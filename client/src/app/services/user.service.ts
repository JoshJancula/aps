import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { AuthService } from './auth.service';


@Injectable({
	providedIn: 'root'
})
export class UserService {

	private url = `https://aps-josh.herokuapp.com/api/users`;
	private localUrl = `http://localhost:8080/api/users`;
	private signinUrl = `http://localhost:8080/api/signin`;
	constructor(private http: HttpClient, private signInHttp: Http, private authService: AuthService) { }

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
		console.log('updatedUser: ', updatedUser);
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

	updatePassword(data) {
		const updateObject = { Password: data, id: this.authService.currentUser.id };
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host === 'localhost:4200') {
				const localUrl = `http://localhost:8080/api/users/updatePassword/${this.authService.currentUser.id}`;
				return this.http.put(localUrl, updateObject, httpOptions);
			} else {
				const url = `https://aps-josh.herokuapp.com/api/users/updatePassword/${this.authService.currentUser.id}`;
				return this.http.put(url, updateObject, httpOptions);
			}
		}
	}

	updateProfileImage(avatar) {
		console.log('about to update profile image');
		const updateObject = { Avatar: avatar, id: this.authService.currentUser.id };
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host === 'localhost:4200') {
				console.log('should be posting to localhost');
				const localUrl = `http://localhost:8080/api/users/avatar/${this.authService.currentUser.id}`;
				return this.http.put(localUrl, updateObject, httpOptions);
			} else {
				const url = `https://aps-josh.herokuapp.com/api/users/avatar/${this.authService.currentUser.id}`;
				return this.http.put(url, updateObject, httpOptions);
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
