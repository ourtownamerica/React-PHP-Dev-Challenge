/**
 * main.jsx
 * The entry point for the app.
 */

import {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import { App } from './App.jsx';
import { Home } from './views/Home.jsx';
import { NotFound } from './views/NotFound.jsx';

(async function main(){
	const rootDiv = document.getElementById('app_container');
	const reactRoot = ReactDOM.createRoot(rootDiv);

	// Hacky, ugly way to detect basename while maintaining portability
	const scripts = Array.from(document.getElementsByTagName('script'));
	const lastWithSrc = [...scripts].reverse().find(s => s.src);
	const dir = new URL('.', lastWithSrc.src).pathname;
	let basename = dir.replace(/\/+$/, '');
	basename = basename.substring(0, basename.length-9);

	reactRoot.render(<StrictMode>
		<Router basename={basename}>
			<Routes>
				<Route path="/" element={<App />}>
					<Route index element={<Home />} />
					<Route path="*" element={<NotFound />}  />
				</Route>
			</Routes>
		</Router>
	</StrictMode>);
})();