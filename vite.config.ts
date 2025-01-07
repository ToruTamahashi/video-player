import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import type { PreRenderedAsset } from 'rollup';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		dts({
			include: ['src'],
			insertTypesEntry: true,
		}),
		// CSSをJSにインジェクト
		libInjectCss(),
	],
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
				assetFileNames: (assetInfo: PreRenderedAsset): string => {
					// CSSファイルの出力名を設定
					if (assetInfo.type === 'asset' && assetInfo.source) {
						if (typeof assetInfo.source === 'string' && assetInfo.source.includes('@import')) {
							return 'styles.css';
						}
					}
					return '[name][extname]';
				},

				// CSSをchunkとして分離
				// preserveModules: true,
			},
		},
		// CSSの出力設定を明示的に指定
		cssCodeSplit: true,
	},
});
