import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Book, Users, MessageSquare, Lightbulb, Heart, Target, Quote, Activity } from "lucide-react";

interface SectionOverviewProps {
  section: {
    section_number: number;
    title: string;
    core_habit: string;
    overview?: string;
    implementation?: string;
    holistic_principle?: string;
    church_context?: string;
    radical_community?: string;
    cultural_statistics?: string;
    spirit_compulsion?: string;
    practical_approach?: string;
    gospel_response?: string;
    real_difference?: string;
    stott_quote?: string;
    spiritual_resistance?: string;
    cost_of_discipleship?: string;
    accountability_necessity?: string;
    stewardship_mindset?: string;
    soap_method?: {
      description: string;
      S: string;
      O: string;
      A: string;
      P: string;
    };
    health_circles?: {
      description: string;
      mental: string;
      emotional: string;
      physical: string;
      spiritual: string;
    };
    giving_principles?: {
      priority_giving: string;
      percentage_giving: string;
      progressive_giving: string;
    };
    meeting: {
      title: string;
      scripture: string;
      introduction: string;
      key_concepts: string[];
      discussion_points: string[];
    };
  };
}

export const SectionOverview = ({ section }: SectionOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-lg px-4 py-2">
          Section {section.section_number}
        </Badge>
        <h1 className="text-2xl font-bold text-primary">{section.title}</h1>
        <p className="text-muted-foreground italic text-center max-w-2xl mx-auto">{section.core_habit}</p>
      </div>

      {/* Section Overview */}
      {section.overview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Section Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{section.overview}</p>
          </CardContent>
        </Card>
      )}

      {/* Implementation */}
      {section.implementation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{section.implementation}</p>
          </CardContent>
        </Card>
      )}

      {/* Holistic Principle */}
      {section.holistic_principle && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">{section.holistic_principle}</p>
          </CardContent>
        </Card>
      )}

      {/* Church Context */}
      {section.church_context && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">{section.church_context}</p>
          </CardContent>
        </Card>
      )}

      {/* Radical Community */}
      {section.radical_community && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">{section.radical_community}</p>
          </CardContent>
        </Card>
      )}

      {/* Cultural Statistics */}
      {section.cultural_statistics && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">{section.cultural_statistics}</p>
          </CardContent>
        </Card>
      )}

      {/* Spirit Compulsion */}
      {section.spirit_compulsion && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">{section.spirit_compulsion}</p>
          </CardContent>
        </Card>
      )}

      {/* Practical Approach */}
      {section.practical_approach && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">{section.practical_approach}</p>
          </CardContent>
        </Card>
      )}

      {/* Gospel Response */}
      {section.gospel_response && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">{section.gospel_response}</p>
          </CardContent>
        </Card>
      )}

      {/* Real Difference */}
      {section.real_difference && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">{section.real_difference}</p>
          </CardContent>
        </Card>
      )}

      {/* Quotes */}
      {section.stott_quote && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote className="w-5 h-5 text-primary" />
              John Stott
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed italic">{section.stott_quote}</p>
          </CardContent>
        </Card>
      )}

      {/* Spiritual Resistance */}
      {section.spiritual_resistance && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">{section.spiritual_resistance}</p>
          </CardContent>
        </Card>
      )}

      {/* Cost of Discipleship */}
      {section.cost_of_discipleship && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">{section.cost_of_discipleship}</p>
          </CardContent>
        </Card>
      )}

      {/* Accountability Necessity */}
      {section.accountability_necessity && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">{section.accountability_necessity}</p>
          </CardContent>
        </Card>
      )}

      {/* Stewardship Mindset */}
      {section.stewardship_mindset && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">{section.stewardship_mindset}</p>
          </CardContent>
        </Card>
      )}

      {/* S.O.A.P. Method */}
      {section.soap_method && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5 text-primary" />
              S.O.A.P. Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">{section.soap_method.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-primary/5 p-3 rounded-lg">
                <p className="font-semibold text-sm text-primary mb-1">S - Scripture</p>
                <p className="text-xs text-muted-foreground">{section.soap_method.S}</p>
              </div>
              <div className="bg-primary/5 p-3 rounded-lg">
                <p className="font-semibold text-sm text-primary mb-1">O - Observe</p>
                <p className="text-xs text-muted-foreground">{section.soap_method.O}</p>
              </div>
              <div className="bg-primary/5 p-3 rounded-lg">
                <p className="font-semibold text-sm text-primary mb-1">A - Apply</p>
                <p className="text-xs text-muted-foreground">{section.soap_method.A}</p>
              </div>
              <div className="bg-primary/5 p-3 rounded-lg">
                <p className="font-semibold text-sm text-primary mb-1">P - Pray</p>
                <p className="text-xs text-muted-foreground">{section.soap_method.P}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Circles */}
      {section.health_circles && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              {section.health_circles.description}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img 
                src="/circlesOfHealth.png" 
                alt="3 Circles of Health - Mental, Emotional, Physical, and Spiritual"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
            <div className="mt-4 space-y-2 text-center">
              <p className="text-xs text-muted-foreground">{section.health_circles.mental}</p>
              <p className="text-xs text-muted-foreground">{section.health_circles.emotional}</p>
              <p className="text-xs text-muted-foreground">{section.health_circles.physical}</p>
              <p className="text-xs text-muted-foreground">{section.health_circles.spiritual}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Giving Principles */}
      {section.giving_principles && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Giving Principles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-sm leading-relaxed">{section.giving_principles.priority_giving}</p>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-sm leading-relaxed">{section.giving_principles.percentage_giving}</p>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-sm leading-relaxed">{section.giving_principles.progressive_giving}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator className="my-8" />

      {/* Meeting Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Group Meeting: {section.meeting.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scripture Reference */}
          <div className="flex items-start gap-2">
            <Book className="w-4 h-4 text-primary mt-1 shrink-0" />
            <div>
              <p className="font-semibold text-sm text-primary">Scripture Reading:</p>
              <p className="text-sm text-muted-foreground">{section.meeting.scripture}</p>
            </div>
          </div>

          {/* Introduction */}
          <div>
            <p className="text-sm leading-relaxed">{section.meeting.introduction}</p>
          </div>

          <Separator />

          {/* Key Concepts */}
          <div>
            <h3 className="font-semibold text-sm mb-2 text-primary">Key Concepts:</h3>
            <ul className="space-y-1">
              {section.meeting.key_concepts.map((concept, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                  {concept}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Discussion Points */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-primary flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Discussion Questions:
            </h3>
            <div className="space-y-2">
              {section.meeting.discussion_points.map((question, index) => (
                <div key={index} className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm">{question}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
