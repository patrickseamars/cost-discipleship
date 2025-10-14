import { createClient } from '@supabase/supabase-js';

// Environment variables - you'll need to add these to your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Database types (auto-generated from your schema)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'admin' | 'group_leader' | 'member';
          group_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role?: 'admin' | 'group_leader' | 'member';
          group_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          role?: 'admin' | 'group_leader' | 'member';
          group_id?: string | null;
          updated_at?: string;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          leader_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          leader_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          leader_id?: string | null;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          section_key: string;
          day_number: number;
          completed_at: string;
          is_completed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          section_key: string;
          day_number: number;
          completed_at?: string;
          is_completed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          section_key?: string;
          day_number?: number;
          completed_at?: string;
          is_completed?: boolean;
        };
      };
      user_assessments: {
        Row: {
          id: string;
          user_id: string;
          section_key: string;
          section_title: string;
          assessment_type: 'initial' | 'final';
          evaluation_items: any[]; // JSONB
          ratings: Record<string, number>; // JSONB
          reflection_answers: Record<string, string>; // JSONB
          results: any; // JSONB - assessment results object
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          section_key: string;
          section_title: string;
          assessment_type: 'initial' | 'final';
          evaluation_items: any[];
          ratings: Record<string, number>;
          reflection_answers?: Record<string, string>;
          results: any;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          section_key?: string;
          section_title?: string;
          assessment_type?: 'initial' | 'final';
          evaluation_items?: any[];
          ratings?: Record<string, number>;
          reflection_answers?: Record<string, string>;
          results?: any;
          completed_at?: string;
        };
      };
      user_responses: {
        Row: {
          id: string;
          user_id: string;
          section_key: string;
          day_number: number;
          response_type: 'reflection' | 'question';
          response_data: Record<string, string>; // JSONB
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          section_key: string;
          day_number: number;
          response_type: 'reflection' | 'question';
          response_data: Record<string, string>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          section_key?: string;
          day_number?: number;
          response_type?: 'reflection' | 'question';
          response_data?: Record<string, string>;
          updated_at?: string;
        };
      };
      discussion_items: {
        Row: {
          id: string;
          group_id: string;
          created_by: string;
          title: string;
          description: string | null;
          section_key: string | null;
          related_members: string[]; // UUID array
          related_responses: string[]; // UUID array
          status: 'pending' | 'discussed' | 'archived';
          created_at: string;
          discussed_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          created_by: string;
          title: string;
          description?: string | null;
          section_key?: string | null;
          related_members?: string[];
          related_responses?: string[];
          status?: 'pending' | 'discussed' | 'archived';
          created_at?: string;
          discussed_at?: string | null;
        };
        Update: {
          id?: string;
          group_id?: string;
          created_by?: string;
          title?: string;
          description?: string | null;
          section_key?: string | null;
          related_members?: string[];
          related_responses?: string[];
          status?: 'pending' | 'discussed' | 'archived';
          discussed_at?: string | null;
        };
      };
    };
  };
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, firstName: string, lastName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Failed to create user');

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role: 'member', // Default role
      });

    if (profileError) throw profileError;

    return data;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  updatePassword: async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  },
};

// Database helpers for COST Training specific operations
export const database = {
  // User progress operations
  markDayComplete: async (sectionKey: string, dayNumber: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        section_key: sectionKey,
        day_number: dayNumber,
        is_completed: true,
      });

    if (error) throw error;
  },

  getCompletedDays: async (sectionKey: string): Promise<number[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_progress')
      .select('day_number')
      .eq('user_id', user.id)
      .eq('section_key', sectionKey)
      .eq('is_completed', true);

    if (error) throw error;
    return data.map(row => row.day_number);
  },

  // Assessment operations
  saveAssessment: async (
    sectionKey: string,
    sectionTitle: string,
    assessmentType: 'initial' | 'final',
    results: any,
    evaluationItems: string[],
    ratings: Record<string, number>,
    reflectionAnswers: Record<string, string> = {}
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('user_assessments')
      .upsert({
        user_id: user.id,
        section_key: sectionKey,
        section_title: sectionTitle,
        assessment_type: assessmentType,
        evaluation_items: evaluationItems,
        ratings,
        reflection_answers: reflectionAnswers,
        results,
      });

    if (error) throw error;
  },

  getAssessment: async (sectionKey: string, assessmentType: 'initial' | 'final') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_assessments')
      .select('*')
      .eq('user_id', user.id)
      .eq('section_key', sectionKey)
      .eq('assessment_type', assessmentType)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
    return data;
  },

  // Response operations
  saveResponses: async (
    sectionKey: string,
    dayNumber: number,
    responseType: 'reflection' | 'question',
    responses: Record<string, string>
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('user_responses')
      .upsert({
        user_id: user.id,
        section_key: sectionKey,
        day_number: dayNumber,
        response_type: responseType,
        response_data: responses,
      });

    if (error) throw error;
  },

  getResponses: async (sectionKey: string, dayNumber: number, responseType: 'reflection' | 'question') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {};

    const { data, error } = await supabase
      .from('user_responses')
      .select('response_data')
      .eq('user_id', user.id)
      .eq('section_key', sectionKey)
      .eq('day_number', dayNumber)
      .eq('response_type', responseType)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.response_data || {};
  },
};

export type UserProfile = Database['public']['Tables']['profiles']['Row'];
export type Group = Database['public']['Tables']['groups']['Row'];
export type UserProgress = Database['public']['Tables']['user_progress']['Row'];
export type UserAssessment = Database['public']['Tables']['user_assessments']['Row'];
export type UserResponse = Database['public']['Tables']['user_responses']['Row'];
export type DiscussionItem = Database['public']['Tables']['discussion_items']['Row'];