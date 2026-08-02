import {defineConfig} from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    server: {
        prerender: {
            crawlLinks: true,
        },
        preset: "nitro-prerender",
    },
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
});
