import '!style-loader!css-loader!postcss-loader!tailwindcss/tailwind.css';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import '../src/global.css';

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	viewport: {
		viewports: INITIAL_VIEWPORTS,
	},
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	options: {
		storySort: {
			order: ['Overview', 'Components', 'UI'],
		},
	},
};
