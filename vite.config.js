import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // listen on all interfaces (required for ngrok)
    allowedHosts: [
      "f8a8-2409-40d6-118f-afa6-840a-130a-16bf-b37c.ngrok-free.app",
    ],
  },
});
