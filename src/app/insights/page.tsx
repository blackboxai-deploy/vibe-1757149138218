"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ChartData {
  date: string;
  mood: number;
  energy: number;
  sleep: number;
  anxiety: number;
  stress: number;
}

export default function InsightsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [wellnessScore, setWellnessScore] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setIsLoading(false);
    generateSampleData();
  }, [user, router]);

  // Generate sample data for demonstration
  const generateSampleData = () => {
    const sampleData: ChartData[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      sampleData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: Math.floor(Math.random() * 4) + 5 + Math.sin(i * 0.2) * 2,
        energy: Math.floor(Math.random() * 4) + 4 + Math.cos(i * 0.15) * 2,
        sleep: Math.floor(Math.random() * 3) + 6 + Math.sin(i * 0.1) * 1,
        anxiety: Math.floor(Math.random() * 3) + 3 + Math.cos(i * 0.25) * 1.5,
        stress: Math.floor(Math.random() * 3) + 4 + Math.sin(i * 0.3) * 1.5,
      });
    }
    
    setChartData(sampleData);
    
    // Calculate wellness score
    const avgMood = sampleData.reduce((sum, d) => sum + d.mood, 0) / sampleData.length;
    const avgEnergy = sampleData.reduce((sum, d) => sum + d.energy, 0) / sampleData.length;
    const avgSleep = sampleData.reduce((sum, d) => sum + d.sleep, 0) / sampleData.length;
    const avgAnxiety = sampleData.reduce((sum, d) => sum + d.anxiety, 0) / sampleData.length;
    const avgStress = sampleData.reduce((sum, d) => sum + d.stress, 0) / sampleData.length;
    
    const score = Math.round(
      ((avgMood + avgEnergy + avgSleep + (10 - avgAnxiety) + (10 - avgStress)) / 50) * 100
    );
    setWellnessScore(score);
  };

  const activityData = [
    { name: 'Exercise', value: 15, color: '#10b981' },
    { name: 'Social Time', value: 20, color: '#3b82f6' },
    { name: 'Work/Study', value: 25, color: '#f59e0b' },
    { name: 'Self-care', value: 12, color: '#8b5cf6' },
    { name: 'Hobbies', value: 18, color: '#ef4444' },
    { name: 'Rest', value: 10, color: '#6b7280' },
  ];

  const assessmentTrends = [
    { date: 'Mar 1', phq9: 12, gad7: 8 },
    { date: 'Mar 8', phq9: 10, gad7: 6 },
    { date: 'Mar 15', phq9: 7, gad7: 5 },
    { date: 'Mar 22', phq9: 8, gad7: 4 },
    { date: 'Mar 29', phq9: 6, gad7: 3 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindCare
              </h1>
            </Link>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              📈 Progress Insights
            </Badge>
          </div>
          
          <Link href="/dashboard">
            <Button variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Your Mental Health Insights
          </h2>
          <p className="text-gray-600 text-lg">
            Analyze your progress, identify patterns, and track your mental wellness journey.
          </p>
        </div>

        {/* Wellness Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Overall Wellness Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {wellnessScore}%
              </div>
              <Progress value={wellnessScore} className="mb-2" />
              <p className="text-xs text-gray-600">
                {wellnessScore >= 80 ? "Excellent progress!" : 
                 wellnessScore >= 60 ? "Good improvement" :
                 wellnessScore >= 40 ? "Steady progress" :
                 "Focus on self-care"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                30-Day Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                23 days
              </div>
              <p className="text-xs text-gray-600">
                Consistent tracking streak
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Mood This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                6.8/10
              </div>
              <p className="text-xs text-gray-600">
                +0.5 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                AI Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                47
              </div>
              <p className="text-xs text-gray-600">
                Support sessions this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Insights Tabs */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Daily Trends</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>

          {/* Daily Trends */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>30-Day Mood & Wellness Trends</CardTitle>
                <CardDescription>
                  Track your daily mood, energy, sleep, anxiety, and stress levels over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} name="Mood" />
                    <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} name="Energy" />
                    <Line type="monotone" dataKey="sleep" stroke="#3b82f6" strokeWidth={2} name="Sleep" />
                    <Line type="monotone" dataKey="anxiety" stroke="#f59e0b" strokeWidth={2} name="Anxiety" />
                    <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} name="Stress" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mood Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Area type="monotone" dataKey="mood" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Energy & Sleep Correlation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="energy" fill="#10b981" name="Energy" />
                      <Bar dataKey="sleep" fill="#3b82f6" name="Sleep" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assessment Trends */}
          <TabsContent value="assessments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Score Trends</CardTitle>
                <CardDescription>
                  PHQ-9 and GAD-7 assessment scores over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={assessmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 25]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="phq9" stroke="#ef4444" strokeWidth={3} name="PHQ-9 (Depression)" />
                    <Line type="monotone" dataKey="gad7" stroke="#f59e0b" strokeWidth={3} name="GAD-7 (Anxiety)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Latest Assessment Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">PHQ-9 Depression</p>
                      <p className="text-sm text-gray-600">March 15, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">6/27</p>
                      <Badge className="bg-green-100 text-green-700">Mild</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">GAD-7 Anxiety</p>
                      <p className="text-sm text-gray-600">March 10, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">3/21</p>
                      <Badge className="bg-blue-100 text-blue-700">Minimal</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 text-xl">📈</div>
                    <div>
                      <p className="font-medium text-green-700">Improving Trend</p>
                      <p className="text-sm text-gray-600">Both depression and anxiety scores are decreasing</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="text-blue-600 text-xl">🎯</div>
                    <div>
                      <p className="font-medium text-blue-700">On Track</p>
                      <p className="text-sm text-gray-600">Continue current strategies and self-care routine</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="text-purple-600 text-xl">🏆</div>
                    <div>
                      <p className="font-medium text-purple-700">Achievement</p>
                      <p className="text-sm text-gray-600">Moved from moderate to mild depression category</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activities Analysis */}
          <TabsContent value="activities" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Distribution</CardTitle>
                  <CardDescription>
                    How you spend your time this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={activityData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {activityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Impact on Mood</CardTitle>
                  <CardDescription>
                    Which activities correlate with better mood
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="text-xl">🏃‍♀️</div>
                      <span className="font-medium">Exercise</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-16" />
                      <span className="text-green-600 font-bold">+1.8</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="text-xl">🧘‍♀️</div>
                      <span className="font-medium">Meditation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-16" />
                      <span className="text-blue-600 font-bold">+1.5</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="text-xl">👥</div>
                      <span className="font-medium">Social Time</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={78} className="w-16" />
                      <span className="text-purple-600 font-bold">+1.3</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="text-xl">🌿</div>
                      <span className="font-medium">Nature/Outdoors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={72} className="w-16" />
                      <span className="text-yellow-600 font-bold">+1.1</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Personalized suggestions based on your activity data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">✨ Increase Exercise</h4>
                    <p className="text-sm text-green-700">
                      Your mood improves significantly on days you exercise. Try to increase from 
                      3 to 4-5 days per week for even better results.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">🧘‍♀️ Daily Meditation</h4>
                    <p className="text-sm text-blue-700">
                      Meditation shows strong positive correlation with your mood. Consider 
                      a daily 10-minute practice for consistent benefits.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">👥 Social Connection</h4>
                    <p className="text-sm text-purple-700">
                      Social activities consistently boost your mood. Schedule regular time 
                      with friends or family to maintain these positive effects.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">⏰ Balance Work Time</h4>
                    <p className="text-sm text-orange-700">
                      High work/study days correlate with lower mood scores. Consider 
                      breaks and stress management techniques during busy periods.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patterns Analysis */}
          <TabsContent value="patterns" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Patterns</CardTitle>
                  <CardDescription>
                    How your mood varies by day of the week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                      const score = [6.2, 6.8, 7.1, 6.9, 7.3, 8.1, 7.8][index];
                      const color = score >= 7.5 ? 'bg-green-500' : score >= 6.5 ? 'bg-yellow-500' : 'bg-red-500';
                      return (
                        <div key={day} className="flex items-center justify-between">
                          <span className="font-medium w-20">{day}</span>
                          <div className="flex-1 mx-4">
                            <Progress value={score * 10} className="h-2" />
                          </div>
                          <span className="font-bold text-gray-700 w-8">{score}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sleep vs Mood Correlation</CardTitle>
                  <CardDescription>
                    How your sleep affects your next day mood
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Poor Sleep (&lt;6h)</span>
                        <span className="text-red-600 font-bold">4.2/10</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>

                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Average Sleep (6-8h)</span>
                        <span className="text-yellow-600 font-bold">6.8/10</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Good Sleep (&gt;8h)</span>
                        <span className="text-green-600 font-bold">8.1/10</span>
                      </div>
                      <Progress value={81} className="h-2" />
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600">
                        <strong>Insight:</strong> Your mood increases by 3.9 points when you get 8+ hours of sleep 
                        compared to less than 6 hours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights & Recommendations</CardTitle>
                <CardDescription>
                  Data-driven insights from your mental health patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-2">📊</div>
                    <h4 className="font-semibold text-blue-800 mb-2">Trending Upward</h4>
                    <p className="text-sm text-blue-700">
                      Your overall mental health metrics have improved 23% over the past month. 
                      Keep up the great work!
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-semibold text-green-800 mb-2">Best Day Pattern</h4>
                    <p className="text-sm text-green-700">
                      Saturdays show your highest mood scores (8.1/10). Try to incorporate 
                      Saturday activities into other days.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-2">💡</div>
                    <h4 className="font-semibold text-purple-800 mb-2">Sleep Connection</h4>
                    <p className="text-sm text-purple-700">
                      Sleep quality is your strongest mood predictor. Prioritizing 8+ hours 
                      consistently could boost your average mood significantly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export & Share */}
        <Card className="mt-8 border-indigo-200 bg-indigo-50">
          <CardHeader>
            <CardTitle className="text-indigo-800 flex items-center">
              <span className="text-2xl mr-2">📋</span>
              Export & Share Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-700 mb-4">
              Share your mental health insights with healthcare providers or export for your personal records.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-100">
                Export as PDF
              </Button>
              <Button variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-100">
                Generate Report
              </Button>
              <Button variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-100">
                Share with Provider
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}