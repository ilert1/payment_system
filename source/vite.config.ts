import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig(({ mode }) => {
    return {
        plugins: [
            react(),
            svgr({
                svgrOptions: {
                    namedExport: "default"
                }
            })
        ],
        server: {
            host: true
        },
        css: {
            modules: {
                generateScopedName: mode === "development" ? "[path][name]__[local]--[hash:base64:5]" : "[hash:base64]"
            },
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler"
                }
            }
        },
        base: "./",
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src")
            }
        }
    };
});
