/**
 * Footer.jsx
 * Shows a simple footer component
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';


export function Footer(){
	return (<nav className="navbar bg-light">
		<div className="container-fluid">
			<span className="navbar-text text-center w-100 small">
				<span className='milton'><FontAwesomeIcon icon={faCode} /> OTA Dev Test | To Do List</span>
			</span>
		</div>
	</nav>);
}


