import { useState, useEffect } from "react";
import { useRequireAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
	Users,
	UserCheck,
	UserX,
	TrendingUp,
	Calendar,
	Mail,
	Phone,
	MessageCircle,
	BarChart3,
	Activity,
	AlertTriangle,
	CheckCircle,
	Clock,
	Plus,
	UserMinus,
} from "lucide-react";

export default function GroupLeaderDashboard() {
	const { user, profile, loading, hasAccess, isGroupLeader, isAdmin } =
		useRequireAuth("group_leader");
	const [activeTab, setActiveTab] = useState("overview");
	const [groupData, setGroupData] = useState<any>(null);
	const [members, setMembers] = useState<any[]>([]);
	const [memberProgress, setMemberProgress] = useState<any[]>([]);
	const [loadingData, setLoadingData] = useState(true);
	const [availableUsers, setAvailableUsers] = useState<any[]>([]);
	const [showAddMember, setShowAddMember] = useState(false);

	useEffect(() => {
		if (profile && (isGroupLeader || isAdmin)) {
			fetchGroupData();
		}
	}, [profile, isGroupLeader, isAdmin]);

	const fetchGroupData = async () => {
		setLoadingData(true);
		console.log(
			"🏢 Fetching group data for user:",
			profile?.id,
			"Role:",
			profile?.role
		);

		try {
			let groupData, groupError;

			if (isAdmin) {
				// Admins can see all groups, for now let's get the first available group
				// In the future, we could add a group selector for admins
				const { data: allGroups, error: adminError } = await supabase
					.from("groups")
					.select("*")
					.limit(1);

				groupData = allGroups?.[0] || null;
				groupError = adminError;

				console.log(
					"👑 Admin accessing groups. Found:",
					groupData ? 1 : 0,
					"groups"
				);
			} else {
				// Regular group leaders see their assigned group
				const { data: leaderGroup, error: leaderError } = await supabase
					.from("groups")
					.select("*")
					.eq("leader_id", profile?.id)
					.single();

				groupData = leaderGroup;
				groupError = leaderError;
			}

			if (groupError && groupError.code !== "PGRST116") {
				console.error("❌ Error fetching group:", groupError);
				return;
			}

			if (!groupData) {
				console.log("⚠️ No group assigned to this leader");
				setGroupData(null);
				setMembers([]);
				return;
			}

			console.log("✅ Group found:", groupData);
			setGroupData(groupData);

			// Fetch group members
			const { data: membersData, error: membersError } = await supabase
				.from("profiles")
				.select("id, first_name, last_name, email, created_at")
				.eq("group_id", groupData.id)
				.order("first_name");

			if (membersError) {
				console.error("❌ Error fetching members:", membersError);
			} else {
				console.log("✅ Members found:", membersData);
				setMembers(membersData || []);
			}

			// Fetch progress data for members
			if (membersData && membersData.length > 0) {
				const memberIds = membersData.map((member) => member.id);
				const { data: progressData, error: progressError } = await supabase
					.from("user_progress")
					.select(
						"user_id, section_key, day_number, completed_at, is_completed"
					)
					.in("user_id", memberIds);

				if (progressError) {
					console.error("❌ Error fetching progress:", progressError);
				} else {
					console.log("✅ Progress data found:", progressData);
					setMemberProgress(progressData || []);
				}
			}
		} catch (error) {
			console.error("💥 Exception while fetching group data:", error);
		} finally {
			setLoadingData(false);
		}
	};

	const fetchAvailableUsers = async () => {
		console.log("👥 Fetching available users (not in any group)...");

		try {
			const { data: usersData, error: usersError } = await supabase
				.from("profiles")
				.select("id, first_name, last_name, email, role")
				.is("group_id", null)
				.neq("role", "admin")
				.order("first_name");

			if (usersError) {
				console.error("❌ Error fetching available users:", usersError);
			} else {
				console.log("✅ Available users found:", usersData);
				setAvailableUsers(usersData || []);
			}
		} catch (error) {
			console.error("💥 Exception while fetching available users:", error);
		}
	};

	const assignMemberToGroup = async (userId: string, userName: string) => {
		if (!groupData) return;

		console.log("📝 Assigning user to group:", {
			userId,
			userName,
			groupId: groupData.id,
		});

		try {
			const { error } = await supabase
				.from("profiles")
				.update({ group_id: groupData.id })
				.eq("id", userId);

			if (error) {
				console.error("❌ Error assigning member to group:", error);
				alert(`Failed to add member: ${error.message}`);
			} else {
				console.log("✅ Member assigned successfully");
				// Refresh group data and available users
				await fetchGroupData();
				await fetchAvailableUsers();
				alert(`${userName} has been added to the group successfully!`);
			}
		} catch (error) {
			console.error("💥 Exception while assigning member:", error);
			alert(`Exception while adding member: ${error.message}`);
		}
	};

	const removeMemberFromGroup = async (userId: string, userName: string) => {
		if (
			!confirm(`Are you sure you want to remove ${userName} from the group?`)
		) {
			return;
		}

		console.log("🚪 Removing member from group:", { userId, userName });

		try {
			const { error } = await supabase
				.from("profiles")
				.update({ group_id: null })
				.eq("id", userId);

			if (error) {
				console.error("❌ Error removing member from group:", error);
				alert(`Failed to remove member: ${error.message}`);
			} else {
				console.log("✅ Member removed successfully");
				// Refresh group data and available users
				await fetchGroupData();
				await fetchAvailableUsers();
				alert(`${userName} has been removed from the group.`);
			}
		} catch (error) {
			console.error("💥 Exception while removing member:", error);
			alert(`Exception while removing member: ${error.message}`);
		}
	};

	// Calculate member statistics
	const getMemberStats = (memberId: string) => {
		const memberProgressData = memberProgress.filter(
			(p) => p.user_id === memberId
		);
		const completedCount = memberProgressData.filter(
			(p) => p.is_completed
		).length;
		const totalSections = 9; // Total COST sections
		const avgDaysPerSection = 7; // Approximate
		const totalPossible = totalSections * avgDaysPerSection;
		const completionRate =
			totalPossible > 0
				? Math.round((completedCount / totalPossible) * 100)
				: 0;

		return {
			completedExercises: completedCount,
			completionRate,
			lastActivity:
				memberProgressData.length > 0
					? new Date(
							Math.max(
								...memberProgressData.map((p) =>
									new Date(p.completed_at).getTime()
								)
							)
					  )
					: null,
		};
	};

	const groupStats = {
		totalMembers: members.length,
		activeMembers: members.filter((member) => {
			const stats = getMemberStats(member.id);
			return (
				stats.lastActivity &&
				Date.now() - stats.lastActivity.getTime() < 7 * 24 * 60 * 60 * 1000
			); // Active in last 7 days
		}).length,
		avgCompletion:
			members.length > 0
				? Math.round(
						members.reduce(
							(sum, member) => sum + getMemberStats(member.id).completionRate,
							0
						) / members.length
				  )
				: 0,
	};

	// Show loading state
	if (loading || loadingData) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-2 text-gray-600">Loading your group dashboard...</p>
				</div>
			</div>
		);
	}

	// Show access denied if not group leader or admin
	if (!hasAccess || (!isGroupLeader && !isAdmin)) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<Users className="w-12 h-12 text-red-500 mx-auto mb-4" />
						<CardTitle className="text-red-900">Access Denied</CardTitle>
						<CardDescription>
							You need group leader privileges to access this page.
						</CardDescription>
					</CardHeader>
					<CardContent className="text-center">
						<p className="text-sm text-gray-600 mb-4">
							Current role:{" "}
							<Badge variant="outline">{profile?.role || "Unknown"}</Badge>
						</p>
						<Button
							onClick={() => (window.location.href = "/")}
							variant="outline"
							className="w-full"
						>
							Return to Dashboard
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Show no group assigned message
	if (!groupData) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
						<CardTitle>
							{isAdmin ? "No Groups Found" : "No Group Assigned"}
						</CardTitle>
						<CardDescription>
							{isAdmin
								? "No groups have been created yet."
								: "You haven't been assigned to lead a group yet."}
						</CardDescription>
					</CardHeader>
					<CardContent className="text-center">
						<p className="text-sm text-gray-600 mb-4">
							{isAdmin
								? "Create groups in the Admin Dashboard first."
								: "Contact your administrator to be assigned to a group."}
						</p>
						<Button
							onClick={() => (window.location.href = isAdmin ? "/admin" : "/")}
							variant="outline"
							className="w-full"
						>
							{isAdmin ? "Go to Admin Dashboard" : "Return to Dashboard"}
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const tabs = [
		{ id: "overview", name: "Overview", icon: BarChart3 },
		{ id: "members", name: "Members", icon: Users },
		{ id: "progress", name: "Progress", icon: TrendingUp },
		{ id: "engagement", name: "Engagement", icon: Activity },
	];

	const TabContent = () => {
		switch (activeTab) {
			case "overview":
				return <OverviewTab />;
			case "members":
				return <MembersTab />;
			case "progress":
				return <ProgressTab />;
			case "engagement":
				return <EngagementTab />;
			default:
				return <OverviewTab />;
		}
	};

	const OverviewTab = () => (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold text-gray-900">Group Overview</h2>
				<p className="text-gray-600">
					Monitor your group's progress and engagement
				</p>
			</div>

			{/* Group Info Card */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="w-5 h-5" />
						{groupData.name}
					</CardTitle>
					<CardDescription>
						{groupData.description || "No description provided"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="text-3xl font-bold text-blue-600">
								{groupStats.totalMembers}
							</div>
							<div className="text-sm text-gray-600">Total Members</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-green-600">
								{groupStats.activeMembers}
							</div>
							<div className="text-sm text-gray-600">Active This Week</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-purple-600">
								{groupStats.avgCompletion}%
							</div>
							<div className="text-sm text-gray-600">Avg Completion</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Recent Activity */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Activity</CardTitle>
				</CardHeader>
				<CardContent>
					{memberProgress.length > 0 ? (
						<div className="space-y-4">
							{memberProgress
								.sort(
									(a, b) =>
										new Date(b.completed_at).getTime() -
										new Date(a.completed_at).getTime()
								)
								.slice(0, 5)
								.map((progress, index) => {
									const member = members.find((m) => m.id === progress.user_id);
									return (
										<div
											key={index}
											className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
										>
											<CheckCircle className="w-4 h-4 text-green-600" />
											<div className="flex-1">
												<p className="font-medium">
													{member?.first_name} {member?.last_name}
												</p>
												<p className="text-sm text-gray-600">
													Completed {progress.section_key} - Day{" "}
													{progress.day_number}
												</p>
											</div>
											<div className="text-sm text-gray-500">
												{new Date(progress.completed_at).toLocaleDateString()}
											</div>
										</div>
									);
								})}
						</div>
					) : (
						<p className="text-gray-500 text-center py-8">No recent activity</p>
					)}
				</CardContent>
			</Card>
		</div>
	);

	const MembersTab = () => (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Group Members</h2>
					<p className="text-gray-600">
						Manage and communicate with your group members
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						onClick={() => {
							setShowAddMember(true);
							fetchAvailableUsers();
						}}
						className="flex items-center gap-2"
					>
						<Plus className="w-4 h-4" />
						Add Members
					</Button>
					<Button variant="outline" className="flex items-center gap-2">
						<Mail className="w-4 h-4" />
						Email All Members
					</Button>
				</div>
			</div>

			<Card>
				<CardContent className="p-0">
					{members.length === 0 ? (
						<div className="p-8 text-center">
							<Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-500 text-lg font-medium">
								No members in this group
							</p>
							<p className="text-gray-400 text-sm">
								Members will appear here when assigned by an admin
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Member</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Progress</TableHead>
									<TableHead>Last Active</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{members.map((member) => {
									const stats = getMemberStats(member.id);
									return (
										<TableRow key={member.id}>
											<TableCell>
												<div className="font-medium">
													{member.first_name} {member.last_name}
												</div>
											</TableCell>
											<TableCell>
												<div className="text-sm text-gray-600">
													{member.email}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Progress
														value={stats.completionRate}
														className="w-16"
													/>
													<span className="text-sm">
														{stats.completionRate}%
													</span>
												</div>
											</TableCell>
											<TableCell>
												<div className="text-sm text-gray-600">
													{stats.lastActivity
														? stats.lastActivity.toLocaleDateString()
														: "Never"}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Button
														size="sm"
														variant="outline"
														title="Send Email"
													>
														<Mail className="w-3 h-3" />
													</Button>
													<Button
														size="sm"
														variant="outline"
														title="Send Message"
													>
														<MessageCircle className="w-3 h-3" />
													</Button>
													<Button
														size="sm"
														variant="outline"
														className="text-red-600 hover:text-red-700"
														title="Remove from Group"
														onClick={() =>
															removeMemberFromGroup(
																member.id,
																`${member.first_name} ${member.last_name}`
															)
														}
													>
														<UserMinus className="w-3 h-3" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);

	const ProgressTab = () => (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold text-gray-900">Progress Tracking</h2>
				<p className="text-gray-600">
					Monitor individual and group progress through COST Discipleship
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{members.map((member) => {
					const stats = getMemberStats(member.id);
					return (
						<Card key={member.id}>
							<CardHeader>
								<CardTitle className="text-lg">
									{member.first_name} {member.last_name}
								</CardTitle>
								<CardDescription>Progress Overview</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-medium">
												Overall Progress
											</span>
											<span className="text-sm">{stats.completionRate}%</span>
										</div>
										<Progress value={stats.completionRate} />
									</div>

									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<div className="font-medium">
												{stats.completedExercises}
											</div>
											<div className="text-gray-600">Completed</div>
										</div>
										<div>
											<div className="font-medium">
												{stats.lastActivity
													? `${Math.floor(
															(Date.now() - stats.lastActivity.getTime()) /
																(24 * 60 * 60 * 1000)
													  )}d ago`
													: "Never"}
											</div>
											<div className="text-gray-600">Last Active</div>
										</div>
									</div>

									<Button size="sm" variant="outline" className="w-full">
										View Details
									</Button>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);

	const EngagementTab = () => {
		const needsAttention = members.filter((member) => {
			const stats = getMemberStats(member.id);
			const daysSinceActivity = stats.lastActivity
				? Math.floor(
						(Date.now() - stats.lastActivity.getTime()) / (24 * 60 * 60 * 1000)
				  )
				: 999;
			return daysSinceActivity > 7 || stats.completionRate < 20;
		});

		return (
			<div className="space-y-6">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">
						Member Engagement
					</h2>
					<p className="text-gray-600">
						Identify members who need encouragement and support
					</p>
				</div>

				{/* Engagement Alerts */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertTriangle className="w-5 h-5 text-orange-600" />
							Members Needing Attention ({needsAttention.length})
						</CardTitle>
						<CardDescription>
							Members who haven't been active recently or are falling behind
						</CardDescription>
					</CardHeader>
					<CardContent>
						{needsAttention.length === 0 ? (
							<div className="text-center py-8">
								<CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
								<p className="text-green-700 font-medium">
									Great job! All members are engaged.
								</p>
								<p className="text-gray-600 text-sm">
									No members need immediate attention.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{needsAttention.map((member) => {
									const stats = getMemberStats(member.id);
									const daysSinceActivity = stats.lastActivity
										? Math.floor(
												(Date.now() - stats.lastActivity.getTime()) /
													(24 * 60 * 60 * 1000)
										  )
										: 999;

									return (
										<div
											key={member.id}
											className="flex items-center justify-between p-4 border border-orange-200 bg-orange-50 rounded-lg"
										>
											<div>
												<p className="font-medium">
													{member.first_name} {member.last_name}
												</p>
												<p className="text-sm text-gray-600">
													{daysSinceActivity > 30
														? "Inactive for over 30 days"
														: daysSinceActivity > 7
														? `Inactive for ${daysSinceActivity} days`
														: `${stats.completionRate}% completion rate`}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Button size="sm" variant="outline">
													<Mail className="w-3 h-3 mr-1" />
													Email
												</Button>
												<Button size="sm">Follow Up</Button>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Engagement Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-green-700">
								<UserCheck className="w-5 h-5" />
								Highly Engaged
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-green-600">
								{
									members.filter(
										(member) => getMemberStats(member.id).completionRate > 60
									).length
								}
							</div>
							<p className="text-gray-600">Members with 60%+ completion</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-orange-700">
								<Clock className="w-5 h-5" />
								Moderate Engagement
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-orange-600">
								{
									members.filter((member) => {
										const rate = getMemberStats(member.id).completionRate;
										return rate >= 20 && rate <= 60;
									}).length
								}
							</div>
							<p className="text-gray-600">Members with 20-60% completion</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-red-700">
								<UserX className="w-5 h-5" />
								Needs Support
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-red-600">
								{
									members.filter(
										(member) => getMemberStats(member.id).completionRate < 20
									).length
								}
							</div>
							<p className="text-gray-600">
								Members with less than 20% completion
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	};

	const AddMemberModal = () => {
		if (!showAddMember || !groupData) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
				<Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Add Members to Group</CardTitle>
								<CardDescription>
									{groupData.name} - Add unassigned users to your group
								</CardDescription>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setShowAddMember(false);
								}}
							>
								Close
							</Button>
						</div>
					</CardHeader>
					<CardContent className="space-y-6 max-h-96 overflow-y-auto">
						{/* Available Users to Add */}
						<div>
							<h4 className="font-medium mb-3">
								Available Users ({availableUsers.length})
							</h4>
							{availableUsers.length === 0 ? (
								<p className="text-sm text-gray-500 py-4">
									No unassigned users available
								</p>
							) : (
								<div className="space-y-2">
									{availableUsers.map((user) => (
										<div
											key={user.id}
											className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
										>
											<div>
												<p className="font-medium">
													{user.first_name} {user.last_name}
												</p>
												<p className="text-sm text-gray-600">{user.email}</p>
												<Badge variant="outline" className="mt-1">
													{user.role}
												</Badge>
											</div>
											<Button
												size="sm"
												onClick={() =>
													assignMemberToGroup(
														user.id,
														`${user.first_name} ${user.last_name}`
													)
												}
											>
												Add to Group
											</Button>
										</div>
									))}
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center gap-4">
							<div className="cost-logo-container">
								<div className="corner top-right"></div>
								<div className="corner bottom-left"></div>
								<div className="text-content">CO</div>
								<div className="text-content">ST</div>
							</div>
							<div>
								<h1 className="font-semibold text-gray-900">
									Group Leader Dashboard
								</h1>
								<p className="text-xs text-gray-500">Manage Your Group</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<Badge
								variant="outline"
								className={
									isAdmin
										? "bg-red-50 text-red-700"
										: "bg-green-50 text-green-700"
								}
							>
								<Users className="w-3 h-3 mr-1" />
								{isAdmin ? "Administrator" : "Group Leader"}
							</Badge>
							<div className="text-right">
								<p className="text-sm font-medium text-gray-900">
									{profile?.first_name} {profile?.last_name}
								</p>
								<p className="text-xs text-gray-500">{profile?.email}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Tab Navigation */}
			<div className="bg-white border-b border-gray-200">
				<div className="px-4 sm:px-6 lg:px-8">
					<nav className="flex space-x-8">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
										activeTab === tab.id
											? "border-blue-500 text-blue-600"
											: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
									}`}
								>
									<Icon className="w-4 h-4" />
									{tab.name}
								</button>
							);
						})}
					</nav>
				</div>
			</div>

			{/* Main Content */}
			<div className="px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-7xl mx-auto">
					<TabContent />
				</div>
			</div>

			{/* Modals */}
			{showAddMember && <AddMemberModal />}
		</div>
	);
}
