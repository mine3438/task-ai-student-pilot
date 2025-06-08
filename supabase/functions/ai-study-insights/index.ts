
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, tasks, currentTask = null } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'suggest_tasks':
        systemPrompt = `You are an AI study assistant that analyzes study patterns and suggests intelligent tasks. Based on the user's task history, suggest 3-5 relevant tasks that would help them improve their studies. Consider their subjects, completion patterns, and academic goals.`;
        userPrompt = `Based on these existing tasks: ${JSON.stringify(tasks)}
        
        Suggest 3-5 new tasks that would be beneficial for the user's study progress. Consider:
        - Subjects they're working on
        - Gaps in their study routine
        - Review sessions for completed topics
        - Preparation for upcoming deadlines
        
        Return ONLY a JSON array of suggested tasks in this format:
        [
          {
            "title": "Task title",
            "description": "Task description",
            "category": "Assignment|Exam|Study|Personal",
            "priority": "High|Medium|Low",
            "estimatedDuration": "estimated time in minutes"
          }
        ]`;
        break;

      case 'predict_deadline':
        systemPrompt = `You are an AI deadline prediction assistant. Based on task complexity, user's completion patterns, and workload, predict realistic deadlines.`;
        userPrompt = `Based on this task: ${JSON.stringify(currentTask)}
        And user's task history: ${JSON.stringify(tasks)}
        
        Analyze the user's completion patterns and suggest a realistic deadline. Consider:
        - Task complexity and category
        - User's average completion time for similar tasks
        - Current workload
        - Buffer time for unexpected delays
        
        Return ONLY a JSON object in this format:
        {
          "suggestedDeadline": "YYYY-MM-DD",
          "reasoning": "Brief explanation of why this deadline is realistic",
          "confidence": "High|Medium|Low"
        }`;
        break;

      case 'optimize_schedule':
        systemPrompt = `You are an AI study schedule optimizer. Create an optimal study schedule based on task priorities, deadlines, and learning patterns.`;
        userPrompt = `Based on these tasks: ${JSON.stringify(tasks)}
        
        Create an optimized study schedule for the next 7 days. Consider:
        - Task priorities and deadlines
        - Optimal study session lengths (25-50 minutes)
        - Brain-friendly study patterns
        - Work-life balance
        - Review sessions for retention
        
        Return ONLY a JSON object in this format:
        {
          "schedule": [
            {
              "day": "Monday",
              "sessions": [
                {
                  "time": "09:00-10:00",
                  "task": "Task title",
                  "type": "Study|Review|Break",
                  "priority": "High|Medium|Low"
                }
              ]
            }
          ],
          "tips": ["Study tip 1", "Study tip 2"],
          "totalStudyHours": 25
        }`;
        break;

      default:
        throw new Error('Invalid action');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      // Fallback if AI doesn't return valid JSON
      parsedResponse = { error: 'Failed to parse AI response', rawResponse: aiResponse };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-study-insights function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
