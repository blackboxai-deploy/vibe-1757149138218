"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { toast } from "sonner";

interface PHQ9Question {
  id: string;
  text: string;
}

const phq9Questions: PHQ9Question[] = [
  {
    id: "q1",
    text: "Little interest or pleasure in doing things"
  },
  {
    id: "q2", 
    text: "Feeling down, depressed, or hopeless"
  },
  {
    id: "q3",
    text: "Trouble falling or staying asleep, or sleeping too much"
  },
  {
    id: "q4",
    text: "Feeling tired or having little energy"
  },
  {
    id: "q5",
    text: "Poor appetite or overeating"
  },
  {
    id: "q6",
    text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down"
  },
  {
    id: "q7",
    text: "Trouble concentrating on things, such as reading the newspaper or watching television"
  },
  {
    id: "q8",
    text: "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual"
  },
  {
    id: "q9",
    text: "Thoughts that you would be better off dead, or of hurting yourself"
  }
];

const responseOptions = [
  { value: "0", label: "Not at all", description: "0 days" },
  { value: "1", label: "Several days", description: "1-6 days" },
  { value: "2", label: "More than half the days", description: "7-11 days" },
  { value: "3", label: "Nearly every day", description: "12-14 days" }
];

export default function PHQ9AssessmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setIsLoading(false);
  }, [user, router]);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const goToNext = () => {
    if (currentQuestion < phq9Questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeAssessment();
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeAssessment = () => {
    const totalScore = Object.values(responses).reduce((sum: number, response: string) => {
      return sum + parseInt(response || "0", 10);
    }, 0);
    
    setScore(totalScore);
    setIsCompleted(true);
    
    // Save assessment result to localStorage
    const assessmentResult = {
      type: "PHQ-9",
      score: totalScore,
      responses,
      completedAt: new Date().toISOString(),
      userId: user?.id
    };
    
    const existingResults = JSON.parse(localStorage.getItem('mindcare_assessments') || '[]');
    existingResults.push(assessmentResult);
    localStorage.setItem('mindcare_assessments', JSON.stringify(existingResults));
    
    toast.success("Assessment completed successfully!");
  };

  const getScoreInterpretation = (score: number) => {
    if (score <= 4) {
      return {
        level: "Minimal Depression",
        color: "bg-green-100 text-green-700",
        description: "Little to no depression symptoms detected.",
        recommendation: "Continue with healthy habits and regular self-care."
      };
    } else if (score <= 9) {
      return {
        level: "Mild Depression",
        color: "bg-yellow-100 text-yellow-700",
        description: "Some depression symptoms that may impact daily life.",
        recommendation: "Consider lifestyle changes, stress management, and monitoring symptoms."
      };
    } else if (score <= 14) {
      return {
        level: "Moderate Depression",
        color: "bg-orange-100 text-orange-700",
        description: "Significant depression symptoms affecting daily functioning.",
        recommendation: "Consider speaking with a healthcare provider or mental health professional."
      };
    } else if (score <= 19) {
      return {
        level: "Moderately Severe Depression",
        color: "bg-red-100 text-red-700",
        description: "Serious depression symptoms significantly impacting daily life.",
        recommendation: "Strongly consider professional treatment and support."
      };
    } else {
      return {
        level: "Severe Depression",
        color: "bg-red-200 text-red-800",
        description: "Severe depression symptoms requiring immediate attention.",
        recommendation: "Please seek professional help immediately. Contact your healthcare provider or crisis support."
      };
    }
  };

  const currentQuestionData = phq9Questions[currentQuestion];
  const progress = ((currentQuestion + 1) / phq9Questions.length) * 100;
  const interpretation = isCompleted ? getScoreInterpretation(score) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MindCare
                </h1>
              </Link>
              <Badge variant="secondary">
                PHQ-9 Assessment Results
              </Badge>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Assessment Complete
            </h2>
            <p className="text-gray-600">
              Thank you for completing the PHQ-9 Depression Assessment
            </p>
          </div>

          {/* Score Card */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Your PHQ-9 Score</CardTitle>
              <div className="text-6xl font-bold text-blue-600 my-4">
                {score}/27
              </div>
              {interpretation && (
                <Badge className={`text-lg px-4 py-2 ${interpretation.color}`}>
                  {interpretation.level}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {interpretation && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-gray-700 text-lg mb-4">
                      {interpretation.description}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Recommendation:</h4>
                    <p className="text-blue-700">{interpretation.recommendation}</p>
                  </div>

                  {score >= 15 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">⚠️ Important Notice:</h4>
                      <p className="text-red-700 mb-3">
                        Your score indicates significant depression symptoms. Professional support is strongly recommended.
                      </p>
                      <div className="text-sm space-y-1">
                        <p><strong>Crisis Support:</strong> National Suicide Prevention Lifeline: 988</p>
                        <p><strong>Crisis Text:</strong> Text HOME to 741741</p>
                        <p><strong>Emergency:</strong> Call 911</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Score Interpretation Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <span className="font-medium">0-4: Minimal Depression</span>
                  <Badge className="bg-green-100 text-green-700">No Treatment Needed</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                  <span className="font-medium">5-9: Mild Depression</span>
                  <Badge className="bg-yellow-100 text-yellow-700">Monitor Symptoms</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                  <span className="font-medium">10-14: Moderate Depression</span>
                  <Badge className="bg-orange-100 text-orange-700">Consider Treatment</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                  <span className="font-medium">15-19: Moderately Severe</span>
                  <Badge className="bg-red-100 text-red-700">Treatment Recommended</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-100">
                  <span className="font-medium">20-27: Severe Depression</span>
                  <Badge className="bg-red-200 text-red-800">Immediate Treatment</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button className="w-full sm:w-auto px-8">
                Talk to AI Support
              </Button>
            </Link>
            <Link href="/assessments">
              <Button variant="outline" className="w-full sm:w-auto px-8">
                Back to Assessments
              </Button>
            </Link>
            <Link href="/insights">
              <Button variant="outline" className="w-full sm:w-auto px-8">
                View Progress Insights
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindCare
              </h1>
            </Link>
            <Badge variant="secondary">
              PHQ-9 Assessment
            </Badge>
          </div>
          
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {phq9Questions.length}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-800">PHQ-9 Depression Assessment</h2>
            <span className="text-lg font-semibold text-blue-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              Question {currentQuestion + 1}
            </CardTitle>
            <CardDescription className="text-base">
              Over the last 2 weeks, how often have you been bothered by the following problem?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-6">
                {currentQuestionData.text}
              </h3>
              
              <RadioGroup
                value={responses[currentQuestionData.id] || ""}
                onValueChange={(value) => handleResponseChange(currentQuestionData.id, value)}
              >
                {responseOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={option.value} id={`${currentQuestionData.id}-${option.value}`} />
                    <Label 
                      htmlFor={`${currentQuestionData.id}-${option.value}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <div className="flex space-x-3">
            <Link href="/assessments">
              <Button variant="ghost">
                Cancel Assessment
              </Button>
            </Link>
            
            <Button 
              onClick={goToNext}
              disabled={!responses[currentQuestionData.id]}
            >
              {currentQuestion === phq9Questions.length - 1 ? "Complete Assessment" : "Next"}
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-sm text-blue-700">
              <p className="font-semibold mb-2">About the PHQ-9:</p>
              <p>
                The Patient Health Questionnaire-9 (PHQ-9) is a validated tool used by healthcare 
                providers to screen for depression. It asks about symptoms experienced over the 
                past two weeks and provides a standardized way to assess depression severity.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}