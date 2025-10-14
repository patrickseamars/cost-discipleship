import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // GitHub Pages needs the repo name as base path
  // Netlify and other platforms need root path
  const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';
  const base = mode === 'production' && isGitHubPages ? '/cost-discipleship/' : '/';
  
  return {
    base,
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  };
});
