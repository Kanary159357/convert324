const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');

const plugins = [
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
];
module.exports = {
	entry: './src/index.tsx',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'public'),
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
	devServer: {
		port: 3000,
		host: 'localhost',
		open: true,
	},
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
