import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig({
    plugins: [
        react(),
        dts({ include: ['src'], insertTypesEntry: true })
    ],
    tsconfig: 'tsconfig.json',
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            name: 'ellipsis',
            fileName: (format, entryName) => `${format}/${entryName}.js`,
            formats: ['es','cjs']
        },
        rolldownOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'jsxRuntime'
                }
            }
        }
    },
    server:{
        open: true
    }
})
