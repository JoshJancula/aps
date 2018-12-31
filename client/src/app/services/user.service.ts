import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';


@Injectable({
	providedIn: 'root'
})
export class UserService {

	private url = `https://aps-josh.herokuapp.com/api/users`;
	private localUrl = `http://localhost:8080/api/users`;
	private signinUrl = `http://localhost:8080/api/signin`;
	constructor(private http: HttpClient, private signInHttp: Http) { }

	getUsers() {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				}),
				reportProgress: true,
				observe: 'events' as 'events'
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.get(this.localUrl, httpOptions);
			} else {
				return this.http.get(this.url, httpOptions);
			}
		}
	}

	loginUser(username: string, password: string) {
		const info = { Username: username, Password: password };
		if (window.location.host === 'localhost:4200') {
			return this.signInHttp.post(this.signinUrl, info);
		} else {
			return this.signInHttp.get(this.url.replace('users', 'signin'));
		}
	}

	getUser(id: string) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				}),
				reportProgress: true,
				observe: 'events' as 'events'
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.get(this.localUrl.replace('users', `users/${id}`), httpOptions);
			} else {
				return this.http.get(this.url.replace('users', `users/${id}`), httpOptions);
			}
		}
	}

	createUser(newUser: string) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				}),
				reportProgress: true,
				observe: 'events' as 'events'
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.post(this.localUrl, newUser, httpOptions);
			} else {
				return this.http.post(this.url, newUser, httpOptions);
			}
		}
	}

	updateUser(id: string, updatedUser) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.put(this.localUrl.replace('users', `users/${id}`), updatedUser, httpOptions);
			} else {
				return this.http.put(this.url.replace('users', `users/${id}`), updatedUser, httpOptions);
			}
		}
	}

	deleteUser(id: string) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.delete(this.localUrl.replace('users', `users/${id}`), httpOptions);
			} else {
				return this.http.delete(this.url.replace('users', `users/${id}`), httpOptions);
			}
		}
	}
}
