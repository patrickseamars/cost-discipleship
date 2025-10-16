import { useState } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { DevotionalTab } from "@/components/daily/DevotionalTab";
import { HabitsTab } from "@/components/habits/HabitsTab";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
	const [activeTab, setActiveTab] = useState<"devotional" | "habits">(
		"devotional"
	);

	return (
		<div className="min-h-screen bg-background">
			{/* Header with COST Branding */}
			<div className="bg-primary text-primary-foreground py-6 px-4 text-center relative overflow-hidden">
				{/* Subtle layered background effect */}
				<div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary opacity-95"></div>

				<div className="relative z-10 flex flex-col items-center justify-center space-y-2">
					{/* COST Logo Typography */}
					<div className="cost-logo-container">
						<div className="corner top-right"></div>
						<div className="corner bottom-left"></div>
						<div className="text-content">CO</div>
						<div className="text-content">ST</div>
					</div>

					<h1 className="text-lg font-medium mb-1">Discipleship</h1>
					<p className="text-sm opacity-90 tracking-wide uppercase text-xs">
						Multiplying followers of Jesus for lasting impact
					</p>
					<div className="flex flex-col sm:flex-row gap-2 mt-3">
						<Link to="/app">
							<Button variant="secondary" size="sm">
								Explore Discipleship Sections
								<ArrowRight className="w-4 h-4 ml-1" />
							</Button>
						</Link>
					</div>
				</div>
			</div>

			{/* Tab Content */}
			<div className="max-w-md mx-auto">
				{activeTab === "devotional" && <DevotionalTab />}
				{activeTab === "habits" && <HabitsTab />}
			</div>

			{/* Bottom Navigation */}
			<BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
		</div>
	);
};

export default Index;
