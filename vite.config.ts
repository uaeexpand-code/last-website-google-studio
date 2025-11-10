import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // FIX: `__dirname` is not available in all module contexts.
      // Using `.` resolves the path from the current working directory,
      // which is the project root when running Vite.
      "@": path.resolve("."),
    },
  },
})
