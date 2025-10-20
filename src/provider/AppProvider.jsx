export default class AppProvider{

	async getName(){
		return await this.#api('get_name');
	}

	async getTodos(){
		return await this.#api('get_todos');
	}

	async addItem(item){
		return await this.#api('add_item', {item});
	}

	async deleteItem(id){
		return await this.#api('delete_todo', {id});
	}


	async setName(name){
		return await this.#api('set_name', {name});
	}

	async toggleDone(id){
		return await this.#api('toggle_done', {id});
	}

	async #api(action, params={}){
		params.action = action;
		let url = `./api/`;
		let response = await fetch(url, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(params)
		});
		if (!response.ok) {
			throw `There was an error communicating with the server.`;
		}
		const responseData = await response.json(); 
		if(responseData.has_error){
			throw responseData.message;
		}
		return responseData.data;
	}

};