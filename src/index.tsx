import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import './style.css';

ReactDom.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);
if (module && module.hot && module.hot.accept) {
	module.hot.accept();
}
