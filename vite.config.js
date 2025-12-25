import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const PROJECT_ROOT = __dirname;

// 多入口
const ENTRY = {
    main: resolve(PROJECT_ROOT, 'src/main.jsx'),
};

// 输出目录（你的原配置）
const OUTPUT = resolve(PROJECT_ROOT, 'assets/');

export default defineConfig(({ mode }) => {
    return {
        root: resolve(PROJECT_ROOT, 'src'),
        server: {
            host: '0.0.0.0',
            port: 8989,
        },

        base: '/',
        publicDir: false,

        build: {
            manifest: true,
            outDir: resolve(PROJECT_ROOT, OUTPUT),
            emptyOutDir: true,
            copyPublicDir: false,

            rollupOptions: {
                input: ENTRY,
                output: {
                    entryFileNames: '[name].js',
                    chunkFileNames: '[name].js',
                    assetFileNames: '[name][extname]',
                },
            },
            chunkSizeWarningLimit: 1000,
        },

        css: {
            devSourcemap: true,
        },

        plugins: [react()],
    };
});