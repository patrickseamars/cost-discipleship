import { useAuth } from '@/contexts/AuthContext';

export function AuthDebug() {
  const { user, profile, loading } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-200 rounded-lg p-4 text-xs max-w-sm">
      <h3 className="font-semibold text-blue-900 mb-2">Auth Debug Info</h3>
      <div className="space-y-1 text-blue-800">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>User ID:</strong> {user?.id}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Profile:</strong> {profile ? 'Loaded' : 'Not loaded'}</p>
        {profile && (
          <>
            <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
            <p><strong>Role:</strong> {profile.role}</p>
          </>
        )}
      </div>
    </div>
  );
}