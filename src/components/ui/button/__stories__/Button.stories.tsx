import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';

// https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const meta: Meta<typeof Button> = {
	component: Button,
	title: 'UI/Button',
};

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
	render: () => <Button variant="default">Button</Button>,
};

export const Outline: Story = {
	render: () => <Button variant="outline">Button</Button>,
};
