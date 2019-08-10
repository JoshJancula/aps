import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from 'src/app/models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = `https://aps-josh.herokuapp.com/api/users`;
  private localUrl = `http://localhost:8080/api/users`;
  private signinUrl = `http://localhost:8080/api/signin`;
  constructor(private http: HttpClient, private authService: AuthService) { }

  async loginUser(username: string, password: string) {
    const info = { Username: username, Password: password };
    if (window.location.host.indexOf('localhost') > -1) {
      return this.http.post(this.signinUrl, info).toPromise();
    } else {
      return this.http.get(this.url.replace('users', 'signin')).toPromise();
    }
  }

  async getUser(id: number) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.get(this.localUrl.replace('users', `users/${id}`), httpOptions).pipe(map(u => new User(u))).toPromise();
      } else {
        return this.http.get(this.url.replace('users', `users/${id}`), httpOptions).pipe(map(u => new User(u))).toPromise();
      }
    }
  }

  async createUser(newUser: User) {
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

  async updateUser(id: number, updatedUser: User) {
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

  async updatePassword(data: any) {
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

  async updateProfileImage(avatar: string) {
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


  async deleteUser(id: number) {
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
