import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserProfile } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, !!session?.user);
      
      setUser(session?.user ?? null);
      
      if (session?.user && !profile) {
        console.log('Loading profile for user...');
        await loadProfile(session.user.id);
      } else if (!session?.user) {
        console.log('No user, clearing profile...');
        setProfile(null);
        setLoading(false);
      } else {
        console.log('User exists and profile already loaded, skipping...');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log('🔍 Starting profile load for user:', userId, retryCount > 0 ? `(retry ${retryCount})` : '');
      
      // Add timeout to prevent hanging queries
      console.log('📡 Making Supabase query...');
      
      const queryPromise = supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role, group_id, created_at, updated_at')
        .eq('id', userId)
        .single();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000)
      );
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      console.log('📊 Query completed. Data:', data, 'Error:', error);

      console.log('🔄 Processing query result...');
      
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist - this can happen if profile creation failed during signup
        console.warn('⚠️ Profile not found for user:', userId);
        setProfile(null);
      } else if (error) {
        console.error('❌ Error loading profile:', error);
        // For admin users or users who should have profiles, create a minimal profile to prevent ProfileSetup
        // This prevents the ProfileSetup component from appearing inappropriately
        console.log('🔧 Creating minimal profile to prevent ProfileSetup loop');
        const minimalProfile = {
          id: userId,
          email: '', // Will be populated from user.email in component
          first_name: 'Profile',
          last_name: 'Loading Error',
          role: 'member',
          group_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(minimalProfile);
      } else {
        console.log('✅ Profile loaded successfully:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('💥 Exception while loading profile:', error);
      // Set a minimal profile to prevent ProfileSetup from appearing
      const errorProfile = {
        id: userId,
        email: '', 
        first_name: 'Profile',
        last_name: 'Error',
        role: 'member',
        group_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(errorProfile);
    } finally {
      console.log('🏁 Profile loading finished, setting loading to false');
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('Failed to create user');

      // Profile creation is handled by database trigger
      // This avoids timing issues with session establishment
      
      // Check if user is automatically signed in
      if (!data.session) {
        // Try to sign in to see if email confirmation is required
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          // Check if this is an email confirmation error
          if (signInError.message?.includes('email not confirmed') || signInError.message?.includes('Email not confirmed')) {
            // Don't throw error - this is expected behavior
            return {
              ...data,
              emailConfirmationRequired: true
            };
          } else {
            throw signInError;
          }
        }
      }

      // Always return success if user was created
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // User and profile will be loaded automatically via onAuthStateChange
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // State will be cleared automatically via onAuthStateChange
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Role-based hooks for convenience
export function useRequireAuth(requiredRole?: 'admin' | 'group_leader') {
  const { user, profile, loading } = useAuth();
  
  // Debug logging when checking admin access
  if (requiredRole === 'admin') {
    console.log('useRequireAuth admin check:', {
      requiredRole,
      user: !!user,
      profile: !!profile,
      loading,
      userRole: profile?.role,
      userEmail: user?.email,
      profileData: profile
    });
  }
  
  const hasAccess = !requiredRole || profile?.role === requiredRole || profile?.role === 'admin';
  
  return {
    user,
    profile,
    loading,
    hasAccess,
    isAdmin: profile?.role === 'admin',
    isGroupLeader: profile?.role === 'group_leader',
    isMember: profile?.role === 'member',
  };
}
