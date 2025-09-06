"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorInitials: string;
  timestamp: Date;
  category: string;
  replies: number;
  likes: number;
  isAnonymous: boolean;
}



export default function CommunityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");

  const categories = [
    { id: "general", name: "General Support", icon: "💬" },
    { id: "anxiety", name: "Anxiety", icon: "😰" },
    { id: "depression", name: "Depression", icon: "💙" },
    { id: "success", name: "Success Stories", icon: "🌟" },
    { id: "tips", name: "Tips & Strategies", icon: "💡" },
    { id: "resources", name: "Resources", icon: "📚" },
  ];

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setIsLoading(false);
    loadSamplePosts();
  }, [user, router]);

  const loadSamplePosts = () => {
    const samplePosts: ForumPost[] = [
      {
        id: "post1",
        title: "Started meditation this week and feeling more peaceful",
        content: "I've been struggling with anxiety for months, but after starting a 10-minute daily meditation practice, I'm already noticing small improvements. Just wanted to share in case it helps someone else. What mindfulness practices work for you?",
        author: "Anonymous User",
        authorInitials: "AU",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        category: "success",
        replies: 12,
        likes: 28,
        isAnonymous: true
      },
      {
        id: "post2", 
        title: "Struggling with morning anxiety - any tips?",
        content: "Every morning I wake up with this overwhelming sense of dread and anxiety. It's been going on for weeks now. I've tried setting a morning routine but it's still really tough. Has anyone else experienced this? What helped you?",
        author: "Hope Seeker",
        authorInitials: "HS",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        category: "anxiety",
        replies: 8,
        likes: 15,
        isAnonymous: true
      },
      {
        id: "post3",
        title: "6 months of progress - things do get better",
        content: "I wanted to share my journey because I remember reading posts like this when I was in a dark place and they gave me hope. Six months ago, I could barely get out of bed. Today, I completed my first 5K run. It's not been linear, there were setbacks, but with therapy, medication, and this supportive community, I'm in a much better place. Keep going, friends. 💙",
        author: "Runner2024",
        authorInitials: "R2",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        category: "success",
        replies: 24,
        likes: 67,
        isAnonymous: false
      },
      {
        id: "post4",
        title: "Breathing technique that's been helping me",
        content: "I learned this 4-7-8 breathing technique from my therapist and it's been a game-changer for panic attacks. Inhale for 4, hold for 7, exhale for 8. Repeat 4 times. It activates the parasympathetic nervous system and really helps calm me down quickly. Hope this helps someone!",
        author: "Breathe Easy",
        authorInitials: "BE",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        category: "tips",
        replies: 16,
        likes: 42,
        isAnonymous: true
      },
      {
        id: "post5",
        title: "Feeling isolated and need to connect with others",
        content: "I've been dealing with depression and I feel so alone. My friends don't really understand what I'm going through. Sometimes I feel like I'm just pretending to be okay. This community seems like such a safe space. Thank you for existing.",
        author: "Seeking Light",
        authorInitials: "SL",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        category: "depression",
        replies: 19,
        likes: 33,
        isAnonymous: true
      },
    ];
    
    setPosts(samplePosts);
  };

  const createPost = () => {
    if (!newPostContent.trim()) return;

    const newPost: ForumPost = {
      id: `post_${Date.now()}`,
      title: newPostContent.split('\n')[0].substring(0, 80) + (newPostContent.split('\n')[0].length > 80 ? '...' : ''),
      content: newPostContent,
      author: user?.name || "Anonymous",
      authorInitials: user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "AN",
      timestamp: new Date(),
      category: selectedCategory,
      replies: 0,
      likes: 0,
      isAnonymous: true
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent("");
  };

  const getTimeDifference = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      general: "bg-blue-100 text-blue-700",
      anxiety: "bg-yellow-100 text-yellow-700",
      depression: "bg-blue-100 text-blue-700",
      success: "bg-green-100 text-green-700",
      tips: "bg-purple-100 text-purple-700",
      resources: "bg-indigo-100 text-indigo-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const filteredPosts = posts.filter(post => 
    selectedCategory === "all" || post.category === selectedCategory
  );

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
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">
              👥 Community Support
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
            Community Support Forum
          </h2>
          <p className="text-gray-600 text-lg">
            A safe, anonymous space to share experiences, seek support, and connect with others on similar journeys.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Discussion Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === "all" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <span className="mr-2">📋</span>
                        All Topics
                      </span>
                      <Badge variant="secondary">{posts.length}</Badge>
                    </div>
                  </button>
                  
                  {categories.map((category) => {
                    const categoryCount = posts.filter(p => p.category === category.id).length;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedCategory === category.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                          </span>
                          <Badge variant="secondary">{categoryCount}</Badge>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="mt-6 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 text-sm">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Be kind and supportive</li>
                  <li>• Respect anonymity choices</li>
                  <li>• No medical advice or diagnosis</li>
                  <li>• Share resources and experiences</li>
                  <li>• Report inappropriate content</li>
                  <li>• Crisis support: 988</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Main Forum Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* New Post */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-2">✍️</span>
                  Share with the Community
                </CardTitle>
                <CardDescription>
                  Your post will be anonymous by default to protect your privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts, experiences, ask for support, or offer encouragement to others... Remember, you're not alone in this journey."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Post in:</span>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <Button 
                    onClick={createPost}
                    disabled={!newPostContent.trim()}
                  >
                    Post Anonymously
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Forum Posts */}
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                              {post.authorInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-800">{post.author}</span>
                              {post.isAnonymous && (
                                <Badge variant="secondary" className="text-xs bg-gray-100">
                                  Anonymous
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{getTimeDifference(post.timestamp)}</span>
                              <span>•</span>
                              <Badge className={`${getCategoryColor(post.category)} text-xs`}>
                                {categories.find(c => c.id === post.category)?.icon} {categories.find(c => c.id === post.category)?.name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <CardTitle className="text-lg leading-snug">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                            <span className="mr-1">👍</span>
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                            <span className="mr-1">💬</span>
                            {post.replies} replies
                          </Button>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          Reply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="text-4xl mb-4">🌱</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No posts in this category yet
                    </h3>
                    <p className="text-gray-600">
                      Be the first to start a conversation and support others in their journey.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Load More */}
            {filteredPosts.length > 0 && (
              <div className="text-center pt-6">
                <Button variant="outline">
                  Load More Posts
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Crisis Support */}
        <Card className="mt-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center">
              <span className="text-2xl mr-2">🆘</span>
              Crisis Support Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="font-semibold text-red-700 mb-1">National Suicide Prevention Lifeline</p>
                <p className="text-2xl font-bold text-red-800">988</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="font-semibold text-red-700 mb-1">Crisis Text Line</p>
                <p className="text-lg font-bold text-red-800">Text HOME to 741741</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="font-semibold text-red-700 mb-1">Emergency</p>
                <p className="text-2xl font-bold text-red-800">911</p>
              </div>
            </div>
            <p className="text-red-700 text-sm mt-4 text-center">
              If you or someone you know is in immediate danger, please reach out for help immediately.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}