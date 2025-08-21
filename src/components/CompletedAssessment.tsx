import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckSquare, BarChart3, Target, TrendingUp, AlertCircle, RefreshCw, Calendar } from "lucide-react";
import { InteractiveAssessment } from "./InteractiveAssessment";

interface AssessmentItem {
  text: string;
  rating: number;
}

interface AssessmentResults {
  totalScore: number;
  averageScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  strongestAreas: AssessmentItem[];
  weakestAreas: AssessmentItem[];
  completedItems: number;
  totalItems: number;
  ratings: { [key: number]: number };
  reflectionAnswers: { [key: number]: string };
}

interface StoredAssessment {
  sectionKey: string;
  sectionTitle: string;
  assessmentType: 'initial' | 'final';
  results: AssessmentResults;
  completedAt: string;
  evaluationItems: string[];
}

interface CompletedAssessmentProps {
  assessment: StoredAssessment;
  title: string;
  sectionTitle: string;
  evaluationItems: string[];
  reflectionPrompts: string[];
  onComplete?: (results: AssessmentResults) => void;
}

export const CompletedAssessment = ({
  assessment,
  title,
  sectionTitle,
  evaluationItems,
  reflectionPrompts,
  onComplete
}: CompletedAssessmentProps) => {
  const [showRetake, setShowRetake] = useState(false);
  
  if (showRetake) {
    return (
      <InteractiveAssessment
        title={title}
        sectionTitle={sectionTitle}
        evaluationItems={evaluationItems}
        reflectionPrompts={reflectionPrompts}
        onComplete={onComplete}
      />
    );
  }

  const results = assessment.results;

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getOverallRating = (percentage: number) => {
    if (percentage >= 80) return { label: "Excellent", color: "text-green-600" };
    if (percentage >= 70) return { label: "Good", color: "text-blue-600" };
    if (percentage >= 60) return { label: "Fair", color: "text-yellow-600" };
    if (percentage >= 50) return { label: "Needs Improvement", color: "text-orange-600" };
    return { label: "Needs Significant Growth", color: "text-red-600" };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="default" className="text-lg px-4 py-2 bg-green-600">
          ✓ Assessment Completed
        </Badge>
        <h1 className="text-2xl font-bold text-primary">{title}</h1>
        <p className="text-sm text-muted-foreground">{sectionTitle}</p>
        <div className="flex items-center justify-center gap-2">
          <CheckSquare className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Self-Assessment</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>Completed on {formatDate(assessment.completedAt)}</span>
        </div>
      </div>

      {/* Retake Button */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setShowRetake(true)}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retake Assessment
        </Button>
      </div>

      {/* Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Your Assessment Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">
              {results.averageScore.toFixed(1)}/10
            </div>
            <div className={`text-lg font-semibold ${getOverallRating(results.percentageScore).color}`}>
              {getOverallRating(results.percentageScore).label}
            </div>
            <div className="text-sm text-muted-foreground">
              Overall Average Score ({results.percentageScore.toFixed(0)}%)
            </div>
          </div>

          <Separator />

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{results.totalScore}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-muted-foreground">{results.maxPossibleScore}</div>
              <div className="text-xs text-muted-foreground">Possible Points</div>
            </div>
          </div>

          {/* Strongest Areas */}
          {results.strongestAreas.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Strongest Areas
              </h4>
              <div className="space-y-2">
                {results.strongestAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                    <span className="text-xs">{area.text}</span>
                    <Badge variant="default" className="text-xs bg-green-600">
                      {area.rating}/10
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Growth Areas */}
          {results.weakestAreas.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                Growth Opportunities
              </h4>
              <div className="space-y-2">
                {results.weakestAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between bg-orange-50 p-2 rounded">
                    <span className="text-xs">{area.text}</span>
                    <Badge variant="secondary" className="text-xs bg-orange-200">
                      {area.rating}/10
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Ratings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Your Individual Ratings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {evaluationItems.map((item, index) => {
            const rating = results.ratings[index];
            return (
              <div key={index} className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                <span className="text-sm flex-1 pr-4">{item}</span>
                <Badge 
                  variant={rating >= 8 ? "default" : rating >= 6 ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {rating}/10
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Reflection Answers */}
      {results.reflectionAnswers && Object.keys(results.reflectionAnswers).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Reflection Responses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reflectionPrompts.map((prompt, index) => (
              <div key={index} className="space-y-2">
                <p className="text-sm font-medium">{prompt}</p>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {results.reflectionAnswers[index] || "No response provided"}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
            <p className="text-sm">
              Based on your assessment, focus on your growth opportunities while maintaining your strengths. 
              Consider setting specific goals for areas scoring below 7/10. You can retake this assessment 
              at any time to track your progress.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
