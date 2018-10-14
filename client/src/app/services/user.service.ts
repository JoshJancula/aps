import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private url = `https://aps-josh.herokuapp.com/api/users`;
	constructor(private http: Http) {

	}

	getUsers() {
		return this.http.get(this.url);
	}

	getUser(id: string) {
		return this.http.get(this.url.replace('users?', `users/${id}?`));
	}

	createUser(newUser: string) {
		return this.http.post(this.url, newUser);
	}

	updateUser(id: string, updatedUser: string) {
		return this.http.put(this.url.replace('users?', `users/${id}?`), updatedUser);
	}

	deleteUser(id: string) {
		return this.http.delete(this.url.replace('users?', `users/${id}?`));
	}
}
