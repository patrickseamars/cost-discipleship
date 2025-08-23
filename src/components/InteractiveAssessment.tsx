import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckSquare, BarChart3, Target, TrendingUp, AlertCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface InteractiveAssessmentProps {
  title: string;
  sectionTitle: string;
  evaluationItems: string[];
  reflectionPrompts: string[];
  onComplete?: (results: AssessmentResults) => void;
}

export const InteractiveAssessment = ({
  title,
  sectionTitle,
  evaluationItems,
  reflectionPrompts,
  onComplete
}: InteractiveAssessmentProps) => {
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [reflectionAnswers, setReflectionAnswers] = useState<{ [key: number]: string }>({});

  const handleRatingChange = (itemIndex: number, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [itemIndex]: rating
    }));
  };

  const handleReflectionChange = (promptIndex: number, answer: string) => {
    setReflectionAnswers(prev => ({
      ...prev,
      [promptIndex]: answer
    }));
  };

  const calculateResults = (): AssessmentResults => {
    const ratedItems: AssessmentItem[] = evaluationItems.map((item, index) => ({
      text: item,
      rating: ratings[index] || 0
    }));

    const completedItems = Object.keys(ratings).length;
    const totalScore = Object.values(ratings).reduce((sum, rating) => sum + rating, 0);
    const maxPossibleScore = evaluationItems.length * 10;
    const averageScore = completedItems > 0 ? totalScore / completedItems : 0;
    const percentageScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

    // Sort items by rating for strongest/weakest analysis
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
      reflectionAnswers
    };
  };

  const results = calculateResults();
  const isRatingsComplete = results.completedItems === results.totalItems;
  const isReflectionsComplete = reflectionPrompts.length === 0 || 
    Object.keys(reflectionAnswers).filter(key => 
      reflectionAnswers[parseInt(key)]?.trim().length > 0
    ).length === reflectionPrompts.length;
  
  const isReadyToSubmit = isRatingsComplete && isReflectionsComplete;
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle manual submission
  const handleSubmit = () => {
    if (isReadyToSubmit && onComplete) {
      setIsSubmitted(true);
      onComplete(results);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 8) return "default";
    if (score >= 6) return "secondary";
    return "destructive";
  };

  const getOverallRating = (percentage: number) => {
    if (percentage >= 80) return { label: "Excellent", color: "text-green-600" };
    if (percentage >= 70) return { label: "Good", color: "text-blue-600" };
    if (percentage >= 60) return { label: "Fair", color: "text-yellow-600" };
    if (percentage >= 50) return { label: "Needs Improvement", color: "text-orange-600" };
    return { label: "Needs Significant Growth", color: "text-red-600" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-lg px-4 py-2">
          Assessment
        </Badge>
        <h1 className="text-2xl font-bold text-primary">{title}</h1>
        <p className="text-sm text-muted-foreground">{sectionTitle}</p>
        <div className="flex items-center justify-center gap-2">
          <CheckSquare className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Self-Assessment</span>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {results.completedItems} of {results.totalItems} completed
              </span>
            </div>
            <Progress 
              value={(results.completedItems / results.totalItems) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Assessment Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Rate Each Area (1-10 scale)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Rate each statement with 1 being "never true of me" and 10 being "always true of me"
          </p>
          
          <div className="space-y-4">
            {evaluationItems.map((item, index) => (
              <div key={index} className="bg-muted/50 p-4 rounded-lg space-y-3">
                <p className="text-sm font-medium">{item}</p>
                
                {/* Rating Buttons */}
                <div className="flex gap-1 flex-wrap">
                  {Array.from({ length: 10 }, (_, i) => {
                    const rating = i + 1;
                    const isSelected = ratings[index] === rating;
                    return (
                      <Button
                        key={rating}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className={`w-8 h-8 p-0 ${isSelected ? '' : 'hover:bg-primary/10'}`}
                        onClick={() => handleRatingChange(index, rating)}
                      >
                        {rating}
                      </Button>
                    );
                  })}
                </div>
                
                {/* Selected Rating Display */}
                {ratings[index] && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Your rating:</span>
                    <Badge 
                      variant={getScoreBadgeVariant(ratings[index])}
                      className="text-xs"
                    >
                      {ratings[index]}/10
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.completedItems > 0 && (
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

            {/* Completion Status */}
            {!isRatingsComplete && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Complete all ratings to see your full assessment results and reflection prompts.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reflection Section */}
      {isRatingsComplete && (
        <Card>
          <CardHeader>
            <CardTitle>Reflection Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reflectionPrompts.map((prompt, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium">{prompt}</label>
                <textarea
                  className="w-full p-3 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Write your reflection here..."
                  value={reflectionAnswers[index] || ''}
                  onChange={(e) => handleReflectionChange(index, e.target.value)}
                />
              </div>
            ))}
            
            {/* Submit Button */}
            {isReadyToSubmit && !isSubmitted && (
              <div className="text-center p-4 space-y-3">
                <p className="text-sm text-green-700">
                  ✓ All questions completed! Ready to submit your assessment.
                </p>
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Submit Assessment
                </Button>
              </div>
            )}
            
            {/* Progress Status */}
            {isRatingsComplete && !isReadyToSubmit && (
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-700">
                  Complete all reflection questions to submit your assessment.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Reflections completed: {Object.keys(reflectionAnswers).filter(key => 
                    reflectionAnswers[parseInt(key)]?.trim().length > 0
                  ).length} of {reflectionPrompts.length}
                </p>
              </div>
            )}
            
            {isSubmitted && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  ✓ Assessment Submitted Successfully! Your responses have been saved.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Items */}
      {isSubmitted && (
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <p className="text-sm">
                Based on your assessment, focus on your growth opportunities while maintaining your strengths. 
                Consider setting specific goals for areas scoring below 7/10.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
