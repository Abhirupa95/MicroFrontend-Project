// vite.config.js in todo_components
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "todo_components",
      filename: "remoteEntry.js",
      exposes: {
        "./List": "./src/components/List.tsx",
        "./Input": "./src/components/Input.tsx",
        "./Button": "./src/components/Button.tsx",
        "./store" : "./src/store.tsx"
      },
      shared: ["react", "react-dom", "jotai"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    
  },
  server: {
    port: 4173, // Ensure this matches the correct port
  }
});