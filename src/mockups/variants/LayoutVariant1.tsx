import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Target, Users, Calendar, TrendingUp, CheckCircle } from "lucide-react";

const LayoutVariant1 = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "relationship", name: "Relationship", progress: 85, status: "completed" },
    { id: "rhythm", name: "Rhythm", progress: 60, status: "in-progress" },
    { id: "reconciliation", name: "Reconciliation", progress: 30, status: "in-progress" },
    { id: "radiance", name: "Radiance", progress: 0, status: "not-started" },
  ];

  const dailyTasks = [
    { title: "Morning Prayer", completed: true },
    { title: "Scripture Reading", completed: true },
    { title: "Reflection Journal", completed: false },
    { title: "Community Check-in", completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/mockups">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Hub
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  COST Training - Layout V1
                </h1>
                <p className="text-sm text-muted-foreground">Modern card-based layout</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Mockup Version
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="mb-8">
          <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
            <CardHeader className="relative">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <Target className="w-full h-full" />
              </div>
              <CardTitle className="text-3xl mb-2">Welcome back to your journey</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Continue building lasting spiritual habits through the COST framework
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Day 23 of training</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>68% overall progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Connected with 12 others</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Today's Focus */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Tasks */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Today's Focus
                </CardTitle>
                <CardDescription>Complete these activities to stay on track</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyTasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <CheckCircle className={`w-5 h-5 ${task.completed ? 'text-green-600' : 'text-gray-300'}`} />
                      <span className={`flex-1 ${task.completed ? 'text-muted-foreground line-through' : ''}`}>
                        {task.title}
                      </span>
                      {!task.completed && (
                        <Button size="sm" variant="outline">Start</Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Training Sections Grid */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Training Sections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section) => (
                  <Card key={section.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">The Habit of {section.name}</CardTitle>
                        <Badge variant={section.status === 'completed' ? 'default' : 'secondary'}>
                          {section.status === 'completed' ? 'Complete' : 
                           section.status === 'in-progress' ? 'Active' : 'Upcoming'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{section.progress}%</span>
                        </div>
                        <Progress value={section.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Completion</span>
                  <span className="font-semibold">68%</span>
                </div>
                <Progress value={68} className="h-2" />
                
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Days Active</span>
                    <span className="font-medium">23/30</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Assessments Completed</span>
                    <span className="font-medium">2/9</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Community Connections</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Daily Reading Plan
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Connect with Others
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  View All Assessments
                </Button>
              </CardContent>
            </Card>

            {/* Motivation */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg text-green-800">Today's Encouragement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700 italic">
                  "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
                </p>
                <p className="text-xs text-green-600 mt-2">- Aristotle</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutVariant1;