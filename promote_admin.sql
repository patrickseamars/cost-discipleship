-- Promote user to admin role
-- Replace 'your-email@example.com' with your actual email address

UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verify the change
SELECT id, email, first_name, last_name, role, created_at 
FROM public.profiles 
WHERE email = 'your-email@example.com';