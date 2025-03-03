/** @type {import('tailwindcss').Config} */
export default {
	content: {
		files: ['./index.html', './core/**/*.{js,ts,jsx,tsx}'],
	},
	theme: {
		extend: {},
	},
	plugins: [],
	prefix: 'tvp-',
	corePlugins: {
		preflight: false,
	},
};
