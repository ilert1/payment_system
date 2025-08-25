// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import svgr from "vite-plugin-svgr";

// const isDev = import.meta.env.ENVIRONMENT === "local";

// // https://vitejs.dev/config/
// export default defineConfig({
//     plugins: [react(), svgr({ exportAsDefault: true })],
//     server: {
//         host: true
//     },
//     css: {
//         modules: {
//             generateScopedName: "[path][name]__[local]--[hash:base64:5]"
//         }
//     },
//     base: "/",
//     resolve: {
//         alias: [{ find: "@", replacement: "/src" }]
//     }
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

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
        base: "/",
        resolve: {
            alias: [
                {
                    find: "@",
                    replacement: path.resolve(__dirname, "src")
                }
            ]
        }
    };
});
