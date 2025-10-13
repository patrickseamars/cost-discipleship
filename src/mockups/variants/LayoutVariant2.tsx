import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Menu,
  X,
  Home,
  BarChart3,
  CheckCircle2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Book,
  Target,
  Clock,
  TrendingUp
} from "lucide-react";

// Import the actual data
import dailyExercisesData from "@/data/daily-exercises.json";
import sectionOverviewsData from "@/data/section-overviews.json";

const LayoutVariant2 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    relationship: true // Start with first section expanded
  });

  // Mock data for progress tracking
  const [completedDays, setCompletedDays] = useState(new Set([
    "relationship-1", "relationship-2", "relationship-3",
    "rhythm-1", "rhythm-2"
  ]));

  const sections = [
    { key: "relationship", name: "Relationship", totalDays: 6 },
    { key: "rhythm", name: "Rhythm", totalDays: 6 },
    { key: "reconciliation", name: "Reconciliation", totalDays: 6 },
    { key: "radiance", name: "Radiance", totalDays: 6 },
    { key: "response", name: "Response", totalDays: 6 },
    { key: "resistance", name: "Resistance", totalDays: 6 },
    { key: "resources", name: "Resources", totalDays: 6 },
    { key: "refuel", name: "Refuel", totalDays: 6 },
    { key: "replication", name: "Replication", totalDays: 6 },
  ];

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const getSectionProgress = (sectionKey: string, totalDays: number) => {
    const completed = Array.from(completedDays).filter(day => 
      day.startsWith(sectionKey)
    ).length;
    return Math.round((completed / totalDays) * 100);
  };

  const getTotalProgress = () => {
    const totalDays = sections.length * 6; // 54 total days
    return Math.round((completedDays.size / totalDays) * 100);
  };

  const getCurrentDayData = () => {
    // Find the next incomplete day
    for (const section of sections) {
      for (let day = 1; day <= section.totalDays; day++) {
        const dayId = `${section.key}-${day}`;
        if (!completedDays.has(dayId)) {
          return {
            sectionKey: section.key,
            sectionName: section.name,
            day,
            dayId,
            data: dailyExercisesData.sections[section.key]?.daily_exercises?.find(ex => ex.day === day)
          };
        }
      }
    }
    return null;
  };

  const currentDay = getCurrentDayData();

  const Sidebar = () => (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">COST Training</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            <Button
              variant={currentView === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start text-sm"
              onClick={() => {
                setCurrentView("dashboard");
                setSidebarOpen(false);
              }}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            
            <Button
              variant={currentView === "assessments" ? "secondary" : "ghost"}
              className="w-full justify-start text-sm"
              onClick={() => {
                setCurrentView("assessments");
                setSidebarOpen(false);
              }}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Assessments
            </Button>
          </div>

          <Separator className="my-3" />

          {/* Sections */}
          <div className="space-y-1">
            <h3 className="px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Training Sections
            </h3>
            {sections.map((section) => {
              const isExpanded = expandedSections[section.key];
              const progress = getSectionProgress(section.key, section.totalDays);
              
              return (
                <div key={section.key}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm p-2"
                    onClick={() => toggleSection(section.key)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3 mr-1" />
                    ) : (
                      <ChevronRight className="w-3 h-3 mr-1" />
                    )}
                    <Book className="w-4 h-4 mr-2" />
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="truncate capitalize">{section.name}</span>
                        <span className="text-xs text-gray-500 ml-2">{progress}%</span>
                      </div>
                    </div>
                  </Button>
                  
                  {isExpanded && (
                    <div className="ml-6 space-y-1">
                      {Array.from({ length: section.totalDays }, (_, i) => {
                        const day = i + 1;
                        const dayId = `${section.key}-${day}`;
                        const isCompleted = completedDays.has(dayId);
                        const isActive = currentView === dayId;
                        
                        return (
                          <Button
                            key={dayId}
                            variant={isActive ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start text-xs pl-8"
                            onClick={() => {
                              setCurrentView(dayId);
                              setSidebarOpen(false);
                            }}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-3 h-3 mr-2 text-green-600" />
                            ) : (
                              <div className="w-3 h-3 mr-2 rounded-full border border-gray-300" />
                            )}
                            Day {day}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  const DashboardView = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Track your spiritual growth journey</p>
      </div>

      {/* Current Day's Task */}
      {currentDay && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Today's Focus</CardTitle>
                <CardDescription>
                  {currentDay.sectionName} - Day {currentDay.day}
                  {currentDay.data && `: ${currentDay.data.title}`}
                </CardDescription>
              </div>
              <Button
                onClick={() => setCurrentView(currentDay.dayId)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start Day
              </Button>
            </div>
          </CardHeader>
          {currentDay.data && (
            <CardContent>
              <p className="text-gray-600">
                {currentDay.data.content || "Continue your spiritual development with today's exercises."}
              </p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Overall Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Completion</span>
              <span className="font-medium">{getTotalProgress()}%</span>
            </div>
            <Progress value={getTotalProgress()} className="h-3" />
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{completedDays.size}</div>
                <div className="text-xs text-gray-500">Days Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{54 - completedDays.size}</div>
                <div className="text-xs text-gray-500">Days Remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Recent Assessments
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentView("assessments")}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">Relationship Assessment</div>
                <div className="text-sm text-gray-500">Completed 3 days ago</div>
              </div>
              <Badge variant="secondary">85%</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">Rhythm Assessment</div>
                <div className="text-sm text-gray-500">Completed 1 week ago</div>
              </div>
              <Badge variant="outline">60%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View (Simplified) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center">
                <div className="text-xs font-medium text-gray-500 mb-2">{day}</div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                  {day === 'Wed' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : 
                   day === 'Thu' ? <Clock className="w-4 h-4 text-blue-600" /> :
                   <span className="text-gray-400">•</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AssessmentsView = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Assessment Results</h1>
        <p className="text-gray-600">Review your progress and growth over time</p>
      </div>

      <div className="grid gap-6">
        {sections.slice(0, 3).map((section) => {
          const progress = getSectionProgress(section.key, section.totalDays);
          return (
            <Card key={section.key}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="capitalize">The Habit of {section.name}</CardTitle>
                    <CardDescription>Self-evaluation and reflection</CardDescription>
                  </div>
                  <Badge variant={progress > 70 ? "default" : "secondary"}>
                    {progress}% Complete
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  
                  {progress > 0 && (
                    <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                      <div>
                        <span className="text-gray-500">Initial Score:</span>
                        <span className="ml-2 font-medium">6.2/10</span>
                      </div>
                      {progress > 70 && (
                        <div>
                          <span className="text-gray-500">Final Score:</span>
                          <span className="ml-2 font-medium">8.5/10</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const DayView = (dayId: string) => {
    const [sectionKey, dayNumber] = dayId.split('-');
    const section = sections.find(s => s.key === sectionKey);
    const dayNum = parseInt(dayNumber);
    
    const exerciseData = dailyExercisesData.sections[sectionKey];
    const dayData = exerciseData?.daily_exercises?.find(ex => ex.day === dayNum);

    if (!section || !dayData) {
      return (
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">Exercise data not found.</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="capitalize">{section.name}</span>
            <span>•</span>
            <span>Day {dayNum}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{dayData.title}</h1>
          {dayData.scripture && (
            <p className="text-blue-600 font-medium">{dayData.scripture}</p>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {dayData.content && (
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <p className="text-gray-700 m-0">{dayData.content}</p>
            </div>
          )}

          {/* Questions */}
          {dayData.questions && dayData.questions.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Reflection Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dayData.questions.map((question, index) => (
                    <div key={index} className="space-y-2">
                      <p className="font-medium text-gray-900">{index + 1}. {question}</p>
                      <div className="bg-gray-50 p-3 rounded border">
                        <p className="text-sm text-gray-500 italic">Your reflection will be saved here...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Evaluation Items */}
          {dayData.evaluation_items && dayData.evaluation_items.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Self-Evaluation</CardTitle>
                <CardDescription>Rate each area from 1-10</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dayData.evaluation_items.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-sm font-medium">{item}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">1</span>
                        <div className="flex-1 bg-gray-100 h-2 rounded"></div>
                        <span className="text-xs text-gray-500">10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quotes */}
          {dayData.quotes && dayData.quotes.length > 0 && (
            <div className="space-y-4">
              {dayData.quotes.map((quote, index) => (
                <blockquote key={index} className="border-l-4 border-gray-200 pl-6 italic text-gray-700">
                  "{quote.text}"
                  <footer className="text-sm text-gray-500 mt-2">— {quote.author}</footer>
                </blockquote>
              ))}
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center pt-8">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setCompletedDays(prev => new Set([...prev, dayId]));
              }}
              disabled={completedDays.has(dayId)}
            >
              {completedDays.has(dayId) ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Link to="/mockups">
                <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Hub
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="font-semibold text-gray-900">Layout V2 - Minimal</h1>
                <p className="text-xs text-gray-500">Medium + GitBook inspired</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              Mockup Version
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 sm:p-8">
            {currentView === "dashboard" && <DashboardView />}
            {currentView === "assessments" && <AssessmentsView />}
            {currentView.includes("-") && DayView(currentView)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutVariant2;