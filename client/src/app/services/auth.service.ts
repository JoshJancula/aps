import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { InternalFormsSharedModule } from '@angular/forms/src/directives';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	// tslint:disable-next-line:max-line-length
	private _currentUser = { Username: null, Name: null, Role: null, FranchiseId: null, id: null, Phone: null, Email: null, Avatar: null, Initials: null };
	public _franchiseInfo: any;
	public isLoggedIn = false;
	public logoutSubject = new BehaviorSubject(this.isLoggedIn);
	loginStatus = this.logoutSubject.asObservable();

	constructor(private router: Router, private http: Http) {
		if (localStorage.getItem('jwtToken')) {
			this.isLoggedIn = true;
			this.logoutSubject.next(this.isLoggedIn);
		}
	 }

	loginUser(username: string, password: string) {
		// tslint:disable-next-line:prefer-const
		let url = `https://aps-josh.herokuapp.com/api/users`;
		const signinUrl = `http://localhost:8080/api/signin`;
		const info = { Username: username, Password: password };
		if (window.location.host.indexOf('localhost') > -1) {
			return this.http.post(signinUrl, info);
		} else {
			return this.http.post(url.replace('users', 'signin'), info);
		}
	}

	logout() {
		localStorage.removeItem('jwtToken');
		this.isLoggedIn = false;
		this.logoutSubject.next(this.isLoggedIn);
		this.router.navigate([`/`], {});
	}

	get currentUser() {
		if (!this._currentUser.Name) {
			if (localStorage.getItem('currentUser')) {
				const data = localStorage.getItem('currentUser');
				this._currentUser = JSON.parse(data);
			} else {
				// tslint:disable-next-line:max-line-length
				this._currentUser = { Username: null, Name: null, Role: null, FranchiseId: null, id: null, Phone: null, Email: null, Avatar: null, Initials: null };
			}
		}

		return this._currentUser;
	}

}
