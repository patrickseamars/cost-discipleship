import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DevotionalTab } from "@/components/DevotionalTab";
import { HabitsTab } from "@/components/HabitsTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"devotional" | "habits">("devotional");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-4 px-4 text-center">
        <h1 className="text-xl font-bold">COST Discipleship</h1>
        <p className="text-sm opacity-90">Multiplying followers of Jesus for lasting impact</p>
      </div>

      {/* Tab Content */}
      <div className="max-w-md mx-auto">
        {activeTab === "devotional" && <DevotionalTab />}
        {activeTab === "habits" && <HabitsTab />}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

export default Index;
