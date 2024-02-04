import { createRoot } from 'react-dom/client';
import UserFeedback from '../src/index';

const App = () => {
	const onSubmit = async (values, onError) => {
		const { image, type, email, message } = values;

		const formData = new FormData();
		formData.append('images', image);
		formData.append('type', type);
		formData.append('path', window?.location?.pathname);
		formData.append('message', message);
		formData.append('email', email);

		// eslint-disable-next-line no-undef
		await axios
			.post(`http://localhost/v1/feedback`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((res) => {
				console.log('res: ', res.data);
			})
			.catch((error) => {
				console.log('error: ', error);
				onError(error);
			});
	};

	return (
		<div>
			<h1>React User Feedback</h1>
			<h2>@ntheanh201/react-user-feedback</h2>
			<UserFeedback
				disabled={false}
				allowImage={true}
				feedbackTypes={[
					{ value: 'general', label: 'General' },
					{ value: 'bug', label: 'Bug' },
					{ value: 'idea', label: 'Idea' },
				]}
				onSubmit={onSubmit}
			/>
		</div>
	);
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
