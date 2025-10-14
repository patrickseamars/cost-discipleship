import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	ArrowRight,
	Users,
	BookOpen,
	Target,
	TrendingUp,
	Heart,
	Compass,
	Shield,
	Gift,
	Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		element?.scrollIntoView({ behavior: "smooth" });
	};

	const habits = [
		{
			icon: <Heart className="h-6 w-6" />,
			title: "Relationship",
			description: "Spend the first hour of your morning alone with God",
			color: "bg-red-50 text-red-600 border-red-200",
		},
		{
			icon: <TrendingUp className="h-6 w-6" />,
			title: "Rhythm",
			description:
				"Develop weekly rhythms of emotional, mental, and physical health",
			color: "bg-blue-50 text-blue-600 border-blue-200",
		},
		{
			icon: <Users className="h-6 w-6" />,
			title: "Reconciliation",
			description:
				"Commit to gathering weekly with believers in large and small groups",
			color: "bg-green-50 text-green-600 border-green-200",
		},
		{
			icon: <Zap className="h-6 w-6" />,
			title: "Radiance",
			description: "Share your faith every week with those around you",
			color: "bg-yellow-50 text-yellow-600 border-yellow-200",
		},
		{
			icon: <Gift className="h-6 w-6" />,
			title: "Response",
			description: "Serve someone daily and your church twice a month",
			color: "bg-purple-50 text-purple-600 border-purple-200",
		},
		{
			icon: <Shield className="h-6 w-6" />,
			title: "Resistance",
			description:
				"Connect weekly with an accountability partner to set boundaries",
			color: "bg-orange-50 text-orange-600 border-orange-200",
		},
		{
			icon: <Compass className="h-6 w-6" />,
			title: "Resources",
			description:
				"Structure your stewardship around priority, percentage, and progressive giving",
			color: "bg-teal-50 text-teal-600 border-teal-200",
		},
		{
			icon: <BookOpen className="h-6 w-6" />,
			title: "Refuel",
			description: "Practice living by grace through a weekly Sabbath routine",
			color: "bg-indigo-50 text-indigo-600 border-indigo-200",
		},
		{
			icon: <Target className="h-6 w-6" />,
			title: "Replication",
			description: "Commit to COST Discipling someone else",
			color: "bg-pink-50 text-pink-600 border-pink-200",
		},
	];

	const features = [
		{
			icon: <BookOpen className="h-12 w-12 text-blue-600" />,
			title: "Interactive Discipleship Materials",
			description:
				"Access comprehensive daily exercises, assessments, and biblical content designed to deepen your walk with Christ.",
		},
		{
			icon: <TrendingUp className="h-12 w-12 text-green-600" />,
			title: "Progress Tracking",
			description:
				"Monitor your spiritual growth journey with visual progress indicators and habit tracking across all 9 COST habits.",
		},
		{
			icon: <Users className="h-12 w-12 text-purple-600" />,
			title: "Small Group Tools",
			description:
				"Built-in features for group leaders to manage participants, track progress, and facilitate meaningful discussions.",
		},
		{
			icon: <Target className="h-12 w-12 text-red-600" />,
			title: "Personal Assessments",
			description:
				"Regular self-evaluations help you identify strengths, areas for growth, and concrete next steps in your faith journey.",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
			{/* Header */}
			<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
							C
						</div>
						<span className="text-2xl font-bold text-gray-900">COST</span>
						<Badge variant="outline" className="ml-2">
							Discipleship Platform
						</Badge>
					</div>
					<div className="flex items-center space-x-4">
						<Link to="/auth">
							<Button variant="outline">Sign In</Button>
						</Link>
						<Link to="/auth">
							<Button>Get Started</Button>
						</Link>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto text-center">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
							Multiplying Followers of Jesus
							<span className="block text-blue-600">For Lasting Impact</span>
						</h1>
						<p className="text-xl text-gray-600 mb-8 leading-relaxed">
							Transform your spiritual journey with COST discipleship. Build 9
							essential habits that will deepen your relationship with God,
							strengthen your community connections, and multiply your kingdom
							impact.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
							<Link to="/auth">
								<Button size="lg" className="text-lg px-8 py-3">
									Start Your Journey
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
							<Button
								variant="outline"
								size="lg"
								className="text-lg px-8 py-3"
								onClick={() => scrollToSection("cost-principles")}
							>
								Learn More
							</Button>
						</div>
						<div className="text-sm text-gray-500">
							Join thousands of believers growing in discipleship worldwide
						</div>
					</div>
				</div>
			</section>

			{/* COST Principles */}
			<section id="cost-principles" className="py-16 px-4 bg-gray-50">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							What is COST?
						</h2>
						<p className="text-lg text-gray-600 max-w-3xl mx-auto">
							COST stands for <strong>Connect, Obey, Share, Train</strong> — the
							four foundational elements of biblical discipleship that Jesus
							modeled and commanded.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						<Card className="text-center border-0 shadow-lg">
							<CardHeader>
								<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Heart className="h-8 w-8 text-blue-600" />
								</div>
								<CardTitle className="text-blue-600">Connect</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									Build relationships with God and others through intentional
									community and prayer.
								</p>
							</CardContent>
						</Card>

						<Card className="text-center border-0 shadow-lg">
							<CardHeader>
								<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<BookOpen className="h-8 w-8 text-green-600" />
								</div>
								<CardTitle className="text-green-600">Obey</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									Love through your time, talent, and treasure by living out
									God's commands.
								</p>
							</CardContent>
						</Card>

						<Card className="text-center border-0 shadow-lg">
							<CardHeader>
								<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Zap className="h-8 w-8 text-purple-600" />
								</div>
								<CardTitle className="text-purple-600">Share</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									Spread the good news to the lost through both words and
									actions.
								</p>
							</CardContent>
						</Card>

						<Card className="text-center border-0 shadow-lg">
							<CardHeader>
								<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Target className="h-8 w-8 text-red-600" />
								</div>
								<CardTitle className="text-red-600">Train</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									Multiply Jesus' movement by disciplinhg others in the same
									habits.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* 9 Habits Section */}
			<section id="habits" className="py-16 px-4">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							9 Life-Changing Habits
						</h2>
						<p className="text-lg text-gray-600 max-w-3xl mx-auto">
							Develop these essential spiritual practices that will transform
							every area of your life and equip you to make disciples who make
							disciples.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{habits.map((habit, index) => (
							<Card
								key={index}
								className={`border-2 ${habit.color} hover:shadow-lg transition-shadow`}
							>
								<CardHeader className="pb-3">
									<div className="flex items-center space-x-3">
										<div className={`p-2 rounded-lg ${habit.color}`}>
											{habit.icon}
										</div>
										<CardTitle className="text-lg">{habit.title}</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-gray-700">
										{habit.description}
									</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-16 px-4 bg-gray-50">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Platform Features
						</h2>
						<p className="text-lg text-gray-600 max-w-3xl mx-auto">
							Everything you need to grow in discipleship and lead others on the
							same journey.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						{features.map((feature, index) => (
							<Card key={index} className="border-0 shadow-lg">
								<CardHeader>
									<div className="flex items-start space-x-4">
										{feature.icon}
										<div>
											<CardTitle className="text-xl mb-2">
												{feature.title}
											</CardTitle>
											<CardDescription className="text-gray-600">
												{feature.description}
											</CardDescription>
										</div>
									</div>
								</CardHeader>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 px-4 bg-blue-600">
				<div className="container mx-auto text-center">
					<div className="max-w-3xl mx-auto">
						<h2 className="text-3xl font-bold text-white mb-6">
							Ready to Transform Your Discipleship Journey?
						</h2>
						<p className="text-xl text-blue-100 mb-8">
							Join other believers who are growing in the 9 COST habits and
							multiplying disciples.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link to="/auth">
								<Button
									size="lg"
									variant="secondary"
									className="text-lg px-8 py-3"
								>
									Sign Up Free
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 px-4 bg-gray-900 text-white">
				<div className="container mx-auto text-center">
					<div className="flex items-center justify-center space-x-2 mb-4">
						<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
							C
						</div>
						<span className="text-xl font-bold">
							COST Discipleship Platform
						</span>
					</div>
					<p className="text-gray-400">
						Multiplying disciples for lasting impact • Built with ❤️ for the
						Kingdom
					</p>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
