import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Palette, Layout, Sparkles, Home, Settings } from "lucide-react";

const MockupHub = () => {
  const variants = [
    {
      id: "layout-v1",
      title: "Layout Variant 1",
      description: "Modern card-based layout with enhanced visual hierarchy",
      status: "active",
      path: "/mockups/layout-v1",
      icon: Layout,
      color: "bg-blue-500"
    },
    {
      id: "layout-v2", 
      title: "Layout Variant 2",
      description: "Minimalist Medium/GitBook style with sidebar navigation",
      status: "active",
      path: "/mockups/layout-v2", 
      icon: Layout,
      color: "bg-green-500"
    },
    {
      id: "layout-v2-enhanced", 
      title: "Layout V2 - Full Featured",
      description: "Complete implementation with all features for Relationship & Rhythm sections",
      status: "active",
      path: "/mockups/layout-v2-enhanced", 
      icon: Layout,
      color: "bg-emerald-600"
    },
    {
      id: "color-v1",
      title: "Color Scheme A",
      description: "Warm earth tones for a welcoming, spiritual feel",
      status: "active",
      path: "/mockups/color-v1",
      icon: Palette,
      color: "bg-orange-500"
    },
    {
      id: "color-v2",
      title: "Color Scheme B", 
      description: "Cool blues and grays for modern, professional look",
      status: "draft",
      path: "/mockups/color-v2",
      icon: Palette,
      color: "bg-purple-500"
    },
    {
      id: "interactive-v1",
      title: "Enhanced Interactions",
      description: "Micro-animations and improved user feedback",
      status: "concept",
      path: "/mockups/interactive-v1",
      icon: Sparkles,
      color: "bg-pink-500"
    },
    {
      id: "mobile-v1",
      title: "Mobile-First Design",
      description: "Optimized mobile experience with gesture controls",
      status: "concept", 
      path: "/mockups/mobile-v1",
      icon: Settings,
      color: "bg-indigo-500"
    },
    {
      id: "playground",
      title: "Design System Playground",
      description: "Interactive component and theme testing environment",
      status: "active",
      path: "/mockups/playground",
      icon: Sparkles,
      color: "bg-purple-500"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800"; 
      case "concept": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">UI/UX Mockup Hub</h1>
              <p className="text-muted-foreground">
                Experiment with different designs without affecting the main application
              </p>
            </div>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                Back to Main App
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Original App Reference */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Application</h2>
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Production Version
                  </CardTitle>
                  <CardDescription>
                    The current live version of the COST Discipleship platform
                  </CardDescription>
                </div>
                <Badge className="bg-primary text-primary-foreground">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Link to="/">
                  <Button variant="default">
                    View Main App
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/sections">
                  <Button variant="outline">
                    View Sections
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mockup Variants */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Design Variants & Mockups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {variants.map((variant) => {
              const IconComponent = variant.icon;
              return (
                <Card key={variant.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${variant.color} text-white`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{variant.title}</CardTitle>
                        </div>
                      </div>
                      <Badge className={getStatusColor(variant.status)}>
                        {variant.status}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2">
                      {variant.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={variant.path}>
                      <Button 
                        className="w-full" 
                        variant={variant.status === "active" ? "default" : "outline"}
                        disabled={variant.status === "concept"}
                      >
                        {variant.status === "concept" ? "Coming Soon" : "View Mockup"}
                        {variant.status !== "concept" && (
                          <ArrowRight className="w-4 h-4 ml-1" />
                        )}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-3">How to Use This Mockup System</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Active</strong> mockups are ready to view and interact with</p>
            <p>• <strong>Draft</strong> mockups are work in progress but viewable</p>
            <p>• <strong>Concept</strong> mockups are planned but not yet implemented</p>
            <p>• Use the "Back to Main App" button to return to the production version</p>
            <p>• Each mockup preserves your data and doesn't affect the main application</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockupHub;