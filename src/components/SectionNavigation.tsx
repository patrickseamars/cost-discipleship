import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, CheckSquare, ArrowLeft, ArrowRight, Calendar, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { SectionOverview } from "./SectionOverview";
import { DailyExercise } from "./DailyExercise";
import { SectionSummary } from "./SectionSummary";
import { WeekReviewAssessment } from "./WeekReviewAssessment";
import { completionStorage } from "@/lib/completionStorage";

interface SectionNavigationProps {
  sectionKey: string;
  overviewData: any;
  exerciseData: any;
  summaryData: any;
}

export const SectionNavigation = ({ 
  sectionKey, 
  overviewData, 
  exerciseData, 
  summaryData 
}: SectionNavigationProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  
  const exercises = exerciseData?.daily_exercises || [];
  const totalDays = exercises.length;
  
  // Load completed days on mount and when currentDay changes
  useEffect(() => {
    const completed = completionStorage.getCompletedDays(sectionKey);
    setCompletedDays(completed);
  }, [sectionKey, currentDay]);

  const handleNextDay = () => {
    if (currentDay < totalDays) {
      setCurrentDay(currentDay + 1);
    }
  };

  const handlePrevDay = () => {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
    }
  };

  const getCurrentExercise = () => {
    return exercises.find((exercise: any) => exercise.day === currentDay);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="exercises" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Daily Exercises
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Summary
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0">
            {overviewData && <SectionOverview section={overviewData} />}
          </TabsContent>

          <TabsContent value="exercises" className="mt-0">
            {exercises.length > 0 && (
              <>
                {/* Day Navigation */}
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Daily Exercises</h2>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          Day {currentDay} of {totalDays}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevDay}
                            disabled={currentDay === 1}
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextDay}
                            disabled={currentDay === totalDays}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Day Selection */}
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
                        const isCompleted = completedDays.includes(day);
                        const isCurrent = currentDay === day;
                        
                        return (
                          <Button
                            key={day}
                            variant={isCurrent ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentDay(day)}
                            className={`w-10 h-8 relative ${
                              isCompleted && !isCurrent 
                                ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
                                : ""
                            } ${
                              isCompleted && isCurrent 
                                ? "bg-green-600 hover:bg-green-700 text-white" 
                                : ""
                            }`}
                          >
                            {isCompleted && (
                              <Check className="w-3 h-3 absolute -top-1 -right-1 bg-green-600 text-white rounded-full p-0.5" />
                            )}
                            {day}
                          </Button>
                        );
                      })}
                      
                      {/* Week Review Button */}
                      <Button
                        key="review"
                        variant={currentDay === totalDays + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentDay(totalDays + 1)}
                        className="flex items-center gap-1 px-3"
                      >
                        <Calendar className="w-3 h-3" />
                        Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Exercise or Week Review */}
                {currentDay === totalDays + 1 ? (
                  <WeekReviewAssessment
                    sectionKey={sectionKey}
                    sectionTitle={exerciseData.title}
                    evaluationItems={exercises.find((ex: any) => ex.type === 'assessment')?.evaluation_items || []}
                    reflectionPrompts={exercises.find((ex: any) => ex.type === 'assessment')?.reflection_prompts || []}
                  />
                ) : (
                  getCurrentExercise() && (
                    <DailyExercise 
                      exercise={getCurrentExercise()} 
                      sectionTitle={exerciseData.title}
                      sectionKey={sectionKey}
                    />
                  )
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="summary" className="mt-0">
            {summaryData && <SectionSummary summary={summaryData} sectionKey={sectionKey} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
