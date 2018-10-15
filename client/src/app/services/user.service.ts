import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private url = `https://aps-josh.herokuapp.com/api/users`;
	private localUrl = `http://localhost:8080/api/users`;
	private signinUrl = `http://localhost:8080/api/signin`;
	constructor(private http: Http) { }

	getUsers() {
		console.log('this.http: ', this.http);
		if (window.location.host === 'localhost:4200') {
			return this.http.get(this.localUrl);
		} else {
			return this.http.get(this.url);
		}
	}

	loginUser(username: string, password: string) {
		const info = { Username: username, Password: password };
		if (window.location.host === 'localhost:4200') {
			return this.http.post(this.signinUrl, info);
		} else {
			return this.http.get(this.url.replace('users?', 'signin'));
		}
	}

	getUser(id: string) {
		if (window.location.host === 'localhost:4200') {
			return this.http.get(this.localUrl.replace('users?', `users/${id}?`));
		} else {
			return this.http.get(this.url.replace('users?', `users/${id}?`));
		}
	}

	createUser(newUser: string) {
		if (window.location.host === 'localhost:4200') {
			return this.http.post(this.localUrl, newUser);
		} else {
			return this.http.post(this.url, newUser);
		}
	}

	updateUser(id: string, updatedUser: string) {
		if (window.location.host === 'localhost:4200') {
			return this.http.put(this.localUrl.replace('users?', `users/${id}?`), updatedUser);
		} else {
			return this.http.put(this.url.replace('users?', `users/${id}?`), updatedUser);
		}
	}

	deleteUser(id: string) {
		if (window.location.host === 'localhost:4200') {
			return this.http.delete(this.localUrl.replace('users?', `users/${id}?`));
		} else {
			return this.http.delete(this.url.replace('users?', `users/${id}?`));
		}
	}
}
