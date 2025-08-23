import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Target, Lightbulb, User, BarChart3, Save, Edit3 } from "lucide-react";
import { identityStorage } from "@/lib/identityStorage";
import { useToast } from "@/hooks/use-toast";

interface SectionSummaryProps {
  summary: {
    id: number;
    title: string;
    core_habit: string;
    summary: {
      introduction: string;
      key_thoughts: string[];
      identity_statement: string;
      habit_tracker_items: string[];
      [key: string]: any; // For additional properties like areas_of_focus, service_framework, etc.
    };
  };
  sectionKey: string;
}

export const SectionSummary = ({ summary, sectionKey }: SectionSummaryProps) => {
  const { toast } = useToast();
  const [userInput, setUserInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [hasCustomInput, setHasCustomInput] = useState(false);
  
  // Load saved identity statement on mount
  useEffect(() => {
    const savedStatement = identityStorage.getIdentityStatement(sectionKey);
    if (savedStatement) {
      setUserInput(savedStatement);
      setHasCustomInput(true);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [sectionKey]);
  
  // Save identity statement
  const saveIdentityStatement = () => {
    if (userInput.trim()) {
      identityStorage.saveIdentityStatement(sectionKey, summary.title, userInput.trim());
      setHasCustomInput(true);
      setIsEditing(false);
      
      toast({
        title: "Identity Statement Saved! ✨",
        description: "Your personal identity statement has been saved.",
      });
    }
  };
  
  // Handle edit mode
  const enableEditing = () => {
    setIsEditing(true);
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };
  
  // Handle key press (save on Enter)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userInput.trim()) {
      saveIdentityStatement();
    }
  };
  
  // Parse identity statement to find the blank line
  const parseIdentityStatement = () => {
    const statement = summary.summary.identity_statement;
    const parts = statement.split('_______________');
    return {
      prefix: parts[0] || '',
      suffix: parts[1] || '.'
    };
  };
  
  const { prefix, suffix } = parseIdentityStatement();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-lg px-4 py-2">
          Section {summary.id} Summary
        </Badge>
        <h1 className="text-2xl font-bold text-primary">{summary.title}</h1>
        <p className="text-muted-foreground italic">{summary.core_habit}</p>
      </div>

      {/* Introduction */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm">{summary.summary.introduction}</p>
        </CardContent>
      </Card>

      {/* Key Thoughts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Key Thoughts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {summary.summary.key_thoughts.map((thought, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm">{thought}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Identity Statement */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Identity Statement
            </CardTitle>
            {hasCustomInput && !isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={enableEditing}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm font-medium">{prefix}</span>
                  <Input
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="your identity..."
                    className="flex-1 min-w-[200px] font-medium"
                    autoFocus
                  />
                  <span className="text-sm font-medium">{suffix}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={saveIdentityStatement}
                    disabled={!userInput.trim()}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  {hasCustomInput && (
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        // Restore previous input if canceling
                        const savedStatement = identityStorage.getIdentityStatement(sectionKey);
                        if (savedStatement) {
                          setUserInput(savedStatement);
                        }
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center flex-wrap gap-1">
                <span className="text-sm font-medium">{prefix}</span>
                <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {userInput || "_______________"}
                </span>
                <span className="text-sm font-medium">{suffix}</span>
              </div>
            )}
          </div>
          
          {!hasCustomInput && (
            <div className="mt-3 text-center">
              <p className="text-xs text-muted-foreground">
                Fill in the blank to create your personal identity statement
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Framework Information */}
      {summary.summary.areas_of_focus && (
        <Card>
          <CardHeader>
            <CardTitle>Areas of Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.summary.areas_of_focus.map((area: any, index: number) => (
                <div key={index} className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">{area.area}</h4>
                  <ul className="space-y-1">
                    {area.practices.map((practice: string, practiceIndex: number) => (
                      <li key={practiceIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                        {practice}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Framework */}
      {summary.summary.service_framework && (
        <Card>
          <CardHeader>
            <CardTitle>Service Framework</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.summary.service_framework.map((principle: any, index: number) => (
                <div key={index} className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">{principle.principle}</h4>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stewardship Framework */}
      {summary.summary.stewardship_framework && (
        <Card>
          <CardHeader>
            <CardTitle>Stewardship Framework</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.summary.stewardship_framework.map((principle: any, index: number) => (
                <div key={index} className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">{principle.principle}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{principle.description}</p>
                  <p className="text-sm italic">{principle.practice}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sabbath Framework */}
      {summary.summary.sabbath_framework && (
        <Card>
          <CardHeader>
            <CardTitle>Sabbath Framework</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.summary.sabbath_framework.map((element: any, index: number) => (
                <div key={index} className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">{element.element}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{element.description}</p>
                  <ul className="space-y-1">
                    {element.practices.map((practice: string, practiceIndex: number) => (
                      <li key={practiceIndex} className="text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                        {practice}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discipleship Relationships */}
      {summary.summary.discipleship_relationships && (
        <Card>
          <CardHeader>
            <CardTitle>Discipleship Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.summary.discipleship_relationships.map((relationship: any, index: number) => (
                <div key={index} className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">{relationship.role}</h4>
                  <p className="text-sm text-muted-foreground mb-1">{relationship.description}</p>
                  <p className="text-sm italic">{relationship.purpose}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Habit Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Habit Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {summary.summary.habit_tracker_items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                <div className="w-4 h-4 border border-muted-foreground/30 rounded-sm" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
