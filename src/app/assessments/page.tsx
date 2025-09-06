"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AssessmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setIsLoading(false);
  }, [user, router]);

  const assessments = [
    {
      id: "phq9",
      title: "PHQ-9 Depression Assessment",
      description: "Patient Health Questionnaire for depression screening",
      icon: "🧠",
      duration: "5-7 minutes",
      questions: 9,
      lastTaken: "2 days ago",
      lastScore: "Mild depression (7/27)",
      color: "bg-blue-100 text-blue-700",
      href: "/assessments/phq9"
    },
    {
      id: "gad7",
      title: "GAD-7 Anxiety Assessment",
      description: "Generalized Anxiety Disorder screening questionnaire",
      icon: "⚡",
      duration: "3-5 minutes",
      questions: 7,
      lastTaken: "1 week ago",
      lastScore: "Mild anxiety (5/21)",
      color: "bg-green-100 text-green-700",
      href: "/assessments/gad7"
    },
    {
      id: "wellness",
      title: "General Wellness Check",
      description: "Comprehensive mental wellness evaluation",
      icon: "🌟",
      duration: "8-10 minutes",
      questions: 15,
      lastTaken: "Never taken",
      lastScore: null,
      color: "bg-purple-100 text-purple-700",
      href: "/assessments/wellness"
    }
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
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindCare
              </h1>
            </Link>
            <Badge variant="secondary">
              Mental Health Assessments
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Mental Health Assessments
          </h2>
          <p className="text-gray-600 text-lg">
            Evidence-based screening tools to help understand your mental health status.
          </p>
        </div>

        {/* Information Card */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <span className="text-2xl mr-2">ℹ️</span>
              About These Assessments
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <ul className="space-y-2 text-sm">
              <li>• These are standardized, clinically-validated screening tools</li>
              <li>• Results help identify potential mental health concerns</li>
              <li>• Assessments are not diagnostic tools - consult a healthcare provider for diagnosis</li>
              <li>• Your responses are completely confidential and encrypted</li>
              <li>• Take assessments regularly to track changes over time</li>
            </ul>
          </CardContent>
        </Card>

        {/* Assessment Cards */}
        <div className="space-y-6">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{assessment.icon}</div>
                    <div>
                      <CardTitle className="text-xl">{assessment.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {assessment.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={assessment.color}>
                    {assessment.questions} Questions
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">{assessment.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Taken</p>
                    <p className="font-semibold">{assessment.lastTaken}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Score</p>
                    <p className="font-semibold">
                      {assessment.lastScore || "Not taken yet"}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link href={assessment.href} className="flex-1">
                    <Button className="w-full">
                      {assessment.lastScore ? "Retake Assessment" : "Take Assessment"}
                    </Button>
                  </Link>
                  {assessment.lastScore && (
                    <Button variant="outline">
                      View History
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Assessment History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Assessment History</CardTitle>
            <CardDescription>
              Your recent mental health screening results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">🧠</div>
                  <div>
                    <p className="font-medium">PHQ-9 Depression Assessment</p>
                    <p className="text-sm text-gray-600">March 15, 2024 • Score: 7/27</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">
                  Mild Depression
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <p className="font-medium">GAD-7 Anxiety Assessment</p>
                    <p className="text-sm text-gray-600">March 10, 2024 • Score: 5/21</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  Mild Anxiety
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">🧠</div>
                  <div>
                    <p className="font-medium">PHQ-9 Depression Assessment</p>
                    <p className="text-sm text-gray-600">March 1, 2024 • Score: 12/27</p>
                  </div>
                </div>
                <Badge className="bg-orange-100 text-orange-700">
                  Moderate Depression
                </Badge>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t text-center">
              <Link href="/insights">
                <Button variant="outline">
                  View Detailed Progress Analysis
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Professional Support */}
        <Card className="mt-8 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center">
              <span className="text-2xl mr-2">👩‍⚕️</span>
              Professional Support
            </CardTitle>
          </CardHeader>
          <CardContent className="text-purple-700">
            <p className="mb-4">
              These assessments can help you and your healthcare provider better understand 
              your mental health. Consider sharing results with:
            </p>
            <ul className="space-y-1 text-sm mb-4">
              <li>• Your primary care physician</li>
              <li>• A mental health counselor or therapist</li>
              <li>• A psychiatrist or psychologist</li>
            </ul>
            <div className="flex space-x-3">
              <Button variant="outline" className="border-purple-300">
                Find Local Providers
              </Button>
              <Button variant="outline" className="border-purple-300">
                Export Assessment Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}