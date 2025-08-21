import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, TrendingUp, TrendingDown, Minus, Calendar, BarChart3, Target, Award } from "lucide-react";
import { InteractiveAssessment } from "./InteractiveAssessment";
import { assessmentStorage } from "@/lib/assessmentStorage";
import { useToast } from "@/hooks/use-toast";

interface WeekReviewAssessmentProps {
  sectionKey: string;
  sectionTitle: string;
  evaluationItems: string[];
  reflectionPrompts: string[];
}

interface ComparisonItem {
  text: string;
  initialRating: number;
  finalRating: number;
  change: number;
  changeType: 'improved' | 'declined' | 'same';
}

export const WeekReviewAssessment = ({
  sectionKey,
  sectionTitle,
  evaluationItems,
  reflectionPrompts
}: WeekReviewAssessmentProps) => {
  const [showFinalAssessment, setShowFinalAssessment] = useState(false);
  const [comparison, setComparison] = useState<{
    initial: any;
    final: any;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadComparison();
  }, [sectionKey]);

  const loadComparison = () => {
    const assessmentData = assessmentStorage.getAssessmentComparison(sectionKey);
    setComparison(assessmentData);
  };

  const handleFinalAssessmentComplete = (results: any) => {
    // Save the final assessment
    assessmentStorage.saveAssessment(
      sectionKey,
      sectionTitle,
      'final',
      results,
      evaluationItems
    );

    toast({
      title: "Week Review Complete! 🎉",
      description: "Your final assessment has been saved and compared with your initial assessment.",
    });

    // Reload comparison data
    loadComparison();
    setShowFinalAssessment(false);
  };

  const getComparisonData = (): ComparisonItem[] => {
    if (!comparison?.initial || !comparison?.final) return [];

    return evaluationItems.map((item, index) => {
      // Access ratings data (the debug shows string keys like "0", "1", etc.)
      const initialRatings = comparison.initial?.results?.ratings || {};
      const finalRatings = comparison.final?.results?.ratings || {};
      
      // Try both numeric and string keys and ensure we get numbers
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
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
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

  const hasInitialAssessment = comparison?.initial;
  const hasFinalAssessment = comparison?.final;
  const comparisonData = getComparisonData();

  // If showing final assessment
  if (showFinalAssessment) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowFinalAssessment(false)}
          >
            ← Back to Week Review
          </Button>
        </div>
        
        <InteractiveAssessment
          title="Week Review Assessment"
          sectionTitle={sectionTitle}
          evaluationItems={evaluationItems}
          reflectionPrompts={reflectionPrompts}
          onComplete={handleFinalAssessmentComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Calendar className="w-4 h-4 mr-2" />
          Week Review
        </Badge>
        <h1 className="text-2xl font-bold text-primary">Weekly Assessment Comparison</h1>
        <p className="text-sm text-muted-foreground">{sectionTitle}</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="space-y-2">
              {hasInitialAssessment ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto" />
                  <p className="text-sm font-medium">Initial Assessment</p>
                  <p className="text-xs text-muted-foreground">Completed Day 1</p>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 border border-muted-foreground/30 rounded-full mx-auto" />
                  <p className="text-sm font-medium text-muted-foreground">Initial Assessment</p>
                  <p className="text-xs text-muted-foreground">Not completed</p>
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
                  <p className="text-xs text-muted-foreground">Completed</p>
                </>
              ) : (
                <>
                  <Target className="w-6 h-6 text-primary mx-auto" />
                  <p className="text-sm font-medium">Final Assessment</p>
                  <p className="text-xs text-muted-foreground">Ready to complete</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Section */}
      {!hasFinalAssessment ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Complete Your Week Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasInitialAssessment ? (
              <>
                <p className="text-sm text-muted-foreground">
                  You completed your initial assessment on Day 1. Now it's time to reassess yourself 
                  after a week of growth and see how you've progressed!
                </p>
                <Button 
                  onClick={() => setShowFinalAssessment(true)}
                  className="w-full"
                  size="lg"
                >
                  Take Final Assessment
                </Button>
              </>
            ) : (
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">
                  You need to complete the initial assessment (Day 1) before you can do the week review comparison.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Comparison Results */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Your Week's Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Progress */}
            <div className="text-center space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {comparison.initial.results.averageScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Initial Score</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">
                    {comparison.final.results.averageScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Final Score</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-2">
                {comparison.final.results.averageScore > comparison.initial.results.averageScore ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      +{(comparison.final.results.averageScore - comparison.initial.results.averageScore).toFixed(1)} improvement
                    </span>
                  </>
                ) : comparison.final.results.averageScore < comparison.initial.results.averageScore ? (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      {(comparison.final.results.averageScore - comparison.initial.results.averageScore).toFixed(1)} change
                    </span>
                  </>
                ) : (
                  <>
                    <Minus className="w-4 h-4 text-gray-500" />
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
                      <span className="text-xs text-muted-foreground font-mono">
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
                      <div className="text-xs font-medium text-muted-foreground mb-2">Initial</div>
                      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 ease-out"
                          style={{ width: `${(item.initialRating / 10) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">{item.initialRating}/10</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Final</div>
                      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300 ease-out shadow-sm"
                          style={{ width: `${(item.finalRating / 10) * 100}%` }}
                        />
                      </div>
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
                <div className="text-xs text-muted-foreground">Areas Improved</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-600">
                  {comparisonData.filter(item => item.changeType === 'same').length}
                </div>
                <div className="text-xs text-muted-foreground">No Change</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {comparisonData.filter(item => item.changeType === 'declined').length}
                </div>
                <div className="text-xs text-muted-foreground">Areas Declined</div>
              </div>
            </div>

            {/* Retake Option */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Want to retake the final assessment?</p>
                  <p className="text-xs text-muted-foreground">This will replace your current results</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFinalAssessment(true)}
                >
                  Retake Assessment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
