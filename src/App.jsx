/**
 * App.js
 * The top-level view of the application.
 */

import {Outlet} from 'react-router';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import AppProvider from './provider/AppProvider.jsx';
import AppContext from './provider/AppContext.jsx';
import { useRef } from 'react';

export function App(){
	const appProvider = useRef(new AppProvider()).current;

	return (<AppContext.Provider value={appProvider}>
		<div className="container">
			<Navbar />
			<Outlet />
			<Footer />
		</div>
	</AppContext.Provider>);

}