import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export const HabitsTab = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [reflection, setReflection] = useState("");

  const evaluationQuestions = [
    "I devote an hour every morning to seeking God.",
    "I practically apply the Bible weekly.",
    "I enjoy and look forward to prayer.",
    "I sense the love of God towards me throughout the day.",
    "I am growing in my knowledge of Scripture.",
    "I am growing in my love for God.",
    "I approach my time with God each day with a sense of expectation."
  ];

  return (
    <div className="pb-20 px-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-6 pb-4">
        <h1 className="text-2xl font-bold text-primary mb-2">Daily Check-in</h1>
        <h2 className="text-lg text-foreground">Day 1: Relationship Evaluation</h2>
      </div>

      {/* Habit Completion */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary">Today's Habit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="habit-complete"
              checked={isCompleted}
              onCheckedChange={(checked) => setIsCompleted(checked === true)}
            />
            <label
              htmlFor="habit-complete"
              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                isCompleted ? "line-through text-muted-foreground" : "text-foreground"
              }`}
            >
              I spent intentional time alone with God today
            </label>
          </div>
          
          <div className="bg-secondary/20 p-4 rounded-lg">
            <p className="text-sm text-foreground">
              <strong>Goal:</strong> Spend the first hour of your morning alone with God
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Questions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary">Reflection Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Rate yourself on a scale of 1-10 for each area:
          </p>
          
          <div className="space-y-3">
            {evaluationQuestions.slice(0, 3).map((question, index) => (
              <div key={index} className="p-3 bg-secondary/10 rounded-lg">
                <p className="text-sm text-foreground mb-2">{question}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 (Poor)</span>
                  <span>10 (Excellent)</span>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full text-sm">
            See All Questions ({evaluationQuestions.length})
          </Button>
        </CardContent>
      </Card>

      {/* Journal */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary">Daily Reflection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            What stood out to you most today? Where do you need to grow?
          </p>
          
          <Textarea
            placeholder="Write your thoughts here..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="min-h-[100px]"
          />
          
          <Button className="w-full">
            Save Reflection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};