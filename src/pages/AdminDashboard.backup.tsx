import { useState, useEffect } from 'react';
import { useRequireAuth, useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Users,
  UserCog,
  Shield,
  Settings,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, profile, loading, hasAccess, isAdmin } = useRequireAuth('admin');
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Debug logging for admin dashboard
  console.log('AdminDashboard render:', {
    user: !!user,
    profile: !!profile,
    loading,
    hasAccess,
    isAdmin,
    userRole: profile?.role,
    userEmail: user?.email
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalGroups: 0,
    groupLeaders: 0,
    avgProgress: 0,
    recentActivity: []
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Fetch data when tabs become active
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchAnalytics();
    } else if (activeTab === 'users') {
      fetchUsers();
      // Also fetch groups for the group assignment dropdown
      if (groups.length === 0) {
        fetchGroups();
      }
    } else if (activeTab === 'groups') {
      fetchGroups();
    }
  }, [activeTab]);

  // Load analytics on initial mount if overview tab is active
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchAnalytics();
    }
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating user role:', error);
        alert('Failed to update user role');
      } else {
        // Refresh users list
        fetchUsers();
        alert('User role updated successfully');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const fetchGroups = async () => {
    setLoadingGroups(true);
    console.log('🔍 Fetching groups...');
    
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          leader:profiles!groups_leader_id_fkey(first_name, last_name, email),
          members:profiles!profiles_group_id_fkey(id, first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });
      
      console.log('📊 Groups query result:', { data, error });
      
      if (error) {
        console.error('❌ Error fetching groups:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        alert(`Error fetching groups: ${error.message}`);
      } else {
        console.log('✅ Groups fetched successfully:', data);
        setGroups(data || []);
      }
    } catch (error) {
      console.error('💥 Exception while fetching groups:', error);
      alert(`Exception while fetching groups: ${error.message}`);
    } finally {
      setLoadingGroups(false);
    }
  };

  const createGroup = async (name: string, description: string, leaderId?: string) => {
    console.log('🏗️ Creating group:', { name, description, leaderId });
    
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert({
          name,
          description,
          leader_id: leaderId || null
        })
        .select(); // Add select to get the created group back
      
      console.log('📊 Group creation result:', { data, error });
      
      if (error) {
        console.error('❌ Error creating group:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        alert(`Failed to create group: ${error.message}`);
      } else {
        console.log('✅ Group created successfully:', data);
        fetchGroups();
        setShowCreateGroup(false);
        alert('Group created successfully');
      }
    } catch (error) {
      console.error('💥 Exception while creating group:', error);
      alert(`Exception while creating group: ${error.message}`);
    }
  };

  const assignUserToGroup = async (userId: string, groupId: string) => {
    console.log('👥 Assigning user to group:', { userId, groupId });
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ group_id: groupId })
        .eq('id', userId);
      
      if (error) {
        console.error('❌ Error assigning user to group:', error);
        alert(`Failed to assign user to group: ${error.message}`);
      } else {
        console.log('✅ User assigned to group successfully');
        // Refresh data
        fetchUsers();
        fetchGroups();
        alert('User assigned to group successfully');
      }
    } catch (error) {
      console.error('💥 Exception while assigning user:', error);
      alert(`Exception while assigning user: ${error.message}`);
    }
  };

  const removeUserFromGroup = async (userId: string) => {
    console.log('🚪 Removing user from group:', { userId });
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ group_id: null })
        .eq('id', userId);
      
      if (error) {
        console.error('❌ Error removing user from group:', error);
        alert(`Failed to remove user from group: ${error.message}`);
      } else {
        console.log('✅ User removed from group successfully');
        // Refresh data
        fetchUsers();
        fetchGroups();
        alert('User removed from group successfully');
      }
    } catch (error) {
      console.error('💥 Exception while removing user:', error);
      alert(`Exception while removing user: ${error.message}`);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!hasAccess || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-900">Access Denied</CardTitle>
            <CardDescription>
              You need administrator privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Current role: <Badge variant="outline">{profile?.role || 'Unknown'}</Badge>
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
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

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'groups', name: 'Groups', icon: UserCog },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const TabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'users':
        return <UsersTab />;
      case 'groups':
        return <GroupsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
          <p className="text-gray-600">Monitor your COST Training platform</p>
        </div>
        <Button 
          onClick={fetchAnalytics} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={loadingAnalytics}
        >
          <Eye className="w-4 h-4" />
          {loadingAnalytics ? 'Loading...' : 'Refresh'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingAnalytics ? '...' : analytics.totalUsers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCog className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Groups</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingAnalytics ? '...' : analytics.totalGroups}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Group Leaders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingAnalytics ? '...' : analytics.groupLeaders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingAnalytics ? '...' : `${analytics.avgProgress}%`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Platform activity in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAnalytics ? (
              <div className="space-y-3">
                <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
              </div>
            ) : analytics.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{activity.type}</p>
                      <p className="text-sm text-gray-600">{activity.period}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{activity.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-4">No recent activity</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button onClick={() => setActiveTab('users')} className="flex items-center gap-2 justify-start">
                <Users className="w-4 h-4" />
                Manage Users
              </Button>
              <Button onClick={() => setActiveTab('groups')} variant="outline" className="flex items-center gap-2 justify-start">
                <Plus className="w-4 h-4" />
                Create Group
              </Button>
              <Button onClick={() => setActiveTab('settings')} variant="outline" className="flex items-center gap-2 justify-start">
                <Settings className="w-4 h-4" />
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user accounts and roles</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {loadingUsers ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No users found</p>
              <p className="text-gray-400 text-sm">Users will appear here once they register</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">
                        {user.first_name} {user.last_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="group_leader">Group Leader</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.group_id || 'none'}
                        onValueChange={(groupId) => {
                          if (groupId === 'none') {
                            removeUserFromGroup(user.id);
                          } else {
                            assignUserToGroup(user.id, groupId);
                          }
                        }}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="No group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No group</SelectItem>
                          {groups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {users.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {users.length} user{users.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );

  const CreateGroupForm = () => {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [selectedLeader, setSelectedLeader] = useState('none');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!groupName.trim()) return;
      
      setSubmitting(true);
      await createGroup(groupName, groupDescription, selectedLeader === 'none' ? undefined : selectedLeader || undefined);
      setSubmitting(false);
      
      // Reset form
      setGroupName('');
      setGroupDescription('');
      setSelectedLeader('none');
    };

    const groupLeaders = users.filter(user => user.role === 'group_leader' || user.role === 'admin');

    return (
      <Card>
        <CardHeader>
          <CardTitle>Create New Group</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="groupDescription">Description</Label>
              <Textarea
                id="groupDescription"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Enter group description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="groupLeader">Group Leader (Optional)</Label>
              <Select value={selectedLeader} onValueChange={setSelectedLeader}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a group leader" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No leader assigned</SelectItem>
                  {groupLeaders.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Group'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateGroup(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  const GroupsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Group Management</h2>
          <p className="text-gray-600">Create and manage training groups</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchGroups} variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Refresh
          </Button>
          <Button 
            onClick={() => {
              setShowCreateGroup(true);
              if (users.length === 0) fetchUsers(); // Fetch users for leader selection
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Group
          </Button>
        </div>
      </div>
      
      {showCreateGroup && <CreateGroupForm />}
      
      <Card>
        <CardContent className="p-0">
          {loadingGroups ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading groups...</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="p-8 text-center">
              <UserCog className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No groups found</p>
              <p className="text-gray-400 text-sm">Create your first training group to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Leader</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      <div className="font-medium">{group.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {group.description || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {group.leader ? (
                          <div>
                            <div className="font-medium">
                              {group.leader.first_name} {group.leader.last_name}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {group.leader.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No leader assigned</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <Badge variant="outline">
                          {group.members?.length || 0} members
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(group.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedGroup(group);
                            setShowManageMembers(true);
                          }}
                          title="View Members"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" title="Edit Group">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" title="Delete Group">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {groups.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {groups.length} group{groups.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    console.log('📊 Fetching analytics...');
    
    try {
      // Fetch user counts by role
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('role, group_id, created_at');
      
      if (usersError) {
        console.error('Error fetching users for analytics:', usersError);
        return;
      }

      // Fetch groups count
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('id, created_at');
      
      if (groupsError) {
        console.error('Error fetching groups for analytics:', groupsError);
        return;
      }

      // Fetch user progress for average calculation
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('user_id, section_key, is_completed');
      
      if (progressError) {
        console.error('Error fetching progress for analytics:', progressError);
      }

      // Calculate analytics
      const totalUsers = usersData?.length || 0;
      const totalGroups = groupsData?.length || 0;
      const groupLeaders = usersData?.filter(user => user.role === 'group_leader').length || 0;
      
      // Calculate average progress (simplified - percentage of completed exercises)
      let avgProgress = 0;
      if (progressData && progressData.length > 0) {
        const completedCount = progressData.filter(p => p.is_completed).length;
        avgProgress = Math.round((completedCount / progressData.length) * 100);
      }

      // Get recent activity (new users in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentUsers = usersData?.filter(user => 
        new Date(user.created_at) > sevenDaysAgo
      ) || [];

      const recentActivity = [
        {
          type: 'New Users',
          count: recentUsers.length,
          period: 'Last 7 days'
        },
        {
          type: 'Active Groups',
          count: usersData?.filter(user => user.group_id).length || 0,
          period: 'Current'
        }
      ];

      setAnalytics({
        totalUsers,
        totalGroups,
        groupLeaders,
        avgProgress,
        recentActivity
      });

      console.log('✅ Analytics calculated:', {
        totalUsers,
        totalGroups,
        groupLeaders,
        avgProgress,
        recentActivity
      });
      
    } catch (error) {
      console.error('💥 Exception while fetching analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const testRLSPolicies = async () => {
    console.log('🧪 Testing RLS policies...');
    
    try {
      // Test current user info
      const { data: userData, error: userError } = await supabase
        .rpc('auth_uid');
      console.log('Current user ID:', { userData, userError });
      
      // Test profile access
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id);
      console.log('Profile access test:', { profileData, profileError });
      
      // Test admin function
      const { data: adminData, error: adminError } = await supabase
        .rpc('is_admin');
      console.log('Admin function test:', { adminData, adminError });
      
      // Test simple groups select
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*');
      console.log('Simple groups select:', { groupsData, groupsError });
      
      alert('RLS test completed - check browser console for results');
    } catch (error) {
      console.error('RLS test error:', error);
      alert('RLS test failed - check console for details');
    }
  };

  const ManageMembersModal = () => {
    if (!selectedGroup) return null;

    const groupMembers = users.filter(user => user.group_id === selectedGroup.id);
    const availableUsers = users.filter(user => !user.group_id);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manage Group Members</CardTitle>
                <CardDescription>
                  {selectedGroup.name} - {groupMembers.length} member{groupMembers.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowManageMembers(false);
                  setSelectedGroup(null);
                }}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 max-h-96 overflow-y-auto">
            {/* Current Members */}
            <div>
              <h4 className="font-medium mb-3">Current Members ({groupMembers.length})</h4>
              {groupMembers.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No members in this group</p>
              ) : (
                <div className="space-y-2">
                  {groupMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{member.first_name} {member.last_name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <Badge variant="outline" className="mt-1">{member.role}</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeUserFromGroup(member.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Available Users to Add */}
            <div>
              <h4 className="font-medium mb-3">Available Users ({availableUsers.length})</h4>
              {availableUsers.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No unassigned users available</p>
              ) : (
                <div className="space-y-2">
                  {availableUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <Badge variant="outline" className="mt-1">{user.role}</Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => assignUserToGroup(user.id, selectedGroup.id)}
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

  const SettingsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-gray-600">Configure platform settings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Database Debug Tools</CardTitle>
          <CardDescription>Tools to debug RLS policies and database access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">User Context Debug</h4>
            <p className="text-sm text-gray-600 mb-3">Current user and role information:</p>
            <div className="text-sm space-y-1">
              <p><strong>User ID:</strong> {user?.id || 'Not available'}</p>
              <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
              <p><strong>Role:</strong> {profile?.role || 'Not available'}</p>
              <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <Button onClick={testRLSPolicies} variant="outline" className="w-full">
            🧪 Test RLS Policies
          </Button>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This debug section helps identify database permission issues. 
              Check the browser console for detailed results after clicking the test button.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500 py-8">
            Additional system settings will be implemented later...
          </p>
        </CardContent>
      </Card>
    </div>
  );

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
                <h1 className="font-semibold text-gray-900">COST Admin</h1>
                <p className="text-xs text-gray-500">Platform Administration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-red-50 text-red-700">
                <Shield className="w-3 h-3 mr-1" />
                Administrator
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-gray-500">{profile?.email}</p>
              </div>
              <Button 
                onClick={() => signOut()}
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
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
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
      {showManageMembers && <ManageMembersModal />}
    </div>
  );
}
