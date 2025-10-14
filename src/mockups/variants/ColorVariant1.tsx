import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Sun, Leaf, Mountain } from "lucide-react";

const ColorVariant1 = () => {
	return (
		<div className="min-h-screen" style={{ backgroundColor: "#fefcf9" }}>
			{/* Custom CSS for warm theme */}
			<style>{`
        .warm-primary { background: linear-gradient(135deg, #8b4513, #d2691e); }
        .warm-secondary { background: linear-gradient(135deg, #daa520, #f4a460); }
        .warm-accent { background: linear-gradient(135deg, #cd853f, #deb887); }
        .warm-text-primary { color: #5d4e37; }
        .warm-text-secondary { color: #8b7355; }
        .warm-border { border-color: #d2b48c; }
        .warm-card-bg { background: linear-gradient(135deg, #fff8f0, #fef7ef); }
        .warm-muted-bg { background-color: #f5f0e8; }
      `}</style>

			{/* Header */}
			<div className="border-b warm-border bg-white/90 backdrop-blur-sm sticky top-0 z-10">
				<div className="max-w-6xl mx-auto p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link to="/mockups">
								<Button
									variant="ghost"
									size="sm"
									className="gap-2 warm-text-primary hover:warm-muted-bg"
								>
									<ArrowLeft className="w-4 h-4" />
									Back to Hub
								</Button>
							</Link>
							<div
								className="h-6 w-px"
								style={{ backgroundColor: "#d2b48c" }}
							/>
							<div>
								<h1 className="text-2xl font-bold warm-text-primary">
									COST Discipleship - Warm Tones
								</h1>
								<p className="text-sm warm-text-secondary">
									Earth-inspired spiritual journey
								</p>
							</div>
						</div>
						<Badge
							variant="outline"
							className="bg-orange-50 text-orange-700 border-orange-200"
						>
							Color Mockup
						</Badge>
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto p-6">
				{/* Hero Section */}
				<div className="mb-8">
					<Card className="border-0 overflow-hidden warm-card-bg shadow-lg">
						<div className="warm-primary text-white p-8 relative">
							<div className="absolute top-4 right-4 opacity-20">
								<Mountain className="w-16 h-16" />
							</div>
							<CardTitle className="text-3xl mb-3 font-serif">
								Welcome to Your Spiritual Journey
							</CardTitle>
							<CardDescription className="text-orange-100 text-lg">
								Walking the path of discipleship with warmth, wisdom, and
								community
							</CardDescription>
							<div className="mt-6 flex gap-4">
								<div className="flex items-center gap-2">
									<Sun className="w-5 h-5" />
									<span>Morning Devotions</span>
								</div>
								<div className="flex items-center gap-2">
									<Heart className="w-5 h-5" />
									<span>Community Love</span>
								</div>
								<div className="flex items-center gap-2">
									<Leaf className="w-5 h-5" />
									<span>Growing Faith</span>
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* COST Framework */}
				<div className="mb-8">
					<h2 className="text-2xl font-bold warm-text-primary mb-6 font-serif">
						The COST Framework
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<Card className="warm-card-bg border warm-border hover:shadow-md transition-shadow">
							<CardHeader className="text-center">
								<div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold warm-primary">
									C
								</div>
								<CardTitle className="warm-text-primary font-serif">
									Connect
								</CardTitle>
								<CardDescription className="warm-text-secondary">
									Build deep relationships with God and others
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="warm-card-bg border warm-border hover:shadow-md transition-shadow">
							<CardHeader className="text-center">
								<div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold warm-secondary">
									O
								</div>
								<CardTitle className="warm-text-primary font-serif">
									Obey
								</CardTitle>
								<CardDescription className="warm-text-secondary">
									Love through time, talent, and treasure
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="warm-card-bg border warm-border hover:shadow-md transition-shadow">
							<CardHeader className="text-center">
								<div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold warm-accent">
									S
								</div>
								<CardTitle className="warm-text-primary font-serif">
									Share
								</CardTitle>
								<CardDescription className="warm-text-secondary">
									Spread good news in word and action
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="warm-card-bg border warm-border hover:shadow-md transition-shadow">
							<CardHeader className="text-center">
								<div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold warm-primary">
									T
								</div>
								<CardTitle className="warm-text-primary font-serif">
									Train
								</CardTitle>
								<CardDescription className="warm-text-secondary">
									Multiply Jesus' movement
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>

				{/* Current Section */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<Card className="warm-card-bg border warm-border">
							<CardHeader>
								<CardTitle className="warm-text-primary font-serif flex items-center gap-2">
									<Heart className="w-5 h-5 text-orange-600" />
									Today's Spiritual Discipline
								</CardTitle>
								<CardDescription className="warm-text-secondary">
									The Habit of Relationship - Building intimacy with God
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="p-4 rounded-lg warm-muted-bg">
										<h4 className="font-semibold warm-text-primary mb-2">
											Scripture Focus
										</h4>
										<p className="warm-text-secondary italic">
											"...everything else is worthless when compared with the
											infinite value of knowing Christ Jesus my Lord."
										</p>
										<p className="text-sm warm-text-secondary mt-1">
											- Philippians 3:8
										</p>
									</div>

									<div className="p-4 rounded-lg warm-muted-bg">
										<h4 className="font-semibold warm-text-primary mb-2">
											Reflection Question
										</h4>
										<p className="warm-text-secondary">
											What does it mean to you to "know Christ Jesus" beyond
											just knowing about Him?
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<div>
						<Card className="warm-card-bg border warm-border">
							<CardHeader>
								<CardTitle className="warm-text-primary font-serif">
									Your Progress
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="text-center">
									<div className="text-3xl font-bold warm-text-primary">
										Day 12
									</div>
									<p className="warm-text-secondary">of your journey</p>
								</div>

								<div className="space-y-3">
									<div className="flex justify-between items-center">
										<span className="warm-text-secondary">Relationship</span>
										<Badge className="warm-secondary text-white">85%</Badge>
									</div>
									<div className="flex justify-between items-center">
										<span className="warm-text-secondary">Rhythm</span>
										<Badge className="warm-accent text-white">60%</Badge>
									</div>
									<div className="flex justify-between items-center">
										<span className="warm-text-secondary">Reconciliation</span>
										<Badge
											variant="outline"
											className="warm-border warm-text-secondary"
										>
											30%
										</Badge>
									</div>
								</div>

								<Button className="w-full warm-primary text-white hover:opacity-90 transition-opacity">
									Continue Journey
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Inspirational Quote */}
				<div className="mt-8">
					<Card
						className="border-0 text-center py-8"
						style={{ background: "linear-gradient(135deg, #f5f0e8, #ede0d3)" }}
					>
						<CardContent>
							<p className="text-xl italic warm-text-primary font-serif mb-2">
								"The spiritual life is not a life before, after, or beyond our
								everyday existence. No, the spiritual life can only be real when
								it is lived in the midst of the pains and joys of the here and
								now."
							</p>
							<p className="warm-text-secondary">- Henri Nouwen</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ColorVariant1;
