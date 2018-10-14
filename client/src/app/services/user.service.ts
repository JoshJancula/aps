import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private url = `https://aps-josh.herokuapp.com/api/users`;
	private localUrl = `http://localhost:8080/api/users`;
	constructor(private http: Http) { }

	getUsers() {
		if (window.location.host === 'localhost:4200') {
			return this.http.get(this.localUrl);
		} else {
			return this.http.get('/api/users');
		}
	}

	getUser(id: string) {
		if (window.location.host === 'localhost:4200') {
			return this.http.get(this.localUrl.replace('users?', `users/${id}?`));
		} else {
			return this.http.get(`/api/users/${id}?`);
		}
	}

	createUser(newUser: string) {
		if (window.location.host === 'localhost:4200') {
			return this.http.post(this.localUrl, newUser);
		} else {
			return this.http.post(`/api/users`, newUser);
		}
	}

	updateUser(id: string, updatedUser: string) {
		if (window.location.host === 'localhost:4200') {
			return this.http.put(this.localUrl.replace('users?', `users/${id}?`), updatedUser);
		} else {
			return this.http.put(`/api/users/${id}?`, updatedUser);
		}
	}

	deleteUser(id: string) {
		if (window.location.host === 'localhost:4200') {
			return this.http.delete(this.localUrl.replace('users?', `users/${id}?`));
		} else {
			return this.http.delete(`/api/users/${id}?`);
		}
	}
}
