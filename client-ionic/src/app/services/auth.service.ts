import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // tslint:disable-next-line:variable-name
  private _currentUser = { Username: null, Name: null, Role: null, FranchiseId: null, id: null, Phone: null, Email: null, Avatar: null, Initials: null };
  // tslint:disable-next-line:variable-name
  public _franchiseInfo: any;
  public isLoggedIn = false;
  public logoutSubject = new BehaviorSubject(this.isLoggedIn);
  public loginStatus = this.logoutSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    if (localStorage.getItem('jwtToken')) {
      this.isLoggedIn = true;
      this.logoutSubject.next(this.isLoggedIn);
    }
  }

  async loginUser(username: string, password: string) {
    const url = `https://aps-josh.herokuapp.com/api/users`;
    const signinUrl = `http://localhost:8080/api/signin`;
    const info = { Username: username, Password: password };
    if (window.location.host.indexOf('localhos') > -1) {
      return this.http.post(signinUrl, info).toPromise();
    } else {
      return this.http.post(url.replace('users', 'signin'), info).toPromise();
    }
  }

  public logout(): void {
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
        this._currentUser = { Username: null, Name: null, Role: null, FranchiseId: null, id: null, Phone: null, Email: null, Avatar: null, Initials: null };
      }
    }
    return this._currentUser;
  }

}
