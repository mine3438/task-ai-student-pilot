
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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
    
    // Get authorization header to identify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    // Create Supabase client with service role key for accessing user habits
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Fetch user habits and preferences for personalized AI responses
    const { data: userHabits } = await supabase
      .from('user_habits')
      .select('*')
      .eq('user_id', user.id);

    const { data: userPreferences } = await supabase
      .from('user_learning_preferences')
      .select('*')
      .eq('user_id', user.id);

    const { data: taskInteractions } = await supabase
      .from('task_interactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    let systemPrompt = '';
    let userPrompt = '';

    // Build personalized context from user habits
    const personalizedContext = buildPersonalizedContext(userHabits || [], userPreferences || [], taskInteractions || []);

    switch (action) {
      case 'suggest_tasks':
        systemPrompt = `You are an AI study assistant that analyzes study patterns and suggests intelligent tasks. You have access to the user's learning habits and preferences to provide highly personalized suggestions.

User's personalized context:
${personalizedContext}

Based on this personalized data and the user's task history, suggest 3-5 relevant tasks that align with their habits and preferences.`;

        userPrompt = `Based on these existing tasks: ${JSON.stringify(tasks)}
        
        And my personal learning patterns shown above, suggest 3-5 new tasks that would be beneficial for my study progress. Consider:
        - My preferred subjects and categories
        - My optimal study times and completion patterns
        - Gaps in my study routine that align with my habits
        - Review sessions for completed topics in my preferred style
        - Preparation for upcoming deadlines based on my completion patterns
        
        Return ONLY a JSON array of suggested tasks in this format:
        [
          {
            "title": "Task title",
            "description": "Task description tailored to my preferences",
            "category": "Assignment|Exam|Study|Personal",
            "priority": "High|Medium|Low",
            "estimatedDuration": "estimated time based on my completion patterns"
          }
        ]`;
        break;

      case 'predict_deadline':
        systemPrompt = `You are an AI deadline prediction assistant. You use the user's personal completion patterns and habits to predict realistic deadlines.

User's personalized context:
${personalizedContext}`;

        userPrompt = `Based on this task: ${JSON.stringify(currentTask)}
        My task history: ${JSON.stringify(tasks)}
        And my personal completion patterns shown above,
        
        Predict a realistic deadline considering:
        - My historical completion times for similar tasks
        - My optimal productivity hours
        - My category preferences and performance
        - My typical deadline accuracy
        - Buffer time based on my delay patterns
        
        Return ONLY a JSON object in this format:
        {
          "suggestedDeadline": "YYYY-MM-DD",
          "reasoning": "Personalized explanation based on my habits",
          "confidence": "High|Medium|Low"
        }`;
        break;

      case 'optimize_schedule':
        systemPrompt = `You are an AI study schedule optimizer. You create optimal study schedules based on the user's personal habits, preferences, and productivity patterns.

User's personalized context:
${personalizedContext}`;

        userPrompt = `Based on these tasks: ${JSON.stringify(tasks)}
        And my personal learning patterns shown above,
        
        Create an optimized study schedule for the next 7 days that considers:
        - My optimal productivity hours from completion patterns
        - My preferred categories and subjects
        - My typical task completion times
        - My preferred break patterns
        - My historical success rates with different approaches
        
        Return ONLY a JSON object in this format:
        {
          "schedule": [
            {
              "day": "Monday",
              "sessions": [
                {
                  "time": "optimal time based on my patterns",
                  "task": "Task title",
                  "type": "Study|Review|Break",
                  "priority": "High|Medium|Low"
                }
              ]
            }
          ],
          "tips": ["Personalized study tips based on my habits"],
          "totalStudyHours": 25,
          "personalizedInsights": "Why this schedule works for my specific patterns"
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

function buildPersonalizedContext(habits: any[], preferences: any[], interactions: any[]): string {
  let context = "PERSONALIZED LEARNING PROFILE:\n";
  
  // Analyze completion time patterns
  const timeHabit = habits.find(h => h.habit_type === 'optimal_completion_time');
  if (timeHabit && timeHabit.habit_data?.hour_preferences) {
    const hourPrefs = timeHabit.habit_data.hour_preferences;
    const bestHours = Object.entries(hourPrefs)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour}:00`);
    context += `- Most productive hours: ${bestHours.join(', ')} (confidence: ${Math.round(timeHabit.confidence_score * 100)}%)\n`;
  }
  
  // Analyze category preferences
  const categoryHabit = habits.find(h => h.habit_type === 'category_preference');
  if (categoryHabit && categoryHabit.habit_data?.preferences) {
    const catPrefs = categoryHabit.habit_data.preferences;
    const topCategories = Object.entries(catPrefs)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 3)
      .map(([cat, count]) => `${cat} (${count} completions)`);
    context += `- Preferred categories: ${topCategories.join(', ')}\n`;
  }
  
  // Analyze suggestion accuracy
  const accuracyHabit = habits.find(h => h.habit_type === 'suggestion_accuracy');
  if (accuracyHabit && accuracyHabit.habit_data) {
    const accuracy = Math.round(accuracyHabit.habit_data.accuracy * 100);
    context += `- AI suggestion acceptance rate: ${accuracy}% (${accuracyHabit.habit_data.accepted}/${accuracyHabit.habit_data.total})\n`;
  }
  
  // Analyze recent interaction patterns
  const recentCompletions = interactions.filter(i => i.interaction_type === 'completed').slice(0, 10);
  if (recentCompletions.length > 0) {
    const onTimeCompletions = recentCompletions.filter(i => 
      i.interaction_data?.completed_on_time === true
    ).length;
    const onTimeRate = Math.round((onTimeCompletions / recentCompletions.length) * 100);
    context += `- Recent on-time completion rate: ${onTimeRate}% (${onTimeCompletions}/${recentCompletions.length})\n`;
  }
  
  if (context === "PERSONALIZED LEARNING PROFILE:\n") {
    context += "- New user: Building learning profile from current session\n";
  }
  
  return context;
}
