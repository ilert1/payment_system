import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import viteImagemin from "vite-plugin-imagemin";
import svgr from "vite-plugin-svgr";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    return {
        plugins: [
            viteImagemin({
                optipng: {
                    optimizationLevel: 5 // 0-7
                },
                pngquant: {
                    quality: [0.6, 0.8]
                }
            }),
            analyzer({ analyzerPort: 9000 }),
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
            }
        },
        base: "/",
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src")
            }
        }
    };
});
