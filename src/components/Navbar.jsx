/**
 * Navbar.jsx
 * The navigation bar at the top of the page, with branding.
 */


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

export function Navbar(){
	const navigate = useNavigate();

	return (<nav className="navbar navbar-expand-lg bg-light mb-4">
		<div className="container-fluid">
			<a className="navbar-brand milton" href="#" onClick={e=>navigate(e, '/')}>
				<FontAwesomeIcon icon={faCode} /> OT Dev Test
			</a>
		</div>
	</nav>);

}