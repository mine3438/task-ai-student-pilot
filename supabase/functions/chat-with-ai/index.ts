
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
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const callAnthropic = async (messages: any[]) => {
  // Convert OpenAI format to Anthropic format
  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${anthropicApiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      system: systemMessage?.content || '',
      messages: conversationMessages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
};

const callTogether = async (messages: any[]) => {
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
    throw new Error(`Together API error: ${response.status}`);
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
            
            // Final fallback to Anthropic if available
            if (anthropicApiKey) {
              try {
                console.log('Final fallback to Anthropic API...');
                aiResponse = await callAnthropic(messages);
                provider = 'Anthropic Claude-3-Haiku';
              } catch (anthropicError) {
                console.error('All providers failed:', anthropicError.message);
                throw new Error('All AI providers are currently unavailable');
              }
            } else {
              throw new Error('OpenAI and Together.ai failed, no Anthropic API key configured');
            }
          }
        } else if (anthropicApiKey) {
          try {
            console.log('Falling back to Anthropic API...');
            aiResponse = await callAnthropic(messages);
            provider = 'Anthropic Claude-3-Haiku';
          } catch (anthropicError) {
            console.error('Anthropic also failed:', anthropicError.message);
            throw new Error('OpenAI and Anthropic providers are currently unavailable');
          }
        } else {
          throw new Error('OpenAI failed and no other API keys configured');
        }
      }
    } else if (togetherApiKey) {
      try {
        console.log('Using Together.ai API (no OpenAI key)...');
        aiResponse = await callTogether(messages);
        provider = 'Together.ai Llama-3.3-70B';
      } catch (error) {
        console.error('Together.ai failed:', error.message);
        
        // Fallback to Anthropic if available
        if (anthropicApiKey) {
          try {
            console.log('Falling back to Anthropic API...');
            aiResponse = await callAnthropic(messages);
            provider = 'Anthropic Claude-3-Haiku';
          } catch (anthropicError) {
            console.error('Anthropic also failed:', anthropicError.message);
            throw new Error('Together.ai and Anthropic providers are currently unavailable');
          }
        } else {
          throw new Error('Together.ai failed and no other API keys configured');
        }
      }
    } else if (anthropicApiKey) {
      try {
        console.log('Using Anthropic API (no OpenAI or Together.ai key)...');
        aiResponse = await callAnthropic(messages);
        provider = 'Anthropic Claude-3-Haiku';
      } catch (error) {
        console.error('Anthropic failed:', error.message);
        throw new Error('AI provider is currently unavailable');
      }
    } else {
      throw new Error('No AI API keys configured');
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
