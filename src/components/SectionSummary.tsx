import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Target, Lightbulb, User, BarChart3 } from "lucide-react";

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
}

export const SectionSummary = ({ summary }: SectionSummaryProps) => {
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
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Identity Statement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
            <p className="text-sm font-medium">{summary.summary.identity_statement}</p>
          </div>
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
