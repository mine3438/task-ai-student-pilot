
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const togetherApiKey = Deno.env.get('TOGETHER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const callOpenAI = async (messages: any[]) => {
  console.log('Calling OpenAI with messages:', messages.length);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const callTogether = async (messages: any[]) => {
  console.log('Calling Together.ai with messages:', messages.length);
  
  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${togetherApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Together API error:', response.status, errorText);
    throw new Error(`Together API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    console.log('Received chat request:', { message, historyLength: conversationHistory.length });

    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string');
    }

    const messages = [
      {
        role: 'system',
        content: `You are an AI study assistant for StudyFlow, a task management app for students. You help with:
        - Task management and organization
        - Study schedule planning
        - Productivity tips and techniques
        - Deadline management
        - Motivation and stress management
        - Academic goal setting
        
        Keep responses helpful, encouraging, and focused on study productivity. Be concise but thorough.`
      },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      {
        role: 'user',
        content: message
      }
    ];

    let aiResponse;
    let provider = 'none';

    // Try OpenAI first if API key is available
    if (openAIApiKey) {
      try {
        console.log('Trying OpenAI API...');
        aiResponse = await callOpenAI(messages);
        provider = 'OpenAI GPT-4o-mini';
      } catch (error) {
        console.error('OpenAI failed:', error.message);
        
        // Fallback to Together.ai if available
        if (togetherApiKey) {
          try {
            console.log('Falling back to Together.ai API...');
            aiResponse = await callTogether(messages);
            provider = 'Together.ai Llama-3.3-70B';
          } catch (togetherError) {
            console.error('Together.ai also failed:', togetherError.message);
            throw new Error('All AI providers are currently unavailable. Please check your API keys and try again.');
          }
        } else {
          throw error; // Re-throw OpenAI error if no fallback available
        }
      }
    } else if (togetherApiKey) {
      try {
        console.log('Using Together.ai API (no OpenAI key)...');
        aiResponse = await callTogether(messages);
        provider = 'Together.ai Llama-3.3-70B';
      } catch (error) {
        console.error('Together.ai failed:', error.message);
        throw error;
      }
    } else {
      throw new Error('No AI API keys configured. Please add OPENAI_API_KEY or TOGETHER_API_KEY to your Supabase secrets.');
    }

    console.log(`Response generated using: ${provider}`);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      provider: provider 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    
    // Provide more specific error messages
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let statusCode = 500;
    
    if (error.message.includes('API key')) {
      errorMessage = 'AI service configuration error. Please contact support.';
      statusCode = 503;
    } else if (error.message.includes('rate limit') || error.message.includes('429')) {
      errorMessage = 'AI service is currently busy. Please try again in a moment.';
      statusCode = 429;
    } else if (error.message.includes('unavailable')) {
      errorMessage = 'AI services are temporarily unavailable. Please try again later.';
      statusCode = 503;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error.message 
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
