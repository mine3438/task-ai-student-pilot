
import { Task } from "@/types/Task";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Target, Clock, Award } from "lucide-react";

interface TaskAnalyticsProps {
  tasks: Task[];
}

export const TaskAnalytics = ({ tasks }: TaskAnalyticsProps) => {
  // Calculate metrics
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const overdueTasks = tasks.filter(task => 
    !task.completed && new Date(task.deadline) < new Date()
  ).length;

  const onTimeTasks = tasks.filter(task => 
    task.completed && new Date(task.deadline) >= new Date()
  ).length;

  const onTimeRate = completedTasks > 0 ? (onTimeTasks / completedTasks) * 100 : 0;

  // Category distribution
  const categoryData = [
    { name: 'Assignment', value: tasks.filter(t => t.category === 'Assignment').length, color: '#3B82F6' },
    { name: 'Exam', value: tasks.filter(t => t.category === 'Exam').length, color: '#8B5CF6' },
    { name: 'Study', value: tasks.filter(t => t.category === 'Study').length, color: '#6366F1' },
    { name: 'Personal', value: tasks.filter(t => t.category === 'Personal').length, color: '#EC4899' },
  ].filter(item => item.value > 0);

  // Priority distribution
  const priorityData = [
    { priority: 'High', count: tasks.filter(t => t.priority === 'High').length, color: '#EF4444' },
    { priority: 'Medium', count: tasks.filter(t => t.priority === 'Medium').length, color: '#F59E0B' },
    { priority: 'Low', count: tasks.filter(t => t.priority === 'Low').length, color: '#10B981' },
  ];

  // Weekly completion trend (mock data for demo)
  const weeklyData = [
    { week: 'Week 1', completed: 5, created: 7 },
    { week: 'Week 2', completed: 8, created: 10 },
    { week: 'Week 3', completed: 6, created: 8 },
    { week: 'Week 4', completed: completedTasks, created: totalTasks },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 80) return { label: 'Great', color: 'bg-blue-100 text-blue-800' };
    if (score >= 70) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    if (score >= 60) return { label: 'Fair', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const productivityScore = Math.round((completionRate * 0.6) + (onTimeRate * 0.4));
  const scoreBadge = getScoreBadge(productivityScore);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-blue-600">{completedTasks} of {totalTasks} tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">On-Time Rate</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{onTimeRate.toFixed(1)}%</div>
            <p className="text-xs text-green-600">{onTimeTasks} completed on time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Overdue Tasks</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{overdueTasks}</div>
            <p className="text-xs text-red-600">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Productivity Score</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(productivityScore)}`}>
              {productivityScore}
            </div>
            <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${scoreBadge.color}`}>
              {scoreBadge.label}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Breakdown of tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="priority" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Your tasks organized by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Weekly Progress Trend</CardTitle>
            <CardDescription>Task creation vs completion over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Created"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Productivity Insights</CardTitle>
          <CardDescription>AI-powered suggestions to improve your study habits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">💡 Study Pattern Analysis</h4>
              <p className="text-blue-700 text-sm">
                You tend to complete {completionRate.toFixed(0)}% of your tasks. 
                {completionRate < 70 && " Consider breaking larger tasks into smaller, manageable chunks."}
                {completionRate >= 70 && completionRate < 85 && " You're doing well! Try setting specific time blocks for focused work."}
                {completionRate >= 85 && " Excellent work! You have great task management habits."}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">⏰ Time Management Tip</h4>
              <p className="text-green-700 text-sm">
                {overdueTasks > 0 
                  ? `You have ${overdueTasks} overdue tasks. Consider using the Pomodoro Technique for better time management.`
                  : "Great job staying on top of your deadlines! Keep using buffer time for unexpected delays."
                }
              </p>
            </div>

            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">🎯 Priority Recommendation</h4>
              <p className="text-yellow-700 text-sm">
                {tasks.filter(t => t.priority === 'High' && !t.completed).length > 0
                  ? "Focus on your high-priority tasks first. Consider tackling them during your most productive hours."
                  : "Well balanced priority distribution! Continue this strategic approach to task planning."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
