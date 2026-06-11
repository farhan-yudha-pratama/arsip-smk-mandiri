import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig, type ConfigEnv } from 'vite';

// Wayfinder memanggil `php artisan wayfinder:generate` yang mewajibkan
// koneksi database aktif. Plugin ini HANYA boleh aktif saat local development
// (`npm run dev`). Saat production build (`npm run build`) di lingkungan
// Docker CI/CD yang terisolasi tanpa database, plugin ini harus di-bypass.
export default defineConfig(({ command }: ConfigEnv) => {
    const isDevServer = command === 'serve';

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                refresh: true,
            }),
            inertia(),
            react({
                babel: {
                    plugins: ['babel-plugin-react-compiler'],
                },
            }),
            tailwindcss(),
            // Wayfinder hanya aktif saat `npm run dev` (local development).
            // Saat `npm run build` (CI/CD Docker), plugin ini null/tidak dipasang.
            isDevServer
                ? wayfinder({
                      formVariants: true,
                  })
                : null,
        ],
    };
});
