import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Book, Users, MessageSquare } from "lucide-react";

interface SectionOverviewProps {
  section: {
    section_number: number;
    title: string;
    core_habit: string;
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
        <p className="text-muted-foreground italic">{section.core_habit}</p>
      </div>

      {/* Meeting Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {section.meeting.title}
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
            <p className="text-sm">{section.meeting.introduction}</p>
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
