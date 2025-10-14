# COST Discipleship Training Platform

A comprehensive web application for Christian discipleship training based on the COST program (Connect, Obey, Share, Train). This platform provides structured weekly training with assessments, daily exercises, reflection questions, progress tracking, and role-based dashboards for administration and group leadership.

## 🌟 Live Demo

**🌐 Visit the live app:** [https://cost-discipleship.netlify.app](https://cost-discipleship.netlify.app)

## ✨ Features

### 👥 **Multi-Role Dashboard System**
- **🔧 Admin Dashboard**: Complete user and group management with CRUD operations
- **👑 Group Leader Dashboard**: Manage group members, track progress, and view analytics
- **📊 User Dashboard**: Personal progress tracking and learning interface

### 🎯 **Core Learning Features**
- **🌐 Landing Page**: Comprehensive overview of COST principles and 9 essential habits
- **📊 Interactive Assessments**: Self-evaluation tools with progress tracking
- **📝 Daily Exercises**: Scripture study, practical exercises, and reflection questions
- **💾 Data Persistence**: Progress saved to Supabase database with real-time sync
- **📈 Progress Analytics**: Visual progress tracking across all modules
- **🎯 Section Navigation**: Browse through different habit-building sections

### 🛡️ **Security & Authentication**
- **🔐 Supabase Auth**: Secure user authentication and authorization
- **🛡️ Row Level Security (RLS)**: Database-level security policies
- **👤 Profile Management**: Complete user profile setup and management
- **🔑 Role-Based Access Control**: Different permissions for users, group leaders, and admins

### 🎨 **Modern User Experience**
- **🎯 Beautiful Landing Page**: Engaging introduction to COST discipleship principles
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Modern UI**: Clean, accessible interface built with shadcn/ui components
- **⚡ Fast Performance**: Built with Vite and optimized for speed
- **🔗 Smooth Navigation**: Smart scroll-to-section functionality

## 🚀 Getting Started

### Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/) or [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/downloads)
- **Supabase Account** - [Sign up at supabase.com](https://supabase.com)

### 🛠️ Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/patrickseamars/cost-discipleship.git
cd cost-discipleship
```

#### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

#### 3. Set Up Supabase Project

1. **Create a new Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization and create the project
   - Wait for the project to be ready (usually takes 1-2 minutes)

2. **Get your project credentials:**
   - Go to Settings → API
   - Copy your `Project URL` and `anon/public key`

#### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Supabase credentials
# VITE_SUPABASE_URL=https://your-project-id.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 5. Set Up Database Schema

The database schema and RLS policies are managed through migrations:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Apply database migrations
supabase db push
```

**Alternatively, you can run the SQL manually:**
1. Go to your Supabase dashboard → SQL Editor
2. Run the migrations in `supabase/migrations/` in order
3. Run `promote_admin.sql` to make yourself an admin user (after creating your account)

#### 6. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

### 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### 📊 First Time Setup

1. **Create your account**: Visit the app and sign up
2. **Complete profile setup**: Fill in your profile information
3. **Promote to admin** (if needed):
   ```sql
   -- Run this in Supabase SQL Editor
   UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
   ```
4. **Create groups and users**: Use the admin dashboard to manage users and groups

## 🚀 Deployment

This project is deployed on **Netlify** with automatic deployments from the main branch.

### **Current Deployment**
- **Live URL**: [https://cost-discipleship.netlify.app](https://cost-discipleship.netlify.app)
- **Auto-deploy**: Enabled on push to `main` branch
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### **Deploy Your Own Instance**

#### **Option 1: Netlify (Recommended)**
1. **Fork this repository**
2. **Sign up at [netlify.com](https://netlify.com)**
3. **Connect your GitHub account**
4. **Import your forked repository**
5. **Configure build settings:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```
6. **Add environment variables:**
   ```
   VITE_SUPABASE_URL = https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key-here
   ```
7. **Deploy!**

#### **Option 2: Vercel**
```bash
npm install -g vercel
vercel
# Follow prompts and add environment variables in dashboard
```

#### **Option 3: Manual Build**
```bash
# Build for production
npm run build

# Upload 'dist' folder contents to your hosting provider
```

## 🛠️ Tech Stack

### **Frontend**
- **⚡ Vite** - Lightning fast build tool and dev server
- **⚛️ React 18** - UI framework with hooks and modern patterns
- **🏷️ TypeScript** - Type-safe JavaScript for better DX
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 shadcn/ui** - Beautiful, accessible component library
- **📰 Radix UI** - Unstyled, accessible UI primitives
- **📍 React Router** - Client-side routing and navigation
- **⚛️ React Hook Form** - Forms with validation
- **📈 Recharts** - Chart library for analytics

### **Backend & Database**
- **🛡️ Supabase** - Backend-as-a-Service with PostgreSQL
- **🔐 Supabase Auth** - User authentication and authorization
- **💾 PostgreSQL** - Relational database with real-time features
- **🛡️ Row Level Security (RLS)** - Database-level security policies
- **🔄 Real-time subscriptions** - Live data updates

### **Development & Deployment**
- **😫 ESLint** - Code linting and quality
- **🌐 Netlify** - Modern web deployment platform
- **🔄 Auto-deploy** - Automatic deployments from Git

## 🗺️ Database Schema

The application uses PostgreSQL through Supabase with the following main tables:

### **Core Tables**

```sql
-- User profiles with role-based access
profiles (
  id: uuid (primary key, references auth.users)
  email: text
  first_name: text
  last_name: text
  role: text ('user' | 'group_leader' | 'admin')
  group_id: uuid (foreign key to groups)
  created_at: timestamp
  updated_at: timestamp
)

-- Groups for organizing users
groups (
  id: uuid (primary key)
  name: text
  description: text
  leader_id: uuid (foreign key to profiles)
  created_at: timestamp
  updated_at: timestamp
)

-- User progress tracking
user_progress (
  id: uuid (primary key)
  user_id: uuid (foreign key to profiles)
  section: text
  week: integer
  exercise_type: text
  data: jsonb
  created_at: timestamp
  updated_at: timestamp
)

-- Assessment scores
assessments (
  id: uuid (primary key)
  user_id: uuid (foreign key to profiles)
  section: text
  week: integer
  assessment_type: text ('initial' | 'final')
  scores: jsonb
  created_at: timestamp
)
```

### **Row Level Security (RLS) Policies**

The database uses RLS policies to ensure users can only access their own data:

- **Profiles**: Users can view all profiles, but only update their own
- **Groups**: Users can view groups they belong to, leaders can manage their groups
- **User Progress**: Users can only access their own progress data
- **Assessments**: Users can only access their own assessments
- **Admin Override**: Admin users have full access to all data

### **Key Features**

- **Real-time sync**: Changes sync instantly across sessions
- **Offline resilience**: Local storage fallback for offline scenarios
- **Data integrity**: Foreign key constraints and validation
- **Scalable design**: Optimized queries and indexing

## 📌 Project Structure

```
cost-discipleship/
├── public/                     # Static assets
│   ├── favicon.ico
│   └── *.png                   # App icons for PWA
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── auth/               # Authentication components
│   │   │   ├── ProfileSetup.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layouts/            # Layout components
│   │   │   └── SectionsLayout.tsx
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── DailyExercise.tsx
│   │   ├── InteractiveAssessment.tsx
│   │   └── ...
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx
│   ├── data/                   # JSON data files
│   │   ├── daily-exercises.json
│   │   ├── section-overviews.json
│   │   └── section-summaries.json
│   ├── lib/                    # Utility functions
│   │   ├── supabase.ts            # Supabase client
│   │   ├── assessmentStorage.ts
│   │   └── utils.ts
│   ├── pages/                  # Route components
│   │   ├── AdminDashboard.tsx     # Admin management interface
│   │   ├── GroupLeaderDashboard.tsx # Group leader interface
│   │   ├── Dashboard.tsx          # User dashboard
│   │   └── ...
│   ├── hooks/                  # Custom React hooks
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # App entry point
├── supabase/                   # Database management
│   └── migrations/             # Database schema migrations
│       └── *.sql
├── .env.example                # Environment variables template
├── *.sql                       # Database utility scripts
└── package.json                # Dependencies and scripts
```

## 🚑 Troubleshooting

### Common Issues

#### **Database Connection Issues**
```bash
# Error: Invalid API key or project URL
# Solution: Check your .env file
cat .env  # Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

#### **RLS Policy Errors**
```sql
-- If you see "RLS policy violation" errors:
-- 1. Make sure you're signed in
-- 2. Check your user role in the database
SELECT * FROM profiles WHERE email = 'your-email@example.com';

-- 3. If needed, promote yourself to admin:
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

#### **Migration Issues**
```bash
# If migrations fail:
# 1. Reset the database (WARNING: This deletes all data)
supabase db reset

# 2. Or apply migrations manually in Supabase SQL Editor
# Run each .sql file in supabase/migrations/ in order
```

#### **Development Server Issues**
```bash
# Port already in use:
npm run dev -- --port 3000

# Clear node_modules and reinstall:
rm -rf node_modules package-lock.json
npm install
```

#### **Authentication Issues**
```bash
# Clear browser data if auth is stuck:
# 1. Open Developer Tools → Application → Storage
# 2. Clear all localStorage and sessionStorage
# 3. Refresh the page
```

### **Getting Help**

1. **Check the browser console** for detailed error messages
2. **Verify environment variables** are correctly set
3. **Check Supabase dashboard** for database errors
4. **Review RLS policies** in the database if you get permission errors
5. **Check network tab** for failed API requests

### **Useful SQL Queries for Debugging**

```sql
-- Check all users and their roles
SELECT id, email, first_name, last_name, role, group_id FROM profiles;

-- Check all groups and their leaders
SELECT g.*, p.first_name, p.last_name 
FROM groups g 
LEFT JOIN profiles p ON g.leader_id = p.id;

-- Check user progress data
SELECT * FROM user_progress WHERE user_id = 'your-user-id';

-- View all RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
