import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        include: ["recharts"],
    },
    server: {
        host: true,
        port: 3002,
        proxy: {
            "/api": {
                target: "http://localhost:5002",
                changeOrigin: true,
            },
        },
    },
    preview: {
        host: true,
        port: 3002,
        proxy: {
            "/api": {
                target: "http://localhost:5002",
                changeOrigin: true,
            },
        },
    },
});
