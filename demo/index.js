// import React from 'react';
import ReactDOM from 'react-dom';
import { UserFeedback } from '../src/index';

const root = document.querySelector('#root');

const App = () => {
	return (
		<div>
			<h1>React User Feedback</h1>
			<UserFeedback />
		</div>
	);
};

ReactDOM.render(<App />, root);
