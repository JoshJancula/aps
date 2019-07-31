import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = `https://aps-josh.herokuapp.com/api/users`;
  private localUrl = `http://localhost:8080/api/users`;
  private signinUrl = `http://localhost:8080/api/signin`;
  constructor(private http: HttpClient, private authService: AuthService) { }

  async getUsers() {
    // if (localStorage.getItem('jwtToken')) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('jwtToken') ? localStorage.getItem('jwtToken') : 'blahhhhh',
      }),
      reportProgress: true,
      observe: 'events' as 'events'
    };
    if (window.location.host.indexOf('localhost') > -1) {
      return this.http.get(this.localUrl).toPromise();
    } else {
      // return this.http.get(this.url, httpOptions).toPromise();
    }
    // }
  }

  async loginUser(username: string, password: string) {
    const info = { Username: username, Password: password };
    if (window.location.host.indexOf('localhost') > -1) {
      return this.http.post(this.signinUrl, info).toPromise();
    } else {
      return this.http.get(this.url.replace('users', 'signin')).toPromise();
    }
  }

  async getUser(id: string) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.get(this.localUrl.replace('users', `users/${id}`), httpOptions).toPromise();
      } else {
        return this.http.get(this.url.replace('users', `users/${id}`), httpOptions).toPromise();
      }
    }
  }

  async createUser(newUser: string) {
    // if (localStorage.getItem('jwtToken')) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('jwtToken') ? localStorage.getItem('jwtToken') : 'blahhh',
      }),
      reportProgress: true,
      observe: 'events' as 'events'
    };
    if (window.location.host.indexOf('localhost') > -1) {
      return this.http.post(this.localUrl, newUser, httpOptions).toPromise();
    } else {
      return this.http.post(this.url, newUser, httpOptions).toPromise();
    }
    // }
  }

  async updateUser(id: string, updatedUser) {
    console.log('updatedUser: ', updatedUser);
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.put(this.localUrl.replace('users', `users/${id}`), updatedUser, httpOptions).toPromise();
      } else {
        return this.http.put(this.url.replace('users', `users/${id}`), updatedUser, httpOptions).toPromise();
      }
    }
  }

  async updatePassword(data) {
    const updateObject = { Password: data, id: this.authService.currentUser.id };
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        const localUrl = `http://localhost:8080/api/users/updatePassword/${this.authService.currentUser.id}`;
        return this.http.put(localUrl, updateObject, httpOptions).toPromise();
      } else {
        const url = `https://aps-josh.herokuapp.com/api/users/updatePassword/${this.authService.currentUser.id}`;
        return this.http.put(url, updateObject, httpOptions).toPromise();
      }
    }
  }

  async updateProfileImage(avatar) {
    console.log('about to update profile image');
    const updateObject = { Avatar: avatar, id: this.authService.currentUser.id };
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        console.log('should be posting to localhost');
        const localUrl = `http://localhost:8080/api/users/avatar/${this.authService.currentUser.id}`;
        return this.http.put(localUrl, updateObject, httpOptions).toPromise();
      } else {
        const url = `https://aps-josh.herokuapp.com/api/users/avatar/${this.authService.currentUser.id}`;
        return this.http.put(url, updateObject, httpOptions).toPromise();
      }
    }
  }


  async deleteUser(id: string) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.delete(this.localUrl.replace('users', `users/${id}`), httpOptions).toPromise();
      } else {
        return this.http.delete(this.url.replace('users', `users/${id}`), httpOptions).toPromise();
      }
    }
  }
}
