import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Book, HelpCircle, Quote, CheckSquare, Star, Save } from "lucide-react";
import { InteractiveAssessment } from "./InteractiveAssessment";
import { CompletedAssessment } from "./CompletedAssessment";
import { assessmentStorage } from "@/lib/assessmentStorage";
import { useToast } from "@/hooks/use-toast";

interface DailyExerciseProps {
  exercise: {
    day: number;
    title: string;
    type: string;
    scripture?: string;
    content?: string;
    questions?: string[];
    evaluation_items?: string[];
    reflection_prompts?: string[];
    quotes?: { text: string; author: string }[];
    action_items?: any[];
    exercises?: any[];
  };
  sectionTitle: string;
  sectionKey?: string;
}

export const DailyExercise = ({ exercise, sectionTitle, sectionKey }: DailyExerciseProps) => {
  const { toast } = useToast();
  
  // State for reflection answers and question answers
  const [reflectionAnswers, setReflectionAnswers] = useState<{ [key: number]: string }>({});
  const [questionAnswers, setQuestionAnswers] = useState<{ [key: number]: string }>({});
  
  // Load saved reflections and questions on component mount
  useEffect(() => {
    // Clear all state first when switching exercises/days
    setReflectionAnswers({});
    setQuestionAnswers({});
    
    if (sectionKey) {
      // Load reflection prompts (for assessments)
      if (exercise.reflection_prompts && exercise.reflection_prompts.length > 0) {
        const storageKey = `reflections_${sectionKey}_day${exercise.day}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            const parsedAnswers = JSON.parse(saved);
            setReflectionAnswers(parsedAnswers);
          } catch (error) {
            console.error('Error loading saved reflections:', error);
          }
        }
      }
      
      // Load regular questions
      if (exercise.questions && exercise.questions.length > 0) {
        const storageKey = `questions_${sectionKey}_day${exercise.day}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            const parsedAnswers = JSON.parse(saved);
            setQuestionAnswers(parsedAnswers);
          } catch (error) {
            console.error('Error loading saved questions:', error);
          }
        }
      }
    }
  }, [sectionKey, exercise.day, exercise.reflection_prompts, exercise.questions]);
  
  // Handle reflection input changes
  const handleReflectionChange = (index: number, value: string) => {
    setReflectionAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };
  
  // Handle question input changes
  const handleQuestionChange = (index: number, value: string) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };
  
  // Save reflection answers
  const saveReflections = () => {
    if (Object.keys(reflectionAnswers).length > 0) {
      const storageKey = `reflections_${sectionKey}_day${exercise.day}`;
      localStorage.setItem(storageKey, JSON.stringify(reflectionAnswers));
      
      toast({
        title: "Reflections Saved! ✍️",
        description: "Your reflection responses have been saved.",
      });
    }
  };
  
  // Save question answers
  const saveQuestions = () => {
    if (Object.keys(questionAnswers).length > 0) {
      const storageKey = `questions_${sectionKey}_day${exercise.day}`;
      localStorage.setItem(storageKey, JSON.stringify(questionAnswers));
      
      toast({
        title: "Answers Saved! ✍️",
        description: "Your question responses have been saved.",
      });
    }
  };

  // Handle assessment type with dedicated component
  if (exercise.type === 'assessment' && exercise.evaluation_items && exercise.reflection_prompts) {
    // Check if initial assessment has already been completed
    const existingAssessment = sectionKey ? assessmentStorage.getAssessment(sectionKey, 'initial') : null;
    
    if (existingAssessment) {
      // Show completed assessment with option to retake
      return (
        <CompletedAssessment
          assessment={existingAssessment}
          title={exercise.title}
          sectionTitle={sectionTitle}
          evaluationItems={exercise.evaluation_items}
          reflectionPrompts={exercise.reflection_prompts}
          onComplete={(results) => {
            if (sectionKey) {
              // Save as initial assessment (this is a retake)
              assessmentStorage.saveAssessment(
                sectionKey,
                sectionTitle,
                'initial',
                results,
                exercise.evaluation_items!
              );

              toast({
                title: "Assessment Updated! 📊",
                description: "Your assessment has been updated. You can view your results above.",
              });
              
              // Force a re-render by updating the page
              window.location.reload();
            }
          }}
        />
      );
    } else {
      // Show interactive assessment for first time
      return (
        <InteractiveAssessment
          title={exercise.title}
          sectionTitle={sectionTitle}
          evaluationItems={exercise.evaluation_items}
          reflectionPrompts={exercise.reflection_prompts}
          onComplete={(results) => {
            if (sectionKey) {
              // Save as initial assessment
              assessmentStorage.saveAssessment(
                sectionKey,
                sectionTitle,
                'initial',
                results,
                exercise.evaluation_items!
              );

              toast({
                title: "Assessment Saved! 📊",
                description: "Your initial assessment has been saved. Complete the week to see your progress!",
              });
              
              // Force a re-render to show completed state
              window.location.reload();
            }
          }}
        />
      );
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assessment':
        return <CheckSquare className="w-4 h-4 text-primary" />;
      case 'scripture_study':
        return <Book className="w-4 h-4 text-primary" />;
      case 'practical_exercise':
        return <Star className="w-4 h-4 text-primary" />;
      default:
        return <Book className="w-4 h-4 text-primary" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'assessment':
        return 'Self-Assessment';
      case 'scripture_study':
        return 'Scripture Study';
      case 'practical_exercise':
        return 'Practical Exercise';
      default:
        return 'Exercise';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-lg px-4 py-2">
          Day {exercise.day}
        </Badge>
        <h1 className="text-2xl font-bold text-primary">{exercise.title}</h1>
        <p className="text-sm text-muted-foreground">{sectionTitle}</p>
        <div className="flex items-center justify-center gap-2">
          {getTypeIcon(exercise.type)}
          <span className="text-sm font-medium text-primary">{getTypeLabel(exercise.type)}</span>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Scripture Reference */}
          {exercise.scripture && (
            <div className="flex items-start gap-2">
              <Book className="w-4 h-4 text-primary mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-sm text-primary">Scripture Reading:</p>
                <p className="text-sm text-muted-foreground">{exercise.scripture}</p>
              </div>
            </div>
          )}

          {/* Content/Instructions */}
          {exercise.content && (
            <div>
              <p className="text-sm">{exercise.content}</p>
            </div>
          )}

          {/* Evaluation Items (for assessments) */}
          {exercise.evaluation_items && exercise.evaluation_items.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Rate yourself on a scale of 1-10:</h3>
                <div className="space-y-2">
                  {exercise.evaluation_items.map((item, index) => (
                    <div key={index} className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm mb-2">{item}</p>
                      <div className="flex gap-1">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div
                            key={i + 1}
                            className="w-6 h-6 border border-muted-foreground/30 rounded text-xs flex items-center justify-center hover:bg-primary/10 cursor-pointer"
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Questions */}
          {exercise.questions && exercise.questions.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Reflection Questions:
                  </h3>
                  {Object.keys(questionAnswers).length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={saveQuestions}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Answers
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  {exercise.questions.map((question, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-sm font-medium text-foreground">{question}</p>
                      <Textarea
                        placeholder="Write your answer here..."
                        value={questionAnswers[index] || ''}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                  ))}
                </div>
                {Object.keys(questionAnswers).length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      onClick={saveQuestions}
                      className="w-full flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save All Answers
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Reflection Prompts (for assessments) */}
          {exercise.reflection_prompts && exercise.reflection_prompts.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-primary">Reflection Questions:</h3>
                  {Object.keys(reflectionAnswers).length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={saveReflections}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Reflections
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  {exercise.reflection_prompts.map((prompt, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-sm font-medium text-foreground">{prompt}</p>
                      <Textarea
                        placeholder="Write your reflection here..."
                        value={reflectionAnswers[index] || ''}
                        onChange={(e) => handleReflectionChange(index, e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                  ))}
                </div>
                {Object.keys(reflectionAnswers).length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      onClick={saveReflections}
                      className="w-full flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save All Reflections
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Quotes */}
          {exercise.quotes && exercise.quotes.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary flex items-center gap-2">
                  <Quote className="w-4 h-4" />
                  Inspiring Quotes:
                </h3>
                <div className="space-y-3">
                  {exercise.quotes.map((quote, index) => (
                    <div key={index} className="border-l-4 border-primary/20 pl-4">
                      <p className="text-sm italic mb-1">"{quote.text}"</p>
                      <p className="text-xs text-muted-foreground">— {quote.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Action Items */}
          {exercise.action_items && exercise.action_items.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Action Steps:</h3>
                <div className="space-y-3">
                  {exercise.action_items.map((item, index) => (
                    <div key={index} className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                      {item.title && <h4 className="font-semibold text-sm mb-2">{item.title}</h4>}
                      {item.prompt && <p className="text-sm mb-2">{item.prompt}</p>}
                      {item.instructions && <p className="text-sm mb-2">{item.instructions}</p>}
                      {item.elements && (
                        <ul className="space-y-1">
                          {item.elements.map((element: string, elemIndex: number) => (
                            <li key={elemIndex} className="text-sm flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                              {element}
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.prompts && (
                        <ul className="space-y-1">
                          {item.prompts.map((prompt: string, promptIndex: number) => (
                            <li key={promptIndex} className="text-sm text-muted-foreground">
                              {prompt}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Additional Exercises */}
          {exercise.exercises && exercise.exercises.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Additional Exercises:</h3>
                <div className="space-y-3">
                  {exercise.exercises.map((ex, index) => (
                    <div key={index} className="bg-muted/30 p-4 rounded-lg">
                      {ex.title && <h4 className="font-semibold text-sm mb-2">{ex.title}</h4>}
                      {ex.description && <p className="text-sm mb-2">{ex.description}</p>}
                      {ex.questions && (
                        <div className="space-y-2">
                          {ex.questions.map((question: string, qIndex: number) => (
                            <div key={qIndex} className="bg-background p-2 rounded text-sm">
                              {question}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
