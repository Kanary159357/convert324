module.exports = {
	purge: {
		content: ['./public/*.html', './src/*.js'],
		safelist: ['font-serif', 'font-euljiro', 'font-sans', 'font-hanPro'],
	},
	darkMode: false,
	theme: {
		fontFamily: {
			sans: ['Spoqa Han Sans Neo'],
			hanAir: ['bm-hanna-air'],
			hanPro: ['bm-hanna-pro'],
			euljiro: ['bm-euljiro'],
		},
		extend: {},
	},
	variants: {
		extend: {
			keyframes: {
				loader: {},
			},
		},
	},
	plugins: [],
};
