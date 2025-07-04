import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DevotionalTab } from "@/components/DevotionalTab";
import { HabitsTab } from "@/components/HabitsTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"devotional" | "habits">("devotional");

  return (
    <div className="min-h-screen bg-background">
      {/* Header with COST Branding */}
      <div className="bg-primary text-primary-foreground py-6 px-4 text-center relative overflow-hidden">
        {/* Subtle layered background effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary opacity-95"></div>
        
        <div className="relative z-10">
          {/* COST Logo Typography */}
          <div className="flex items-center justify-center mb-2">
            <div className="font-bold text-2xl tracking-wider">
              <span className="inline-block border-l-4 border-t-4 border-white pl-1 pt-1">C</span>
              <span className="inline-block border-t-4 border-white pt-1">O</span>
              <span className="inline-block border-t-4 border-r-4 border-white pt-1 pr-1">S</span>
              <span className="inline-block border-r-4 border-b-4 border-white pr-1 pb-1">T</span>
            </div>
          </div>
          
          <h1 className="text-lg font-medium mb-1">Discipleship</h1>
          <p className="text-sm opacity-90 tracking-wide uppercase text-xs">
            Multiplying followers of Jesus for lasting impact
          </p>
        </div>
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
