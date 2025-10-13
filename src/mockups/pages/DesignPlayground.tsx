import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Palette, Type, Layout, Zap, Moon, Sun, Heart } from "lucide-react";

const DesignPlayground = () => {
  const [theme, setTheme] = useState("default");
  const [primaryColor, setPrimaryColor] = useState("#0066cc");
  const [fontSize, setFontSize] = useState("medium");

  const themes = {
    default: {
      background: "bg-background",
      card: "bg-card",
      text: "text-foreground",
      accent: "text-primary"
    },
    dark: {
      background: "bg-gray-900",
      card: "bg-gray-800", 
      text: "text-gray-100",
      accent: "text-blue-400"
    },
    warm: {
      background: "bg-orange-50",
      card: "bg-white",
      text: "text-orange-900",
      accent: "text-orange-600"
    }
  };

  const fontSizes = {
    small: "text-sm",
    medium: "text-base", 
    large: "text-lg"
  };

  const currentTheme = themes[theme as keyof typeof themes];

  return (
    <div className={`min-h-screen transition-colors ${currentTheme.background}`}>
      {/* Header */}
      <div className={`border-b sticky top-0 z-10 backdrop-blur-sm ${currentTheme.card}`}>
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/mockups">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Hub
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className={`text-2xl font-bold ${currentTheme.text}`}>
                  Design System Playground
                </h1>
                <p className="text-sm text-muted-foreground">Test components, colors, and layouts</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Playground
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="components" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components" className="gap-2">
              <Layout className="w-4 h-4" />
              Components
            </TabsTrigger>
            <TabsTrigger value="colors" className="gap-2">
              <Palette className="w-4 h-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="gap-2">
              <Type className="w-4 h-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="interactions" className="gap-2">
              <Zap className="w-4 h-4" />
              Interactions
            </TabsTrigger>
          </TabsList>

          {/* Theme Controls */}
          <Card className={currentTheme.card}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${currentTheme.text}`}>
                <Palette className="w-5 h-5" />
                Theme Controls
              </CardTitle>
              <CardDescription>Experiment with different themes and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${currentTheme.text}`}>Theme</label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={theme === "default" ? "default" : "outline"}
                      onClick={() => setTheme("default")}
                      className="gap-2"
                    >
                      <Sun className="w-3 h-3" />
                      Default
                    </Button>
                    <Button
                      size="sm"
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      className="gap-2"
                    >
                      <Moon className="w-3 h-3" />
                      Dark
                    </Button>
                    <Button
                      size="sm"
                      variant={theme === "warm" ? "default" : "outline"}
                      onClick={() => setTheme("warm")}
                      className="gap-2"
                    >
                      <Heart className="w-3 h-3" />
                      Warm
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${currentTheme.text}`}>Font Size</label>
                  <div className="flex gap-2">
                    {Object.keys(fontSizes).map((size) => (
                      <Button
                        key={size}
                        size="sm"
                        variant={fontSize === size ? "default" : "outline"}
                        onClick={() => setFontSize(size)}
                        className="capitalize"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cards */}
              <Card className={currentTheme.card}>
                <CardHeader>
                  <CardTitle className={currentTheme.text}>Sample Cards</CardTitle>
                  <CardDescription>Testing card components with different content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className={`${fontSizes[fontSize as keyof typeof fontSizes]} ${currentTheme.text}`}>
                        The Habit of Relationship
                      </CardTitle>
                      <CardDescription>Building intimacy with God through daily practice</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={75} className="mb-2" />
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>75%</span>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Buttons */}
              <Card className={currentTheme.card}>
                <CardHeader>
                  <CardTitle className={currentTheme.text}>Buttons & Actions</CardTitle>
                  <CardDescription>Various button states and variants</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button>Primary Action</Button>
                    <Button variant="outline">Secondary</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">Small</Button>
                    <Button>Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button disabled>Disabled</Button>
                    <Button className="gap-2">
                      <Heart className="w-4 h-4" />
                      With Icon
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Form Elements */}
              <Card className={currentTheme.card}>
                <CardHeader>
                  <CardTitle className={currentTheme.text}>Form Elements</CardTitle>
                  <CardDescription>Input fields and form components</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${currentTheme.text}`}>Name</label>
                    <Input placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${currentTheme.text}`}>Reflection</label>
                    <Textarea placeholder="Share your thoughts..." />
                  </div>
                </CardContent>
              </Card>

              {/* Badges & Status */}
              <Card className={currentTheme.card}>
                <CardHeader>
                  <CardTitle className={currentTheme.text}>Badges & Status</CardTitle>
                  <CardDescription>Different badge variants and states</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                    <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-6">
            <Card className={currentTheme.card}>
              <CardHeader>
                <CardTitle className={currentTheme.text}>Color Palette</CardTitle>
                <CardDescription>Current theme colors and variants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Primary", class: "bg-primary", text: "text-primary-foreground" },
                    { name: "Secondary", class: "bg-secondary", text: "text-secondary-foreground" },
                    { name: "Accent", class: "bg-accent", text: "text-accent-foreground" },
                    { name: "Muted", class: "bg-muted", text: "text-muted-foreground" },
                    { name: "Success", class: "bg-green-500", text: "text-white" },
                    { name: "Warning", class: "bg-yellow-500", text: "text-white" },
                    { name: "Error", class: "bg-red-500", text: "text-white" },
                    { name: "Info", class: "bg-blue-500", text: "text-white" },
                  ].map((color) => (
                    <div key={color.name} className={`p-4 rounded-lg ${color.class}`}>
                      <span className={`font-medium ${color.text}`}>{color.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <Card className={currentTheme.card}>
              <CardHeader>
                <CardTitle className={currentTheme.text}>Typography Scale</CardTitle>
                <CardDescription>Font sizes, weights, and text styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={`space-y-4 ${fontSizes[fontSize as keyof typeof fontSizes]}`}>
                  <h1 className={`text-4xl font-bold ${currentTheme.text}`}>Heading 1</h1>
                  <h2 className={`text-3xl font-semibold ${currentTheme.text}`}>Heading 2</h2>
                  <h3 className={`text-2xl font-medium ${currentTheme.text}`}>Heading 3</h3>
                  <h4 className={`text-xl font-medium ${currentTheme.text}`}>Heading 4</h4>
                  <p className={`${currentTheme.text}`}>
                    This is regular body text. It should be comfortable to read and have good contrast
                    against the background. The spiritual life is not a life before, after, or beyond 
                    our everyday existence.
                  </p>
                  <p className="text-muted-foreground">
                    This is muted text, typically used for secondary information, descriptions,
                    or less important content.
                  </p>
                  <blockquote className={`border-l-4 border-primary pl-4 italic ${currentTheme.text}`}>
                    "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
                    <footer className="text-sm text-muted-foreground mt-2">— Aristotle</footer>
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-6">
            <Card className={currentTheme.card}>
              <CardHeader>
                <CardTitle className={currentTheme.text}>Interactive Elements</CardTitle>
                <CardDescription>Hover states, animations, and micro-interactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className={`font-semibold ${currentTheme.text}`}>Hover for Shadow</h3>
                      <p className="text-sm text-muted-foreground">Card with hover shadow effect</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:scale-105 transition-transform duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className={`font-semibold ${currentTheme.text}`}>Hover to Scale</h3>
                      <p className="text-sm text-muted-foreground">Card with hover scale effect</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DesignPlayground;