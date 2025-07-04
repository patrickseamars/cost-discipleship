import { Book, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: "devotional" | "habits";
  onTabChange: (tab: "devotional" | "habits") => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex">
        <button
          onClick={() => onTabChange("devotional")}
          className={cn(
            "flex-1 flex flex-col items-center py-3 px-4 transition-colors",
            activeTab === "devotional"
              ? "text-primary bg-secondary/20"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Book className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Devotional</span>
        </button>
        
        <button
          onClick={() => onTabChange("habits")}
          className={cn(
            "flex-1 flex flex-col items-center py-3 px-4 transition-colors",
            activeTab === "habits"
              ? "text-primary bg-secondary/20"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Target className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Habits</span>
        </button>
      </div>
    </div>
  );
};