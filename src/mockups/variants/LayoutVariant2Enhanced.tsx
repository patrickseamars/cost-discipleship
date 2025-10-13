import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
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
  TrendingUp,
  Save,
  Edit3,
  Quote,
  Star,
  HelpCircle,
  AlertCircle,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Import the actual data
import dailyExercisesData from "@/data/daily-exercises.json";
import sectionOverviewsData from "@/data/section-overviews.json";
import sectionSummariesData from "@/data/section-summaries.json";
import { assessmentStorage } from "@/lib/assessmentStorage";
import { completionStorage } from "@/lib/completionStorage";

// Assessment types
interface AssessmentResults {
  totalScore: number;
  averageScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  strongestAreas: { text: string; rating: number }[];
  weakestAreas: { text: string; rating: number }[];
  completedItems: number;
  totalItems: number;
  ratings: { [key: number]: number };
  reflectionAnswers: { [key: number]: string };
}

const LayoutVariant2Enhanced = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    relationship: true // Start with first section expanded
  });

  // State for daily exercise interactions
  const [reflectionAnswers, setReflectionAnswers] = useState<{ [key: string]: { [key: number]: string } }>({});
  const [questionAnswers, setQuestionAnswers] = useState<{ [key: string]: { [key: number]: string } }>({});
  const [assessmentRatings, setAssessmentRatings] = useState<{ [key: string]: { [key: number]: number } }>({});
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});

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

  // Load saved data on mount and when view changes
  useEffect(() => {
    if (currentView && currentView.includes("-")) {
      const parts = currentView.split("-");
      if (parts.length >= 2) {
        const [sectionKey, dayNumber] = parts;
        
        // Skip data loading for final assessments - they should start fresh
        if (dayNumber === 'final') {
          // For final assessments, force editing mode and don't load saved data
          setIsEditing(prev => ({ ...prev, [currentView]: true }));
          return;
        }
        
        const dayNum = parseInt(dayNumber);
        
        if (!isNaN(dayNum)) {
          // Load reflections
          const reflectionKey = `reflections_${sectionKey}_day${dayNum}`;
          const savedReflections = localStorage.getItem(reflectionKey);
          if (savedReflections) {
            try {
              const parsed = JSON.parse(savedReflections);
              setReflectionAnswers(prev => ({ ...prev, [currentView]: parsed }));
            } catch (error) {
              console.error('Error loading reflections:', error);
            }
          }

          // Load questions
          const questionKey = `questions_${sectionKey}_day${dayNum}`;
          const savedQuestions = localStorage.getItem(questionKey);
          if (savedQuestions) {
            try {
              const parsed = JSON.parse(savedQuestions);
              setQuestionAnswers(prev => ({ ...prev, [currentView]: parsed }));
            } catch (error) {
              console.error('Error loading questions:', error);
            }
          }

          // Check if day is completed
          const isCompleted = completionStorage.isDayComplete(sectionKey, dayNum);
          setIsEditing(prev => ({ ...prev, [currentView]: !isCompleted }));
        }
      }
    }
  }, [currentView]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const getSectionProgress = (sectionKey: string, totalDays: number) => {
    return completionStorage.getCompletionPercentage(sectionKey, totalDays);
  };

  const getTotalProgress = () => {
    const totalDays = sections.length * 6; // 54 total days
    const allCompletions = completionStorage.getAllCompletions();
    const totalCompleted = Object.values(allCompletions).reduce((sum, days) => sum + days.length, 0);
    return Math.round((totalCompleted / totalDays) * 100);
  };

  const getCurrentDayData = () => {
    // Find the next incomplete day
    for (const section of sections) {
      for (let day = 1; day <= section.totalDays; day++) {
        if (!completionStorage.isDayComplete(section.key, day)) {
          return {
            sectionKey: section.key,
            sectionName: section.name,
            day,
            dayId: `${section.key}-${day}`,
            data: dailyExercisesData.sections[section.key]?.daily_exercises?.find(ex => ex.day === day)
          };
        }
      }
    }
    return null;
  };

  const currentDay = getCurrentDayData();

  // Handle answer changes
  const handleReflectionChange = (dayId: string, index: number, value: string) => {
    setReflectionAnswers(prev => ({
      ...prev,
      [dayId]: { ...(prev[dayId] || {}), [index]: value }
    }));
  };

  const handleQuestionChange = (dayId: string, index: number, value: string) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [dayId]: { ...(prev[dayId] || {}), [index]: value }
    }));
  };

  const handleAssessmentRating = (dayId: string, index: number, rating: number) => {
    setAssessmentRatings(prev => ({
      ...prev,
      [dayId]: { ...(prev[dayId] || {}), [index]: rating }
    }));
  };

  // Save functions
  const saveReflections = (dayId: string) => {
    const [sectionKey, dayNumber] = dayId.split("-");
    const dayNum = parseInt(dayNumber);
    
    if (reflectionAnswers[dayId] && Object.keys(reflectionAnswers[dayId]).length > 0) {
      const storageKey = `reflections_${sectionKey}_day${dayNum}`;
      localStorage.setItem(storageKey, JSON.stringify(reflectionAnswers[dayId]));
      
      toast({
        title: "Reflections Saved! ✍️",
        description: "Your reflection responses have been saved.",
      });
    }
  };

  const saveQuestions = (dayId: string) => {
    const [sectionKey, dayNumber] = dayId.split("-");
    const dayNum = parseInt(dayNumber);
    
    if (questionAnswers[dayId] && Object.keys(questionAnswers[dayId]).length > 0) {
      const storageKey = `questions_${sectionKey}_day${dayNum}`;
      localStorage.setItem(storageKey, JSON.stringify(questionAnswers[dayId]));
      
      toast({
        title: "Answers Saved! ✍️",
        description: "Your question responses have been saved.",
      });
    }
  };

  const markDayComplete = (dayId: string) => {
    const [sectionKey, dayNumber] = dayId.split("-");
    const dayNum = parseInt(dayNumber);
    
    completionStorage.markDayComplete(sectionKey, dayNum);
    setIsEditing(prev => ({ ...prev, [dayId]: false }));
    
    toast({
      title: "Day Completed! 🎉",
      description: `Great job! Day ${dayNum} has been marked as complete.`,
    });
  };

  const calculateAssessmentResults = (dayId: string, evaluationItems: string[]): AssessmentResults => {
    const ratings = assessmentRatings[dayId] || {};
    const reflections = reflectionAnswers[dayId] || {};
    
    const ratedItems = evaluationItems.map((item, index) => ({
      text: item,
      rating: ratings[index] || 0
    }));

    const completedItems = Object.keys(ratings).length;
    const totalScore = Object.values(ratings).reduce((sum, rating) => sum + rating, 0);
    const maxPossibleScore = evaluationItems.length * 10;
    const averageScore = completedItems > 0 ? totalScore / completedItems : 0;
    const percentageScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

    const sortedItems = ratedItems.filter(item => item.rating > 0).sort((a, b) => b.rating - a.rating);
    const strongestAreas = sortedItems.slice(0, 3);
    const weakestAreas = sortedItems.slice(-3).reverse();

    return {
      totalScore,
      averageScore,
      maxPossibleScore,
      percentageScore,
      strongestAreas,
      weakestAreas,
      completedItems,
      totalItems: evaluationItems.length,
      ratings,
      reflectionAnswers: reflections
    };
  };

  const submitAssessment = (dayId: string, sectionKey: string, sectionTitle: string, evaluationItems: string[], assessmentType: 'initial' | 'final') => {
    const results = calculateAssessmentResults(dayId, evaluationItems);
    
    // Save to assessment storage
    assessmentStorage.saveAssessment(sectionKey, sectionTitle, assessmentType, results, evaluationItems);
    
    // Mark day as complete
    markDayComplete(dayId);
    
    toast({
      title: "Assessment Completed! 📊",
      description: `Your ${assessmentType} assessment has been saved with a score of ${Math.round(results.percentageScore)}%.`,
    });
  };

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
                        <span className="text-xs text-gray-500 ml-2">{Math.round(progress)}%</span>
                      </div>
                    </div>
                  </Button>
                  
                  {isExpanded && (
                    <div className="ml-6 space-y-1">
                      {/* Overview and Summary */}
                      <Button
                        variant={currentView === `${section.key}-overview` ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-xs pl-8"
                        onClick={() => {
                          setCurrentView(`${section.key}-overview`);
                          setSidebarOpen(false);
                        }}
                      >
                        <Target className="w-3 h-3 mr-2 text-blue-600" />
                        Overview
                      </Button>
                      
                      {/* Daily Exercises */}
                      {Array.from({ length: section.totalDays }, (_, i) => {
                        const day = i + 1;
                        const dayId = `${section.key}-${day}`;
                        const isCompleted = completionStorage.isDayComplete(section.key, day);
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
                      
                      <Button
                        variant={currentView === `${section.key}-week-review` ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-xs pl-8"
                        onClick={() => {
                          setCurrentView(`${section.key}-week-review`);
                          setSidebarOpen(false);
                        }}
                      >
                        <BarChart3 className="w-3 h-3 mr-2 text-purple-600" />
                        Week Review
                      </Button>
                      
                      <Button
                        variant={currentView === `${section.key}-summary` ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-xs pl-8"
                        onClick={() => {
                          setCurrentView(`${section.key}-summary`);
                          setSidebarOpen(false);
                        }}
                      >
                        <TrendingUp className="w-3 h-3 mr-2 text-green-600" />
                        Summary
                      </Button>
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

  const DashboardView = () => {
    const allCompletions = completionStorage.getAllCompletions();
    const totalCompleted = Object.values(allCompletions).reduce((sum, days) => sum + days.length, 0);
    const totalDays = sections.length * 6;
    
    return (
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
                {currentDay.data.scripture && (
                  <p className="text-blue-600 font-medium mt-2">{currentDay.data.scripture}</p>
                )}
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
                  <div className="text-2xl font-bold text-gray-900">{totalCompleted}</div>
                  <div className="text-xs text-gray-500">Days Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{totalDays - totalCompleted}</div>
                  <div className="text-xs text-gray-500">Days Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Section Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {sections.slice(0, 4).map((section) => {
                const progress = getSectionProgress(section.key, section.totalDays);
                const completedDays = completionStorage.getCompletedDays(section.key);
                return (
                  <div key={section.key} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium capitalize">{section.name}</span>
                        <span className="text-sm text-gray-500">{completedDays.length}/{section.totalDays}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                );
              })}
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
              {Object.entries(assessmentStorage.getAllAssessments()).slice(0, 2).map(([sectionKey, assessments]) => (
                <div key={sectionKey}>
                  {assessments.initial && (
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <div className="font-medium capitalize">Initial {sectionKey} Assessment</div>
                        <div className="text-sm text-gray-500">
                          {new Date(assessments.initial.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="secondary">{Math.round(assessments.initial.results.percentageScore)}%</Badge>
                    </div>
                  )}
                  {assessments.final && (
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <div className="font-medium capitalize">Final {sectionKey} Assessment</div>
                        <div className="text-sm text-gray-500">
                          {new Date(assessments.final.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="default">{Math.round(assessments.final.results.percentageScore)}%</Badge>
                    </div>
                  )}
                </div>
              ))}
              {Object.keys(assessmentStorage.getAllAssessments()).length === 0 && (
                <p className="text-gray-500 text-sm">No assessments completed yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const AssessmentsView = () => {
    const allAssessments = assessmentStorage.getAllAssessments();
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    
    // If a section is selected, show detailed view
    if (selectedSection) {
      const assessments = allAssessments[selectedSection];
      const sectionData = dailyExercisesData.sections[selectedSection];
      const evaluationItems = sectionData?.daily_exercises?.find(ex => ex.day === 1 && ex.type === 'assessment')?.evaluation_items || [];
      
      return (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedSection(null)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Assessments
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">The Habit of {selectedSection}</h1>
              <p className="text-gray-600">Detailed assessment analysis</p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setCurrentView(`${selectedSection}-week-review`)}
              >
                View Week Review
              </Button>
              <Button 
                size="sm"
                onClick={() => setCurrentView(`${selectedSection}-1`)}
              >
                Retake Assessment
              </Button>
            </div>
          </div>

          {/* Assessment Cards */}
          <div className="grid gap-6">
            {/* Initial Assessment Details */}
            {assessments.initial && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        Initial Assessment
                      </CardTitle>
                      <CardDescription>
                        Completed on {new Date(assessments.initial.completedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {Math.round(assessments.initial.results.percentageScore)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-blue-600">
                      {assessments.initial.results.averageScore.toFixed(1)}/10
                    </div>
                    <div className="text-sm text-gray-500">
                      Average Score ({assessments.initial.results.totalScore} / {assessments.initial.results.maxPossibleScore} total points)
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Strongest Areas */}
                  {assessments.initial.results.strongestAreas && assessments.initial.results.strongestAreas.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Strongest Areas
                      </h4>
                      <div className="space-y-2">
                        {assessments.initial.results.strongestAreas.slice(0, 3).map((area, index) => (
                          <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded">
                            <span className="text-sm text-green-900">{area.text}</span>
                            <Badge className="bg-green-600 text-white">
                              {area.rating}/10
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Growth Areas */}
                  {assessments.initial.results.weakestAreas && assessments.initial.results.weakestAreas.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        Areas for Growth
                      </h4>
                      <div className="space-y-2">
                        {assessments.initial.results.weakestAreas.slice(0, 3).map((area, index) => (
                          <div key={index} className="flex items-center justify-between bg-orange-50 p-3 rounded">
                            <span className="text-sm text-orange-900">{area.text}</span>
                            <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                              {area.rating}/10
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Final Assessment Details */}
            {assessments.final && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Final Assessment
                      </CardTitle>
                      <CardDescription>
                        Completed on {new Date(assessments.final.completedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="default" className="text-lg px-3 py-1">
                      {Math.round(assessments.final.results.percentageScore)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score with Comparison */}
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-green-600">
                      {assessments.final.results.averageScore.toFixed(1)}/10
                    </div>
                    <div className="text-sm text-gray-500">
                      Average Score ({assessments.final.results.totalScore} / {assessments.final.results.maxPossibleScore} total points)
                    </div>
                    {assessments.initial && (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        {assessments.final.results.averageScore > assessments.initial.results.averageScore ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              +{(assessments.final.results.averageScore - assessments.initial.results.averageScore).toFixed(1)} improvement from initial
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                            <span className="text-sm font-medium text-red-600">
                              {(assessments.final.results.averageScore - assessments.initial.results.averageScore).toFixed(1)} change from initial
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Final Strongest Areas */}
                  {assessments.final.results.strongestAreas && assessments.final.results.strongestAreas.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Strongest Areas (Final)
                      </h4>
                      <div className="space-y-2">
                        {assessments.final.results.strongestAreas.slice(0, 3).map((area, index) => (
                          <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded">
                            <span className="text-sm text-green-900">{area.text}</span>
                            <Badge className="bg-green-600 text-white">
                              {area.rating}/10
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Final Growth Areas */}
                  {assessments.final.results.weakestAreas && assessments.final.results.weakestAreas.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        Areas for Continued Growth (Final)
                      </h4>
                      <div className="space-y-2">
                        {assessments.final.results.weakestAreas.slice(0, 3).map((area, index) => (
                          <div key={index} className="flex items-center justify-between bg-orange-50 p-3 rounded">
                            <span className="text-sm text-orange-900">{area.text}</span>
                            <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                              {area.rating}/10
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      );
    }
    
    // Main assessments overview
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Assessment Results</h1>
          <p className="text-gray-600">Review your progress and growth over time</p>
        </div>

        <div className="grid gap-6">
          {Object.entries(allAssessments).map(([sectionKey, assessments]) => (
            <Card key={sectionKey} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="capitalize">The Habit of {sectionKey}</CardTitle>
                    <CardDescription>Self-evaluation and reflection</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {assessments.initial && (
                      <Badge variant="outline">
                        Initial: {Math.round(assessments.initial.results.percentageScore)}%
                      </Badge>
                    )}
                    {assessments.final && (
                      <Badge variant="default">
                        Final: {Math.round(assessments.final.results.percentageScore)}%
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments.initial && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Initial Assessment</span>
                        <span>{Math.round(assessments.initial.results.percentageScore)}%</span>
                      </div>
                      <Progress value={assessments.initial.results.percentageScore} className="h-2 mb-2" />
                      <div className="text-xs text-gray-500">
                        Completed {new Date(assessments.initial.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  
                  {assessments.final && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Final Assessment</span>
                        <span>{Math.round(assessments.final.results.percentageScore)}%</span>
                      </div>
                      <Progress value={assessments.final.results.percentageScore} className="h-2 mb-2" />
                      <div className="text-xs text-gray-500">
                        Completed {new Date(assessments.final.completedAt).toLocaleDateString()}
                      </div>
                      
                      {assessments.initial && (
                        <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                          <span className="text-green-800 font-medium">
                            Improvement: +{Math.round(assessments.final.results.percentageScore - assessments.initial.results.percentageScore)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSection(sectionKey);
                      }}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentView(`${sectionKey}-week-review`);
                      }}
                    >
                      Week Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {Object.keys(allAssessments).length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessments Yet</h3>
                <p className="text-gray-500 mb-4">Complete your first section to see assessment results here.</p>
                <Button onClick={() => setCurrentView("relationship-1")}>
                  Start First Assessment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const DayView = (dayId: string, isFinalAssessment: boolean = false) => {
    const parts = dayId.split('-');
    if (parts.length < 2) {
      return (
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">Invalid day format.</p>
        </div>
      );
    }
    
    const [sectionKey, dayNumber] = parts;
    const section = sections.find(s => s.key === sectionKey);
    
    // For final assessments, always use day 1 data but don't load saved responses
    let dayNum = parseInt(dayNumber);
    if (isFinalAssessment || dayNumber === 'final') {
      dayNum = 1; // Use day 1 assessment structure
    }
    
    if (isNaN(dayNum)) {
      return (
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">Invalid day number.</p>
        </div>
      );
    }
    
    
    const exerciseData = dailyExercisesData.sections[sectionKey];
    const dayData = exerciseData?.daily_exercises?.find(ex => ex.day === dayNum);

    if (!section || !dayData) {
      return (
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">Exercise data not found.</p>
        </div>
      );
    }

    const isCompleted = isFinalAssessment ? false : completionStorage.isDayComplete(sectionKey, dayNum);
    const isEditingMode = isFinalAssessment ? true : (isEditing[dayId] ?? !isCompleted);
    
    // For final assessments, allow current session data but don't load from localStorage
    const currentReflections = reflectionAnswers[dayId] || {};
    const currentQuestions = questionAnswers[dayId] || {};
    const currentRatings = assessmentRatings[dayId] || {};

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Toaster />
        
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="capitalize">{section.name}</span>
            <span>•</span>
            <span>{isFinalAssessment ? 'Final Assessment' : `Day ${dayNum}`}</span>
            {isCompleted && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">Completed</span>
                </div>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isFinalAssessment ? `Final ${dayData.title}` : dayData.title}
          </h1>
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

          {/* Assessment */}
          {dayData.type === 'assessment' && dayData.evaluation_items && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{isFinalAssessment ? 'Final Self-Assessment' : 'Self-Assessment'}</CardTitle>
                <CardDescription>
                  {isFinalAssessment 
                    ? 'Rate each area from 1-10 based on your growth after completing this section. 1 = "never true of me", 10 = "always true of me"'
                    : 'Rate each area from 1-10, where 1 is "never true of me" and 10 is "always true of me"'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dayData.evaluation_items.map((item, index) => (
                    <div key={index} className="space-y-3">
                      <p className="text-sm font-medium">{item}</p>
                      <div className="flex gap-1 flex-wrap">
                        {Array.from({ length: 10 }, (_, i) => {
                          const rating = i + 1;
                          const isSelected = currentRatings[index] === rating;
                          const isDisabled = isFinalAssessment ? false : !isEditingMode;
                          
                          return (
                            <Button
                              key={rating}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleAssessmentRating(dayId, index, rating)}
                              disabled={isDisabled}
                            >
                              {rating}
                            </Button>
                          );
                        })}
                      </div>
                      {currentRatings[index] && (
                        <p className="text-xs text-gray-500">You rated this: {currentRatings[index]}/10</p>
                      )}
                    </div>
                  ))}

                  {/* Progress Indicator */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-900">Assessment Progress</span>
                      <span className="text-sm text-blue-700">
                        {Object.keys(currentRatings).length} of {dayData.evaluation_items.length} completed
                      </span>
                    </div>
                    <Progress 
                      value={(Object.keys(currentRatings).length / dayData.evaluation_items.length) * 100} 
                      className="h-2 mb-2"
                    />
                  </div>

                  {/* Assessment Results - Full Display */}
                  {Object.keys(currentRatings).length > 0 && (
                    <div className="mt-6 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            Your Assessment Results
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {(() => {
                            const results = calculateAssessmentResults(dayId, dayData.evaluation_items);
                            const getScoreColor = (score) => {
                              if (score >= 8) return "text-green-600";
                              if (score >= 6) return "text-yellow-600";
                              return "text-red-600";
                            };
                            const getOverallRating = (percentage) => {
                              if (percentage >= 80) return { label: "Excellent", color: "text-green-600" };
                              if (percentage >= 70) return { label: "Good", color: "text-blue-600" };
                              if (percentage >= 60) return { label: "Fair", color: "text-yellow-600" };
                              if (percentage >= 50) return { label: "Needs Improvement", color: "text-orange-600" };
                              return { label: "Needs Significant Growth", color: "text-red-600" };
                            };
                            
                            return (
                              <>
                                {/* Overall Score */}
                                <div className="text-center space-y-2">
                                  <div className="text-3xl font-bold text-blue-600">
                                    {results.averageScore.toFixed(1)}/10
                                  </div>
                                  <div className={`text-lg font-semibold ${getOverallRating(results.percentageScore).color}`}>
                                    {getOverallRating(results.percentageScore).label}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Overall Average Score ({results.percentageScore.toFixed(0)}%)
                                  </div>
                                </div>

                                <Separator />

                                {/* Score Breakdown */}
                                <div className="grid grid-cols-2 gap-4 text-center">
                                  <div className="space-y-1">
                                    <div className="text-2xl font-bold text-blue-600">{results.totalScore}</div>
                                    <div className="text-xs text-gray-500">Total Points</div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="text-2xl font-bold text-gray-400">{results.maxPossibleScore}</div>
                                    <div className="text-xs text-gray-500">Possible Points</div>
                                  </div>
                                </div>

                                {/* Strongest Areas */}
                                {results.strongestAreas.length > 0 && results.completedItems === results.totalItems && (
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                      <TrendingUp className="w-4 h-4 text-green-600" />
                                      Strongest Areas
                                    </h4>
                                    <div className="space-y-2">
                                      {results.strongestAreas.map((area, index) => (
                                        <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded">
                                          <span className="text-sm text-green-900">{area.text}</span>
                                          <Badge className="bg-green-600 text-white">
                                            {area.rating}/10
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Growth Areas */}
                                {results.weakestAreas.length > 0 && results.completedItems === results.totalItems && (
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                      <AlertCircle className="w-4 h-4 text-orange-600" />
                                      Growth Opportunities
                                    </h4>
                                    <div className="space-y-2">
                                      {results.weakestAreas.map((area, index) => (
                                        <div key={index} className="flex items-center justify-between bg-orange-50 p-3 rounded">
                                          <span className="text-sm text-orange-900">{area.text}</span>
                                          <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                                            {area.rating}/10
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Completion Status */}
                                {results.completedItems < results.totalItems && (
                                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                      Complete all ratings to see your full assessment results and reflection prompts.
                                    </p>
                                  </div>
                                )}
                              </>
                            );
                          })()
                          }
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Questions */}
          {dayData.questions && dayData.questions.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reflection Questions</CardTitle>
                  {isEditingMode && Object.keys(currentQuestions).length > 0 && (
                    <Button 
                      onClick={() => {
                        saveQuestions(dayId);
                        setIsEditing(prev => ({ ...prev, [dayId]: false }));
                      }}
                      size="sm"
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Answers
                    </Button>
                  )}
                  {!isEditingMode && (
                    <Button
                      onClick={() => setIsEditing(prev => ({ ...prev, [dayId]: true }))}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dayData.questions.map((question, index) => (
                    <div key={index} className="space-y-3">
                      <p className="font-medium text-gray-900">{index + 1}. {question}</p>
                      {isEditingMode ? (
                        <Textarea
                          placeholder="Share your thoughts..."
                          value={currentQuestions[index] || ""}
                          onChange={(e) => handleQuestionChange(dayId, index, e.target.value)}
                          rows={3}
                        />
                      ) : (
                        <div className="bg-gray-50 p-3 rounded border">
                          {currentQuestions[index] ? (
                            <p className="text-gray-700">{currentQuestions[index]}</p>
                          ) : (
                            <p className="text-gray-500 italic">No answer provided</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assessment Reflection Section */}
          {dayData.type === 'assessment' && dayData.reflection_prompts && dayData.reflection_prompts.length > 0 && 
           Object.keys(currentRatings).length === dayData.evaluation_items.length && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Assessment Reflection</CardTitle>
                <CardDescription>Complete your reflections to finish the assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dayData.reflection_prompts.map((prompt, index) => (
                    <div key={index} className="space-y-3">
                      <label className="text-sm font-medium text-gray-900">{prompt}</label>
                      <Textarea
                        placeholder="Write your reflection here..."
                        value={currentReflections[index] || ""}
                        onChange={(e) => handleReflectionChange(dayId, index, e.target.value)}
                        rows={3}
                        className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                  
                  {/* Reflection Completion Status */}
                  {(() => {
                    const completedReflections = Object.keys(currentReflections).filter(key => 
                      currentReflections[parseInt(key)]?.trim().length > 0
                    ).length;
                    const isReflectionsComplete = completedReflections === dayData.reflection_prompts.length;
                    const isRatingsComplete = Object.keys(currentRatings).length === dayData.evaluation_items.length;
                    const isReadyToSubmit = isRatingsComplete && isReflectionsComplete;
                    
                    return (
                      <>
                        {/* Progress Status */}
                        {!isReadyToSubmit && (
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <p className="text-sm text-orange-700">
                              Complete all reflection questions to submit your assessment.
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              Reflections completed: {completedReflections} of {dayData.reflection_prompts.length}
                            </p>
                          </div>
                        )}
                        
                        {/* Submit Button */}
                        {isReadyToSubmit && !isCompleted && (
                          <div className="text-center p-4 space-y-3">
                            <p className="text-sm text-green-700">
                              ✓ All questions completed! Ready to submit your assessment.
                            </p>
                            <Button
                              onClick={() => {
                                const assessmentType = dayNum === 1 ? 'initial' : 'final';
                                submitAssessment(dayId, sectionKey, `The Habit of ${section.name}`, dayData.evaluation_items, assessmentType);
                              }}
                              size="lg"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Submit Assessment
                            </Button>
                          </div>
                        )}
                        
                        {isCompleted && (
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-700 font-medium">
                              ✓ Assessment Submitted Successfully! Your responses have been saved.
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })()
                  }
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Regular Reflection Prompts (Non-Assessment) */}
          {dayData.type !== 'assessment' && dayData.reflection_prompts && dayData.reflection_prompts.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reflection Prompts</CardTitle>
                  {isEditingMode && Object.keys(currentReflections).length > 0 && (
                    <Button 
                      onClick={() => {
                        saveReflections(dayId);
                        setIsEditing(prev => ({ ...prev, [dayId]: false }));
                      }}
                      size="sm"
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Reflections
                    </Button>
                  )}
                  {!isEditingMode && (
                    <Button
                      onClick={() => setIsEditing(prev => ({ ...prev, [dayId]: true }))}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dayData.reflection_prompts.map((prompt, index) => (
                    <div key={index} className="space-y-3">
                      <p className="font-medium text-gray-900">{index + 1}. {prompt}</p>
                      {isEditingMode ? (
                        <Textarea
                          placeholder="Share your reflection..."
                          value={currentReflections[index] || ""}
                          onChange={(e) => handleReflectionChange(dayId, index, e.target.value)}
                          rows={3}
                        />
                      ) : (
                        <div className="bg-gray-50 p-3 rounded border">
                          {currentReflections[index] ? (
                            <p className="text-gray-700">{currentReflections[index]}</p>
                          ) : (
                            <p className="text-gray-500 italic">No reflection provided</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quotes */}
          {dayData.quotes && dayData.quotes.length > 0 && (
            <div className="space-y-4 mb-8">
              {dayData.quotes.map((quote, index) => (
                <Card key={index} className="border-l-4 border-blue-200">
                  <CardContent className="pt-6">
                    <blockquote className="text-gray-700 italic mb-2">
                      "{quote.text}"
                    </blockquote>
                    <footer className="text-sm text-gray-500">— {quote.author}</footer>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Action Buttons - For Non-Assessment Days */}
          {dayData.type !== 'assessment' && (
            <div className="flex justify-center gap-4 pt-8">
              {!isCompleted && (
                <Button 
                  onClick={() => markDayComplete(dayId)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Mark as Complete
                </Button>
              )}

              {isCompleted && (
                <Button variant="outline" disabled className="gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </Button>
              )}
            </div>
          )}
          
          {/* Assessment Completion Status - For Assessment Days */}
          {dayData.type === 'assessment' && (
            <div className="flex justify-center gap-4 pt-8">
              {isCompleted && (
                <Button variant="outline" disabled className="gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Assessment Completed
                </Button>
              )}
            </div>
          )}
          
          {/* Next Steps - For Completed Assessments */}
          {dayData.type === 'assessment' && isCompleted && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    Based on your assessment, focus on your growth opportunities while maintaining your strengths. 
                    Consider setting specific goals for areas scoring below 7/10.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentView("assessments")}
                    >
                      View All Assessments
                    </Button>
                    {(() => {
                      const nextDayId = `${sectionKey}-${dayNum + 1}`;
                      const hasNextDay = dayNum < 6;
                      return hasNextDay ? (
                        <Button 
                          size="sm"
                          onClick={() => setCurrentView(nextDayId)}
                        >
                          Continue to Day {dayNum + 1}
                        </Button>
                      ) : null;
                    })()
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const OverviewView = (viewId: string) => {
    const sectionKey = viewId.replace('-overview', '');
    const sectionData = sectionOverviewsData.sections[sectionKey];
    
    if (!sectionData) {
      return (
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <p className="text-gray-500">Overview data not found for this section.</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{sectionData.title}</h1>
          <p className="text-lg text-blue-600 font-medium">{sectionData.core_habit}</p>
        </div>

        {/* Overview Content */}
        {sectionData.overview && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Section Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{sectionData.overview}</p>
            </CardContent>
          </Card>
        )}

        {/* Implementation Details */}
        {sectionData.implementation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Implementation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{sectionData.implementation}</p>
            </CardContent>
          </Card>
        )}

        {/* SOAP Method (for Relationship section) */}
        {sectionData.soap_method && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5 text-purple-600" />
                SOAP Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{sectionData.soap_method.description}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">S - {sectionData.soap_method.S}</h4>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">O - {sectionData.soap_method.O}</h4>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">A - {sectionData.soap_method.A}</h4>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">P - {sectionData.soap_method.P}</h4>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meeting Discussion */}
        {sectionData.meeting && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-orange-600" />
                {sectionData.meeting.title}
              </CardTitle>
              {sectionData.meeting.scripture && (
                <CardDescription className="text-base font-medium text-blue-600">
                  Scripture: {sectionData.meeting.scripture}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {sectionData.meeting.introduction && (
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-blue-200">
                  {sectionData.meeting.introduction}
                </p>
              )}
              
              {sectionData.meeting.key_concepts && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Concepts:</h4>
                  <ul className="space-y-2">
                    {sectionData.meeting.key_concepts.map((concept, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {sectionData.meeting.discussion_points && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Discussion Questions:</h4>
                  <div className="space-y-3">
                    {sectionData.meeting.discussion_points.map((question, index) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-300">
                        <p className="text-gray-800">{index + 1}. {question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const SummaryView = (viewId: string) => {
    const sectionKey = viewId.replace('-summary', '');
    const sectionData = sectionSummariesData.sections[sectionKey];
    
    if (!sectionData) {
      return (
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <p className="text-gray-500">Summary data not found for this section.</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{sectionData.title} - Summary</h1>
          <p className="text-lg text-green-600 font-medium">{sectionData.core_habit}</p>
        </div>

        {/* Introduction */}
        {sectionData.summary?.introduction && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Section Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{sectionData.summary.introduction}</p>
            </CardContent>
          </Card>
        )}

        {/* Key Thoughts */}
        {sectionData.summary?.key_thoughts && (
          <Card>
            <CardHeader>
              <CardTitle>Key Thoughts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {sectionData.summary.key_thoughts.map((thought, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">{thought}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Identity Statement */}
        {sectionData.summary?.identity_statement && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Identity Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-blue-800">{sectionData.summary.identity_statement}</p>
            </CardContent>
          </Card>
        )}

        {/* Section-specific content */}
        {sectionData.summary?.methods_introduced && (
          <Card>
            <CardHeader>
              <CardTitle>Methods Introduced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectionData.summary.methods_introduced.map((method, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{method.name}</h4>
                    <p className="text-gray-700">{method.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Habit Tracker */}
        {sectionData.summary?.habit_tracker_items && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Habit Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {sectionData.summary.habit_tracker_items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                    <div className="w-4 h-4 rounded border border-gray-300" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const WeekReviewView = (viewId: string) => {
    const sectionKey = viewId.replace('-week-review', '');
    const section = sections.find(s => s.key === sectionKey);
    const sectionData = dailyExercisesData.sections[sectionKey];
    
    if (!section || !sectionData) {
      return (
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <p className="text-gray-500">Section data not found.</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Get assessment data from Day 1 (initial assessment)
    const initialAssessmentData = sectionData.daily_exercises?.find(ex => ex.day === 1 && ex.type === 'assessment');
    
    if (!initialAssessmentData) {
      return (
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessment Available</h3>
              <p className="text-gray-500">This section doesn't have an assessment to review.</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    const assessmentComparison = assessmentStorage.getAssessmentComparison(sectionKey);
    const hasInitialAssessment = assessmentComparison?.initial;
    const hasFinalAssessment = assessmentComparison?.final;
    
    const getComparisonData = () => {
      if (!assessmentComparison?.initial || !assessmentComparison?.final) return [];
      
      return initialAssessmentData.evaluation_items.map((item, index) => {
        const initialRatings = assessmentComparison.initial?.results?.ratings || {};
        const finalRatings = assessmentComparison.final?.results?.ratings || {};
        
        const initialRating = Number(initialRatings[index] ?? initialRatings[index.toString()] ?? 0);
        const finalRating = Number(finalRatings[index] ?? finalRatings[index.toString()] ?? 0);
        
        const change = finalRating - initialRating;
        
        let changeType: 'improved' | 'declined' | 'same' = 'same';
        if (change > 0) changeType = 'improved';
        else if (change < 0) changeType = 'declined';

        return {
          text: item,
          initialRating,
          finalRating,
          change,
          changeType
        };
      });
    };

    const getChangeIcon = (changeType: string) => {
      switch (changeType) {
        case 'improved':
          return <TrendingUp className="w-4 h-4 text-green-600" />;
        case 'declined':
          return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
        default:
          return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
      }
    };

    const getChangeColor = (changeType: string) => {
      switch (changeType) {
        case 'improved':
          return 'text-green-600 bg-green-50';
        case 'declined':
          return 'text-red-600 bg-red-50';
        default:
          return 'text-gray-600 bg-gray-50';
      }
    };

    const comparisonData = getComparisonData();

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Week Review - {section.name}</h1>
          <p className="text-gray-600">Compare your initial and final assessments to see your growth</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="space-y-2">
                {hasInitialAssessment ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto" />
                    <p className="text-sm font-medium">Initial Assessment</p>
                    <p className="text-xs text-gray-500">Completed Day 1</p>
                    <Badge variant="secondary">
                      {Math.round(assessmentComparison.initial.results.percentageScore)}%
                    </Badge>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 border border-gray-300 rounded-full mx-auto" />
                    <p className="text-sm font-medium text-gray-500">Initial Assessment</p>
                    <p className="text-xs text-gray-500">Not completed</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setCurrentView(`${sectionKey}-1`)}
                    >
                      Take Assessment
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="space-y-2">
                {hasFinalAssessment ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto" />
                    <p className="text-sm font-medium">Final Assessment</p>
                    <p className="text-xs text-gray-500">Completed</p>
                    <Badge variant="default">
                      {Math.round(assessmentComparison.final.results.percentageScore)}%
                    </Badge>
                  </>
                ) : hasInitialAssessment ? (
                  <>
                    <Target className="w-6 h-6 text-blue-600 mx-auto" />
                    <p className="text-sm font-medium">Final Assessment</p>
                    <p className="text-xs text-gray-500">Ready to complete</p>
                    <Button 
                      size="sm"
                      onClick={() => {
                        // Create a simulated final assessment dayId for retaking
                        const finalDayId = `${sectionKey}-final`;
                        setCurrentView(finalDayId);
                      }}
                    >
                      Take Final Assessment
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 border border-gray-300 rounded-full mx-auto" />
                    <p className="text-sm font-medium text-gray-500">Final Assessment</p>
                    <p className="text-xs text-gray-500">Complete initial first</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Results */}
        {hasFinalAssessment && hasInitialAssessment && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Your Week's Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Progress */}
              <div className="text-center space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-gray-600">
                      {assessmentComparison.initial.results.averageScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Initial Score</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-blue-600">
                      {assessmentComparison.final.results.averageScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Final Score</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-2">
                  {assessmentComparison.final.results.averageScore > assessmentComparison.initial.results.averageScore ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        +{(assessmentComparison.final.results.averageScore - assessmentComparison.initial.results.averageScore).toFixed(1)} improvement
                      </span>
                    </>
                  ) : assessmentComparison.final.results.averageScore < assessmentComparison.initial.results.averageScore ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                      <span className="text-sm font-medium text-red-600">
                        {(assessmentComparison.final.results.averageScore - assessmentComparison.initial.results.averageScore).toFixed(1)} change
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 bg-gray-400 rounded-full" />
                      <span className="text-sm font-medium text-gray-600">No change</span>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Detailed Comparison */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Individual Area Progress</h4>
                {comparisonData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <p className="text-sm flex-1 mr-2">{item.text}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-mono">
                          {item.initialRating} → {item.finalRating}
                        </span>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getChangeColor(item.changeType)}`}>
                          {getChangeIcon(item.changeType)}
                          {item.change !== 0 && (
                            <span>{item.change > 0 ? '+' : ''}{item.change}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 mb-2">Initial</div>
                        <Progress value={(item.initialRating / 10) * 100} className="h-3" />
                        <div className="text-xs text-gray-500 mt-1 font-mono">{item.initialRating}/10</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 mb-2">Final</div>
                        <Progress value={(item.finalRating / 10) * 100} className="h-3" />
                        <div className="text-xs text-gray-500 mt-1 font-mono">{item.finalRating}/10</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {comparisonData.filter(item => item.changeType === 'improved').length}
                  </div>
                  <div className="text-xs text-gray-500">Areas Improved</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-600">
                    {comparisonData.filter(item => item.changeType === 'same').length}
                  </div>
                  <div className="text-xs text-gray-500">No Change</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">
                    {comparisonData.filter(item => item.changeType === 'declined').length}
                  </div>
                  <div className="text-xs text-gray-500">Areas Declined</div>
                </div>
              </div>

              {/* Retake Option */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Want to retake the final assessment?</p>
                    <p className="text-xs text-gray-500">This will replace your current results</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentView(`${sectionKey}-final`)}
                  >
                    Retake Assessment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action for Missing Assessments */}
        {!hasInitialAssessment && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Initial Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700 mb-4">
                  You need to complete the initial assessment (Day 1) before you can do the week review comparison.
                </p>
                <Button onClick={() => setCurrentView(`${sectionKey}-1`)}>
                  Take Initial Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {hasInitialAssessment && !hasFinalAssessment && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Complete Your Week Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  You completed your initial assessment on Day 1. Now it's time to reassess yourself 
                  after a week of growth and see how you've progressed!
                </p>
                <Button 
                  onClick={() => setCurrentView(`${sectionKey}-final`)}
                  className="w-full"
                  size="lg"
                >
                  Take Final Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
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
              <div className="cost-logo-container">
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="text-content">CO</div>
                <div className="text-content">ST</div>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">COST Training</h1>
                <p className="text-xs text-gray-500">Cultivating Obedience through Scripture & Training</p>
              </div>
            </div>
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
            {currentView.includes("-overview") && OverviewView(currentView)}
            {currentView.includes("-summary") && SummaryView(currentView)}
            {currentView.includes("-week-review") && WeekReviewView(currentView)}
            {currentView.includes("-final") && DayView(currentView, true)} {/* Handle final assessment as fresh assessment */}
            {currentView.includes("-") && !currentView.includes("-overview") && !currentView.includes("-summary") && !currentView.includes("-week-review") && !currentView.includes("-final") && DayView(currentView, false)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutVariant2Enhanced;