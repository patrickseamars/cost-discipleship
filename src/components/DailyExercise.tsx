import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Book, HelpCircle, Quote, CheckSquare, Star } from "lucide-react";

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
}

export const DailyExercise = ({ exercise, sectionTitle }: DailyExerciseProps) => {
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
                <h3 className="font-semibold text-sm mb-3 text-primary flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Reflection Questions:
                </h3>
                <div className="space-y-2">
                  {exercise.questions.map((question, index) => (
                    <div key={index} className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm">{question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Reflection Prompts (for assessments) */}
          {exercise.reflection_prompts && exercise.reflection_prompts.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Reflection:</h3>
                <div className="space-y-2">
                  {exercise.reflection_prompts.map((prompt, index) => (
                    <div key={index} className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm">{prompt}</p>
                    </div>
                  ))}
                </div>
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
