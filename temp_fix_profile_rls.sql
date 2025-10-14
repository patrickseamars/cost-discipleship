-- Temporary fix for profile loading issues
-- This adds a more permissive policy for authenticated users

-- Option 1: Add a more permissive SELECT policy for authenticated users
CREATE POLICY "Authenticated users can read profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);

-- Note: This is temporary and more permissive than needed for production
-- Once we verify this fixes the issue, we'll replace it with a proper policy