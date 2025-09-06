"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setIsLoading(false);
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Take Assessment",
      description: "PHQ-9 or GAD-7 screening",
      icon: "📊",
      href: "/assessments",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Chat with AI",
      description: "24/7 mental health support",
      icon: "🤖",
      href: "/chat",
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Log Mood",
      description: "Track your daily emotions",
      icon: "😊",
      href: "/tracker",
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "View Insights",
      description: "Analyze your progress",
      icon: "📈",
      href: "/insights",
      color: "bg-orange-100 text-orange-700"
    },
    {
      title: "Community",
      description: "Connect with others",
      icon: "👥",
      href: "/community",
      color: "bg-pink-100 text-pink-700"
    },
    {
      title: "Settings",
      description: "Manage your account",
      icon: "⚙️",
      href: "/settings",
      color: "bg-gray-100 text-gray-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindCare
              </h1>
            </Link>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Dashboard
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Welcome back,</p>
              <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Your Mental Health Dashboard
          </h2>
          <p className="text-gray-600 text-lg">
            Track your progress, get support, and manage your mental well-being.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Wellness Score
              </CardTitle>
              <span className="text-2xl">🎯</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">72%</div>
              <Progress value={72} className="mb-2" />
              <p className="text-xs text-gray-600">
                Great progress! Keep up your routine.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Days Tracked This Month
              </CardTitle>
              <span className="text-2xl">📅</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 mb-2">23/30</div>
              <Progress value={76} className="mb-2" />
              <p className="text-xs text-gray-600">
                Excellent tracking consistency!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Support Conversations
              </CardTitle>
              <span className="text-2xl">💬</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 mb-2">47</div>
              <p className="text-xs text-gray-600">
                AI conversations this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl">{action.icon}</div>
                      <Badge className={action.color} variant="secondary">
                        Available
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{action.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest mental health activities and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl">📊</div>
                <div className="flex-1">
                  <p className="font-medium">Completed GAD-7 Assessment</p>
                  <p className="text-sm text-gray-600">Score: Mild anxiety (5/21) • 2 days ago</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Assessment
                </Badge>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                <div className="text-2xl">🤖</div>
                <div className="flex-1">
                  <p className="font-medium">AI Support Session</p>
                  <p className="text-sm text-gray-600">Discussed coping strategies • Yesterday</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  AI Chat
                </Badge>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl">😊</div>
                <div className="flex-1">
                  <p className="font-medium">Daily Mood Log</p>
                  <p className="text-sm text-gray-600">Feeling good (7/10) • Today</p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Mood Tracker
                </Badge>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t text-center">
              <Link href="/insights">
                <Button variant="outline">
                  View All Activity & Insights
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Crisis Support Card */}
        <Card className="mt-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center">
              <span className="text-2xl mr-2">🆘</span>
              Crisis Support Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              If you're experiencing a mental health crisis, immediate help is available:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>National Suicide Prevention Lifeline:</strong> 988</p>
              <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
              <p><strong>Emergency:</strong> Call 911</p>
            </div>
            <Button variant="outline" className="mt-4 border-red-300 text-red-700 hover:bg-red-100">
              Find Local Resources
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}