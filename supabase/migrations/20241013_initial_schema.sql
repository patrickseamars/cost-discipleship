-- COST Training Multi-User Database Schema
-- Initial Migration: Authentication, Users, Groups, and Data Storage

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'group_leader', 'member')),
  group_id UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups table
CREATE TABLE public.groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for group_id in profiles
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_group_id_fkey 
FOREIGN KEY (group_id) REFERENCES public.groups(id);

-- User progress tracking (replaces localStorage completion data)
CREATE TABLE public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL, -- 'relationship', 'rhythm', etc.
  day_number INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT true,
  UNIQUE(user_id, section_key, day_number)
);

-- Assessment responses (replaces localStorage assessment data)
CREATE TABLE public.user_assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  section_title TEXT NOT NULL,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('initial', 'final')),
  evaluation_items JSONB NOT NULL, -- Array of evaluation questions
  ratings JSONB NOT NULL, -- { "0": 8, "1": 7, "2": 9 } - question index to rating
  reflection_answers JSONB DEFAULT '{}', -- { "0": "answer", "1": "answer" }
  results JSONB NOT NULL, -- Calculated results (totalScore, averageScore, etc.)
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, section_key, assessment_type)
);

-- User responses to daily exercises (for group leader visibility)
CREATE TABLE public.user_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  response_type TEXT NOT NULL CHECK (response_type IN ('reflection', 'question')),
  response_data JSONB NOT NULL, -- { "0": "answer", "1": "answer" } - index to response
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, section_key, day_number, response_type)
);

-- Discussion items for group leaders
CREATE TABLE public.discussion_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  section_key TEXT, -- Which section this discussion relates to
  related_members UUID[] DEFAULT '{}', -- Array of user IDs
  related_responses UUID[] DEFAULT '{}', -- Array of response IDs
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'discussed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  discussed_at TIMESTAMP WITH TIME ZONE
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Groups policies  
CREATE POLICY "Members can read own group" ON public.groups
  FOR SELECT USING (
    id IN (
      SELECT group_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all groups" ON public.groups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Group leaders can read managed groups" ON public.groups
  FOR SELECT USING (leader_id = auth.uid());

-- User progress policies
CREATE POLICY "Users can manage own progress" ON public.user_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Group leaders can read member progress" ON public.user_progress
  FOR SELECT USING (
    user_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.groups g ON p.group_id = g.id
      WHERE g.leader_id = auth.uid()
    )
  );

-- Assessment policies
CREATE POLICY "Users can manage own assessments" ON public.user_assessments
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Group leaders can read member assessments" ON public.user_assessments
  FOR SELECT USING (
    user_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.groups g ON p.group_id = g.id
      WHERE g.leader_id = auth.uid()
    )
  );

-- Response policies
CREATE POLICY "Users can manage own responses" ON public.user_responses
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Group leaders can read member responses" ON public.user_responses
  FOR SELECT USING (
    user_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.groups g ON p.group_id = g.id
      WHERE g.leader_id = auth.uid()
    )
  );

-- Discussion policies
CREATE POLICY "Group leaders can manage own discussions" ON public.discussion_items
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Group members can read group discussions" ON public.discussion_items
  FOR SELECT USING (
    group_id IN (
      SELECT group_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_responses_updated_at
  BEFORE UPDATE ON public.user_responses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_group_id ON public.profiles(group_id);
CREATE INDEX idx_user_progress_user_section ON public.user_progress(user_id, section_key);
CREATE INDEX idx_user_assessments_user_section ON public.user_assessments(user_id, section_key);
CREATE INDEX idx_user_responses_user_section_day ON public.user_responses(user_id, section_key, day_number);
CREATE INDEX idx_discussion_items_group ON public.discussion_items(group_id);

-- Insert default admin user (you'll need to replace with actual user ID after first signup)
-- This will need to be run after you create your first user account
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';