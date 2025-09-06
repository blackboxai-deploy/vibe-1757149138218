"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  sleep: number;
  anxiety: number;
  stress: number;
  activities: string[];
  notes: string;
  userId: string;
}

export default function TrackerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mood, setMood] = useState([5]);
  const [energy, setEnergy] = useState([5]);
  const [sleepHours, setSleepHours] = useState([7]);
  const [anxiety, setAnxiety] = useState([3]);
  const [stress, setStress] = useState([3]);
  const [activities, setActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [existingEntry, setExistingEntry] = useState<MoodEntry | null>(null);

  const activityOptions = [
    "Exercise", "Meditation", "Social time", "Work/Study", "Hobbies", 
    "Nature/Outdoors", "Reading", "Music", "Cooking", "Cleaning",
    "Therapy/Counseling", "Self-care", "Gaming", "TV/Movies", "Rest"
  ];

  const moodEmojis = [
    "😢", "😟", "😐", "🙂", "😊", "😀", "😁", "🤗", "😍", "🤩"
  ];

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setIsLoading(false);
    loadExistingEntry(selectedDate);
  }, [user, router, selectedDate]);

  const loadExistingEntry = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const existingEntries = JSON.parse(localStorage.getItem('mindcare_mood_entries') || '[]');
    const entry = existingEntries.find((e: MoodEntry) => e.date === dateStr && e.userId === user?.id);
    
    if (entry) {
      setExistingEntry(entry);
      setMood([entry.mood]);
      setEnergy([entry.energy]);
      setSleepHours([entry.sleep]);
      setAnxiety([entry.anxiety]);
      setStress([entry.stress]);
      setActivities(entry.activities);
      setNotes(entry.notes);
    } else {
      setExistingEntry(null);
      setMood([5]);
      setEnergy([5]);
      setSleepHours([7]);
      setAnxiety([3]);
      setStress([3]);
      setActivities([]);
      setNotes("");
    }
  };

  const handleActivityToggle = (activity: string) => {
    setActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const saveMoodEntry = () => {
    const entry: MoodEntry = {
      id: existingEntry?.id || `mood_${Date.now()}`,
      date: selectedDate.toISOString().split('T')[0],
      mood: mood[0],
      energy: energy[0],
      sleep: sleepHours[0],
      anxiety: anxiety[0],
      stress: stress[0],
      activities,
      notes,
      userId: user?.id || ''
    };

    const existingEntries = JSON.parse(localStorage.getItem('mindcare_mood_entries') || '[]');
    
    if (existingEntry) {
      // Update existing entry
      const updatedEntries = existingEntries.map((e: MoodEntry) => 
        e.id === existingEntry.id ? entry : e
      );
      localStorage.setItem('mindcare_mood_entries', JSON.stringify(updatedEntries));
      // Toast would go here in production
    } else {
      // Add new entry
      existingEntries.push(entry);
      localStorage.setItem('mindcare_mood_entries', JSON.stringify(existingEntries));
      // Toast would go here in production
    }

    setExistingEntry(entry);
  };

  const getMoodColor = (moodValue: number) => {
    if (moodValue <= 3) return "text-red-600";
    if (moodValue <= 5) return "text-orange-600";
    if (moodValue <= 7) return "text-yellow-600";
    return "text-green-600";
  };

  const getStressColor = (stressValue: number) => {
    if (stressValue <= 2) return "text-green-600";
    if (stressValue <= 6) return "text-yellow-600";
    if (stressValue <= 8) return "text-orange-600";
    return "text-red-600";
  };

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
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              😊 Mood Tracker
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
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Daily Mood & Activity Tracker
          </h2>
          <p className="text-gray-600 text-lg">
            Track your daily mood, energy, sleep, and activities to identify patterns and improve your well-being.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">📅</span>
                Select Date
              </CardTitle>
              <CardDescription>
                Choose a date to log or view your mood entry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  {selectedDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-blue-600">
                  {existingEntry ? "Entry exists - editing mode" : "New entry"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mood Tracking Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">📊</span>
                {existingEntry ? "Edit Mood Entry" : "Log Your Day"}
              </CardTitle>
              <CardDescription>
                Rate different aspects of your day on a scale from 1-10
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Mood */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Overall Mood</Label>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Very Low</span>
                  <span className={`text-3xl ${getMoodColor(mood[0])}`}>
                    {moodEmojis[mood[0] - 1] || "😐"}
                  </span>
                  <span className="text-sm text-gray-600">Excellent</span>
                </div>
                <Slider
                  value={mood}
                  onValueChange={setMood}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-center">
                  <Badge className="bg-purple-100 text-purple-700">
                    {mood[0]}/10
                  </Badge>
                </div>
              </div>

              {/* Energy Level */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Energy Level</Label>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Exhausted</span>
                  <span className="text-2xl">⚡</span>
                  <span className="text-sm text-gray-600">High Energy</span>
                </div>
                <Slider
                  value={energy}
                  onValueChange={setEnergy}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-center">
                  <Badge className="bg-yellow-100 text-yellow-700">
                    {energy[0]}/10
                  </Badge>
                </div>
              </div>

              {/* Sleep Hours */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Sleep Quality/Duration</Label>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Poor/Short</span>
                  <span className="text-2xl">😴</span>
                  <span className="text-sm text-gray-600">Great/Long</span>
                </div>
                <Slider
                  value={sleepHours}
                  onValueChange={setSleepHours}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-center">
                  <Badge className="bg-indigo-100 text-indigo-700">
                    {sleepHours[0]}/10
                  </Badge>
                </div>
              </div>

              {/* Anxiety Level */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Anxiety Level</Label>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Calm</span>
                  <span className="text-2xl">😰</span>
                  <span className="text-sm text-gray-600">Very Anxious</span>
                </div>
                <Slider
                  value={anxiety}
                  onValueChange={setAnxiety}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-center">
                  <Badge className={`${getStressColor(anxiety[0])} bg-opacity-20`}>
                    {anxiety[0]}/10
                  </Badge>
                </div>
              </div>

              {/* Stress Level */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Stress Level</Label>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Relaxed</span>
                  <span className="text-2xl">😤</span>
                  <span className="text-sm text-gray-600">Very Stressed</span>
                </div>
                <Slider
                  value={stress}
                  onValueChange={setStress}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-center">
                  <Badge className={`${getStressColor(stress[0])} bg-opacity-20`}>
                    {stress[0]}/10
                  </Badge>
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Daily Activities</Label>
                <p className="text-sm text-gray-600 mb-3">
                  Select activities you engaged in today (tap to toggle)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {activityOptions.map((activity) => (
                    <Button
                      key={activity}
                      variant={activities.includes(activity) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleActivityToggle(activity)}
                      className="text-xs h-8"
                    >
                      {activity}
                    </Button>
                  ))}
                </div>
                {activities.length > 0 && (
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-700">
                      {activities.length} activities selected
                    </Badge>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <Label htmlFor="notes" className="text-base font-semibold">
                  Daily Notes & Reflections
                </Label>
                <Textarea
                  id="notes"
                  placeholder="How are you feeling? Any thoughts, experiences, or insights from today? What went well? What was challenging?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Save Button */}
              <Button onClick={saveMoodEntry} className="w-full" size="lg">
                {existingEntry ? "Update Entry" : "Save Entry"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Mood Entries</CardTitle>
            <CardDescription>
              Your mood tracking history for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Sample entries - in production, these would be loaded from localStorage */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">😊</div>
                  <div>
                    <p className="font-medium">March 15, 2024</p>
                    <p className="text-sm text-gray-600">Mood: 7/10 • Energy: 8/10 • Sleep: 7/10</p>
                    <p className="text-xs text-gray-500">Exercise, Social time, Reading</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  Good Day
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">😐</div>
                  <div>
                    <p className="font-medium">March 14, 2024</p>
                    <p className="text-sm text-gray-600">Mood: 5/10 • Energy: 4/10 • Sleep: 5/10</p>
                    <p className="text-xs text-gray-500">Work/Study, TV/Movies</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">
                  Average Day
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">🙂</div>
                  <div>
                    <p className="font-medium">March 13, 2024</p>
                    <p className="text-sm text-gray-600">Mood: 6/10 • Energy: 6/10 • Sleep: 8/10</p>
                    <p className="text-xs text-gray-500">Meditation, Nature/Outdoors, Hobbies</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  Balanced Day
                </Badge>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t text-center">
              <Link href="/insights">
                <Button variant="outline">
                  View Detailed Insights & Trends
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}