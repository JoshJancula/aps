import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private url = `https://aps-josh.herokuapp.com/api/users`;
	private localUrl = `localhost:8080/api/users`;
	constructor(private http: Http) { }

	getUsers() {
		return this.http.get(this.url);
	}

	getUser(id: string) {
		return this.http.get(this.url.replace('users?', `users/${id}?`));
	}

	createUser(newUser: string) {
		const url = `localhost:8080/api/users`;
		return this.http.post('/api/users', newUser);
	}

	updateUser(id: string, updatedUser: string) {
		return this.http.put(this.url.replace('users?', `users/${id}?`), updatedUser);
	}

	deleteUser(id: string) {
		return this.http.delete(this.url.replace('users?', `users/${id}?`));
	}
}
