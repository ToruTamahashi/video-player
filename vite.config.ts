import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		dts({
			include: ['src'],
			insertTypesEntry: true,
		}),
	],
	css: {
		modules: {
			// CSSモジュールを有効化
			scopeBehaviour: 'local',
			// 生成されるクラス名のパターン
			generateScopedName: '[name]__[local]__[hash:base64:5]',
		},
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: '@torutamahashi/video-player',
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
				},

				// CSSをchunkとして分離
				// preserveModules: true,
			},
		},
		// CSSの出力設定を明示的に指定
		cssCodeSplit: true,
	},
});
