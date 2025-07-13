
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Database, Brain, TrendingUp, Users, Target, BarChart3, RefreshCw } from 'lucide-react';

export const ModelDevelopmentDiagram = () => {
  const stages = [
    {
      id: 1,
      title: "Data Collection",
      icon: Database,
      color: "bg-blue-500",
      items: [
        "Task completions",
        "Time preferences", 
        "Category patterns",
        "Suggestion feedback",
        "Delay/skip reasons"
      ]
    },
    {
      id: 2,
      title: "Pattern Recognition",
      icon: BarChart3,
      color: "bg-green-500",
      items: [
        "Optimal completion times",
        "Category preferences",
        "Success patterns",
        "Behavioral trends",
        "Performance metrics"
      ]
    },
    {
      id: 3,
      title: "Model Training",
      icon: Brain,
      color: "bg-purple-500",
      items: [
        "Habit confidence scoring",
        "Preference weighting",
        "Pattern validation",
        "Accuracy tracking",
        "Continuous learning"
      ]
    },
    {
      id: 4,
      title: "AI Insights",
      icon: Target,
      color: "bg-orange-500",
      items: [
        "Task suggestions",
        "Schedule optimization",
        "Deadline predictions",
        "Personalized tips",
        "Performance insights"
      ]
    },
    {
      id: 5,
      title: "User Feedback",
      icon: Users,
      color: "bg-red-500",
      items: [
        "Accept/reject suggestions",
        "Task interactions",
        "Completion outcomes",
        "Behavior validation",
        "Model refinement"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-purple-600" />
            AI Model Development Lifecycle
          </CardTitle>
          <CardDescription>
            How the AI learns from your study patterns and improves over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={stage.id} className="relative">
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${stage.color} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-sm">{stage.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {stage.items.map((item, itemIndex) => (
                          <Badge key={itemIndex} variant="outline" className="text-xs block w-full text-center">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow connector */}
                  {index < stages.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Feedback loop arrow */}
          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Continuous feedback loop for model improvement</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Flow Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Input Data Sources</CardTitle>
            <CardDescription>What feeds into the AI learning system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Task completion timestamps</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Category preferences</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">AI suggestion feedback</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Task delay/skip patterns</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">Schedule adherence data</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Outputs</CardTitle>
            <CardDescription>How the learned patterns help you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Personalized task suggestions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Optimized study schedules</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Smart deadline predictions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Productivity insights</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">Behavioral recommendations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Model Performance Metrics</CardTitle>
          <CardDescription>How we measure AI learning effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">Confidence Score</div>
              <div className="text-sm text-blue-700">How certain the AI is about patterns</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">Suggestion Accuracy</div>
              <div className="text-sm text-green-700">Percentage of accepted AI suggestions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">Learning Progress</div>
              <div className="text-sm text-purple-700">Overall model improvement over time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
