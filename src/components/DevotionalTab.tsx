import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DevotionalTab = () => {
  return (
    <div className="pb-20 px-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-6 pb-4">
        <h1 className="text-2xl font-bold text-primary mb-2">Week 1</h1>
        <h2 className="text-lg text-foreground">The Habit of Relationship</h2>
      </div>

      {/* Today's Focus */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary">Today: Day 1</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Relationship Evaluation</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Take time to honestly evaluate your current relationship with God across key areas of spiritual growth.
            </p>
          </div>
          
          <div className="bg-secondary/20 p-4 rounded-lg">
            <h4 className="font-medium text-primary mb-2">Today's Scripture</h4>
            <p className="text-sm italic text-foreground">
              "...everything else is worthless when compared with the infinite value of knowing Christ Jesus my Lord."
            </p>
            <p className="text-xs text-muted-foreground mt-1">Philippians 3:8 NLT</p>
          </div>
        </CardContent>
      </Card>

      {/* Week Overview */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary">This Week's Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">
            This week we're focusing on developing a consistent morning time with God. 
            The habit of relationship is foundational to all spiritual growth.
          </p>
        </CardContent>
      </Card>

      {/* Daily Progress */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary">Week 1 Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div
                key={day}
                className={`aspect-square rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  day === 1
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Today is Day 1 of Week 1
          </div>
        </CardContent>
      </Card>
    </div>
  );
};