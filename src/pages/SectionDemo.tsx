import { useEffect, useState } from "react";
import { SectionNavigation } from "@/components/SectionNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Book } from "lucide-react";

const SECTIONS = [
  { key: "relationship", name: "Relationship", number: 1 },
  { key: "rhythm", name: "Rhythm", number: 2 },
  { key: "reconciliation", name: "Reconciliation", number: 3 },
  { key: "radiance", name: "Radiance", number: 4 },
  { key: "response", name: "Response", number: 5 },
  { key: "resistance", name: "Resistance", number: 6 },
  { key: "resources", name: "Resources", number: 7 },
  { key: "refuel", name: "Refuel", number: 8 },
  { key: "replication", name: "Replication", number: 9 },
];

const SectionDemo = () => {
  const [selectedSection, setSelectedSection] = useState<string>("relationship");
  const [overviewData, setOverviewData] = useState(null);
  const [exerciseData, setExerciseData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadSectionData = async (sectionKey: string) => {
    setLoading(true);
    try {
      // Get the base path for API calls
      const basePath = import.meta.env.PROD ? '/cost-discipleship' : '';
      
      // Load overview data
      const overviewResponse = await fetch(`${basePath}/src/data/section-overviews.json`);
      const overviewJson = await overviewResponse.json();
      setOverviewData(overviewJson.sections[sectionKey]);

      // Load exercise data  
      const exerciseResponse = await fetch(`${basePath}/src/data/daily-exercises.json`);
      const exerciseJson = await exerciseResponse.json();
      setExerciseData(exerciseJson.sections[sectionKey]);

      // Load summary data
      const summaryResponse = await fetch(`${basePath}/src/data/section-summaries.json`);
      const summaryJson = await summaryResponse.json();
      setSummaryData(summaryJson.sections[sectionKey]);

    } catch (error) {
      console.error('Error loading section data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSectionData(selectedSection);
  }, [selectedSection]);

  if (!selectedSection) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="cost-logo-container">
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="text-content">CO</div>
              <div className="text-content">ST</div>
            </div>
            <h1 className="text-3xl font-bold text-primary">COST Training Sections</h1>
            <p className="text-muted-foreground">
              Select a section to explore the overview, daily exercises, and summary
            </p>
          </div>

          {/* Section Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((section) => (
              <Card 
                key={section.key} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedSection(section.key)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Section {section.number}</Badge>
                    <Book className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg">The Habit of {section.name}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading section data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back to sections button */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20 border-b">
        <div className="max-w-4xl mx-auto p-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedSection("")}
            className="mb-2"
          >
            ← Back to All Sections
          </Button>
          
          {/* Section selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {SECTIONS.map((section) => (
              <Button
                key={section.key}
                variant={selectedSection === section.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSection(section.key)}
                className="whitespace-nowrap"
              >
                {section.number}. {section.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <SectionNavigation
        sectionKey={selectedSection}
        overviewData={overviewData}
        exerciseData={exerciseData}
        summaryData={summaryData}
      />
    </div>
  );
};

export default SectionDemo;
