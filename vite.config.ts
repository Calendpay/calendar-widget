import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV), // Zamień process.env.NODE_ENV //wymagane aby działało poprawnie
  },
  build: {
    lib: {
      entry: "src/main.tsx", // Główny plik wejściowy React/TypeScript
      name: "CalendarWidget", // Nazwa eksportowanej biblioteki
      fileName: (format) => `calendar-widget.${format}.js`,
      formats: ["umd"], // Format outputu (UMD dla kompatybilności z osadzaniem w HTML)
    },
    rollupOptions: {
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
