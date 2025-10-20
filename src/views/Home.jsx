/**
 * Home.jsx
 * The initial landing page
 */


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import AppContext from "../provider/AppContext.jsx";
import { useContext, useEffect, useState } from 'react';

export function Home(){
	const appProvider = useContext(AppContext);

	const [loading, setLoading] = useState(true);
	const [name, setName] = useState(false);
	const [nameInputValue, setNameInputValue] = useState('');
	const [editName, setEditName] = useState(false);
	const [toDos, setToDos] = useState([]);
	const [newItemInputValue, setNewItemInputValue] = useState('');

	useEffect(()=>{
		(async () => {
			setLoading(true);

			let [user, todo] = await Promise.all([
				appProvider.getName(),
				appProvider.getTodos(),
			]);

			setToDos(todo.items);
			setName(user.username);
			setNameInputValue(user.username || '');
			setLoading(false);
		})();
	}, []);

	const addItem = async e => {
		e.preventDefault();
		if(loading) return;
		setLoading(true);
		let data = await appProvider.addItem(newItemInputValue);
		setNewItemInputValue('');
		setToDos([...toDos, {id:data.id, item:newItemInputValue, done:0}])
		setLoading(false);
	};

	const deleteItem = async (e, id) => {
		e.preventDefault();
		if(loading) return;
		setLoading(true);
		await appProvider.deleteItem(id);
		setToDos([...toDos.filter(t=>t.id!=id)]);
		setLoading(false);
	};

	const setItemComplete = async (id) => {
		if(loading) return;
		setLoading(true);
		await appProvider.toggleDone(id);
		setToDos([...toDos.map(t=>{ 
			if(t.id == id) t.done = t.done == '1' ? '0' : '1'; 
			return t; 
		})]);
		setLoading(false);
	};

	// Handle the personalized greeting
	let greeting;
	if(loading){

		greeting = <>Loading...</>;

	}else if(!name || editName){
		
		const saveName = async e => {
			e.preventDefault();
			if(loading) return;
			setLoading(true);
			await appProvider.setName(nameInputValue);
			setName(nameInputValue);
			setEditName(false);
			setLoading(false);
		};

		greeting = <div className="input-group mb-3" style={{margin:'0 auto', maxWidth: '500px'}}>
			<input type="text" className="form-control" placeholder="Enter your name" value={nameInputValue} onChange={e=>setNameInputValue(e.target.value)} />
			<button className="btn btn-outline-secondary" type="button" onClick={saveName}>Save</button>
		</div>;

	}else{

		greeting = <p>Hello, {name}! <a href='#' onClick={e=>{e.preventDefault(); setEditName(true);}}><FontAwesomeIcon icon={faEdit} /></a></p>

	}

	return (<>
		<div className='text-center'>
			<p>Test app for aspiring Our Town America developers.</p>
			{greeting}
		</div>
		<ul style={{margin:'0 auto', maxWidth: '500px'}}>
			{toDos.map(td=>{
				return <li key={td.id}>
					<div className="form-check form-check-inline">
						<input className="form-check-input" type="checkbox" value="1" checked={td.done=='1'} onChange={()=>setItemComplete(td.id)} />
						<label>{td.item} <a href='#' onClick={e=>deleteItem(e, td.id)}><FontAwesomeIcon icon={faTrash} /></a></label>
					</div>
				</li>;
			})}
			<li>
				<div className="input-group mb-3">
					<input type="text" className="form-control" placeholder="Add a new Item" value={newItemInputValue} onChange={e=>setNewItemInputValue(e.target.value)} />
					<button className="btn btn-outline-secondary" type="button" onClick={addItem}>Add Todo Item</button>
				</div>
			</li>
		</ul>
	</>);
}