import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private _currentUser = { Username: null, Name: null, Role: null, FranchiseId: null, id: null, Phone: null };


	constructor(private http: Http) { }

	loginUser(username: string, password: string) {
		// tslint:disable-next-line:prefer-const
		let url = `https://aps-josh.herokuapp.com/api/users`;
		const signinUrl = `http://localhost:8080/api/signin`;
		const info = { Username: username, Password: password };
		if (window.location.host === 'localhost:4200') {
			return this.http.post(signinUrl, info);
		} else {
			return this.http.get(url.replace('users', 'signin'));
		}
	}

	logout() {
		localStorage.removeItem('jwtToken');
	}

	get currentUser() {
		if (!this._currentUser.Name) {
			if (localStorage.getItem('currentUser')) {
				const data = localStorage.getItem('currentUser');
				this._currentUser = JSON.parse(data);
			} else {
				this._currentUser = { Username: null, Name: null, Role: null, FranchiseId: null, id: null, Phone: null };
			}
		}

		return this._currentUser;
	}

}
