# COST Discipleship Training Platform

An interactive web application for Christian discipleship training based on the COST program (Connect, Obey, Share, Train). This platform provides structured weekly training with assessments, daily exercises, reflection questions, and progress tracking.

## 🌟 Live Demo

**🌐 Visit the live app:** [https://patrickseamars.github.io/cost-discipleship/](https://patrickseamars.github.io/cost-discipleship/)

## ✨ Features

- **📊 Interactive Assessments**: Self-evaluation tools with progress tracking
- **📝 Daily Exercises**: Scripture study, practical exercises, and reflection questions
- **💾 Progress Persistence**: Your answers and assessments are saved locally
- **📈 Week Review**: Compare initial vs. final assessment scores with visual progress bars
- **🎯 Section Navigation**: Browse through different habit-building sections
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Modern UI**: Clean, accessible interface built with shadcn/ui components

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v16 or higher) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm (comes with Node.js)
- Git

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/patrickseamars/cost-discipleship.git

# 2. Navigate to the project directory
cd cost-discipleship

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

 The app will be available at `http://localhost:8080`

### Other Available Scripts

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linting
npm run lint

# Deploy to GitHub Pages
npm run deploy
```

## 🚀 Deployment

### Deploy to GitHub Pages

This project is configured for easy deployment to GitHub Pages:

```bash
# Deploy to GitHub Pages (builds and deploys automatically)
npm run deploy
```

**What happens when you run `npm run deploy`:**
1. Builds the project for production
2. Creates/updates the `gh-pages` branch
3. Deploys the built files to GitHub Pages
4. Your site will be live at `https://yourusername.github.io/repository-name/`

### Manual Deployment Steps

If you want to deploy manually or to a different hosting provider:

```bash
# 1. Build for production
npm run build

# 2. The built files will be in the 'dist' directory
# Upload the contents of 'dist' to your hosting provider
```

### First-Time GitHub Pages Setup

If you fork this repository or want to set up deployment from scratch:

1. **Fork/Clone the repository**
2. **Update package.json**:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name"
   }
   ```
3. **Update vite.config.ts**:
   ```typescript
   base: mode === 'production' ? '/your-repo-name/' : '/'
   ```
4. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```
5. **Deploy**:
   ```bash
   npm run deploy
   ```

### Environment Variables

No environment variables are required for basic functionality. The app uses localStorage for data persistence.

## 🛠️ Tech Stack

- **⚡ Vite** - Lightning fast build tool
- **⚛️ React 18** - UI framework with hooks
- **🏷️ TypeScript** - Type-safe JavaScript
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 shadcn/ui** - Re-usable component library
- **📦 Radix UI** - Unstyled, accessible UI primitives
- **📍 React Router** - Client-side routing
- **💾 LocalStorage** - Client-side data persistence

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── DailyExercise.tsx
│   ├── InteractiveAssessment.tsx
│   ├── SectionNavigation.tsx
│   └── ...
├── data/               # JSON data files
│   ├── daily-exercises.json
│   ├── section-overviews.json
│   └── section-summaries.json
├── lib/                # Utility functions
│   ├── assessmentStorage.ts
│   └── utils.ts
├── pages/              # Route components
└── hooks/              # Custom React hooks
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

- Built with [Lovable](https://lovable.dev) - AI-powered web development
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
