import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { ProfileSetup } from './ProfileSetup';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'group_leader';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show profile setup only for truly incomplete profiles, not loading errors
  if (user && !loading && profile) {
    // Only show ProfileSetup for auto-created profiles or truly missing names
    const isAutoCreatedProfile = profile.first_name === 'Unknown' && profile.last_name === 'User';
    const hasEmptyNames = !profile.first_name?.trim() || !profile.last_name?.trim();
    const isLoadingError = profile.first_name === 'Profile' && (profile.last_name === 'Loading Error' || profile.last_name === 'Error');
    
    // Don't show ProfileSetup for loading errors
    if ((isAutoCreatedProfile || hasEmptyNames) && !isLoadingError) {
      return <ProfileSetup />;
    }
  }

  // Check role-based access if required
  if (requiredRole && profile) {
    const hasAccess = profile.role === requiredRole || profile.role === 'admin';
    
    if (!hasAccess) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required role: {requiredRole} | Your role: {profile.role}
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}