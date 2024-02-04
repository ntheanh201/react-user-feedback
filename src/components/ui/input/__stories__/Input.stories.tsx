import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../input';

// https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const meta: Meta<typeof Input> = {
	component: Input,
	title: 'UI/Input',
};

export default meta;
type Story = StoryObj<typeof Input>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
	render: () => <Input />,
};
