const path = require('path');

module.exports = {
	webpackFinal: async (config) => {
		config.stats = 'errors-only';
		config.resolve.alias = {
			...config.resolve.alias,
			'@src': path.resolve(__dirname, '../src/'),
		};
		config.resolve.modules.push('src');
		return config;
	},

	framework: {
		name: '@storybook/react-webpack5',
		options: {},
	},

	stories: [
		'../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
		'./**/__stories__/*.stories.@(js|jsx|ts|tsx|mdx)',
	],

	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-a11y',
		'@storybook/addon-mdx-gfm',
		'@storybook/addon-styling-webpack',
		{
			name: '@storybook/addon-styling-webpack',

			options: {
				rules: [
					{
						test: /\.css$/,
						sideEffects: true,
						use: [
							require.resolve('style-loader'),
							{
								loader: require.resolve('css-loader'),
								options: {
									importLoaders: 1,
								},
							},
							{
								loader: require.resolve('postcss-loader'),
								options: {
									implementation: require.resolve('postcss'),
								},
							},
						],
					},
				],
			},
		},
	],

	// https://storybook.js.org/docs/react/configure/images-and-assets#serving-static-files-via-storybook-configuration
	// staticDirs: ['./public'],
	features: {
		storyStoreV7: false,
	},

	docs: {
		autodocs: true,
	},
};
