import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
// import { libInjectCss } from 'vite-plugin-lib-inject-css';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		dts({
			include: ['src'],
			insertTypesEntry: true,
		}),
		// CSSをJSにインジェクト
		// libInjectCss(),
	],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: '@torutamahashi/video-player',
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
		},
		cssMinify: true,
		cssCodeSplit: false,
		rollupOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
				},
				assetFileNames: (assetInfo) => {
					// namesプロパティを使用
					if (assetInfo.names?.includes('index.css')) return 'index.css';
					return assetInfo.names?.[0] ?? '';
				},
			},
		},
	},
	css: {
		modules: {
			localsConvention: 'camelCaseOnly',
		},
	},
});
