const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const isDevMode = process.env.NODE_ENV.includes('dev');
const plugins = [
	new webpack.EnvironmentPlugin({
		NODE_ENV: 'development',
	}),
];
if (!isDevMode) {
	plugins.push(
		new MiniCssExtractPlugin({
			linkType: false,
			filename: '[name].css',
			chunkFilename: '[id].css',
		})
	);
}
module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'public'),
	},
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	plugins,
	module: {
		rules: [
			{
				test: /\.css$/i,
				include: path.resolve(__dirname, 'src'),
				use: [
					isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
				],
			},
			{
				test: /\.(png|svg|jpg|gif)$/i,
				use: ['asset/resource'],
			},
		],
	},
};
