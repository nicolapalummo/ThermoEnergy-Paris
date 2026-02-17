import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                plomberie: resolve(__dirname, 'plomberie/index.html'),
                chauffage: resolve(__dirname, 'chauffage/index.html'),
            },
        },
    },
});
