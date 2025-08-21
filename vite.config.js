import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    base: '/',
    publicDir: 'src',

    build: {
        manifest: true,
        outDir: './assets',
        assetsDir: './assets',
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            input: resolve(__dirname, 'src/main.jsx'),
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].css',
            },
        },
        chunkSizeWarningLimit: 1000,
    },
});
