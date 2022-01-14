const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');

module.exports = {
	entry: './src/index.tsx',

	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'public'),
	},
	devServer: {
		headers: [
			{
				key: 'Cross-Origin-Opener-Policy',
				value: 'same-origin',
			},
			{
				key: 'Cross-Origin-Embedder-Policy',
				value: 'require-corp',
			},
			{
				key: 'Access-Control-Allow-Origin',
				value: 'researchgate.net',
			},
			{
				key: 'Access-Control-Allow-Methods',
				value: 'GET,PUT,POST,DELETE',
			},
			{
				key: 'Access-Control-Allow-Headers',
				value: 'Content-Type',
			},
		],
	},
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development',
		}),
		new MiniCssExtractPlugin({
			linkType: false,
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new HtmlWebpackPlugin({
			template: 'public/index.html',
		}),
	],

	module: {
		rules: [
			{
				test: /\.(css)$/i,
				include: path.resolve(__dirname, './src'),
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.(png|svg|jpg|gif)$/i,
				use: ['asset/resource'],
			},
			{
				test: /\.(ts|tsx)$/i,
				exclude: /node_modules/,
				use: { loader: 'babel-loader' },
			},
		],
	},
	resolve: { extensions: ['.tsx', '.ts', '.js', '.json', 'css'] },
};
