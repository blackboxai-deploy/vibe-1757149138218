"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      title: "Mental Health Assessments",
      description: "Standardized PHQ-9 and GAD-7 screenings with clinical scoring",
      icon: "📊",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "AI-Powered Support",
      description: "24/7 conversational AI providing personalized coping strategies",
      icon: "🤖",
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Mood & Activity Tracking",
      description: "Daily mood logging with sleep and activity correlation analysis",
      icon: "📈",
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "Visual Insights",
      description: "Interactive charts and reports showing mental health trends",
      icon: "📋",
      color: "bg-orange-100 text-orange-700"
    },
    {
      title: "Community Support",
      description: "Anonymous peer support forum with moderated discussions",
      icon: "👥",
      color: "bg-pink-100 text-pink-700"
    },
    {
      title: "Privacy & Security",
      description: "End-to-end encryption with complete data ownership control",
      icon: "🔒",
      color: "bg-indigo-100 text-indigo-700"
    }
  ];

  const handleGetStarted = () => {
    setIsLoading(true);
    router.push("/auth/register");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="text-sm px-4 py-2 mb-4">
              🧠 Mental Health Technology
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              MindCare
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
              Mental Health Manager & Tracker
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Take control of your mental well-being with our comprehensive platform featuring AI support, 
              evidence-based assessments, mood tracking, and a supportive community—all in one secure, 
              confidential environment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              disabled={isLoading}
              className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? "Loading..." : "Get Started Free"}
            </Button>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>✨ No credit card required • 🔒 Complete privacy guaranteed</p>
            <p>📱 Works on all devices • 🌍 Available 24/7</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Comprehensive Mental Health Support
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to monitor, manage, and improve your mental well-being 
              in one integrated platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="mt-4 text-center">
                    <Badge className={feature.color}>
                      Available Now
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            Making Mental Health Care Accessible
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600">AI Support Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">100%</div>
              <div className="text-gray-600">Privacy Protected</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-indigo-600">Free</div>
              <div className="text-gray-600">Core Features</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Start Your Mental Health Journey Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who are taking control of their mental well-being with MindCare.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              disabled={isLoading}
              className="px-8 py-3 text-lg bg-white text-purple-600 hover:bg-gray-100"
            >
              {isLoading ? "Loading..." : "Create Free Account"}
            </Button>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-purple-600">
                Sign In
              </Button>
            </Link>
          </div>
          
          <p className="text-sm opacity-75 mt-6">
            Secure • Confidential • Always Free Core Features
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MindCare
            </h3>
            <p className="text-gray-400 mt-2">
              Mental Health Manager & Tracker
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <p className="text-gray-400">
                If you're experiencing a mental health crisis, please contact:
              </p>
              <p className="text-blue-400 font-semibold mt-1">
                National Suicide Prevention Lifeline: 988
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Privacy</h4>
              <p className="text-gray-400">
                Your mental health data is encrypted and completely confidential. 
                We never share personal information.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Professional Care</h4>
              <p className="text-gray-400">
                MindCare complements but doesn't replace professional mental health treatment.
              </p>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-gray-800 text-gray-400 text-sm">
            <p>&copy; 2024 MindCare. Built with care for mental health awareness.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}