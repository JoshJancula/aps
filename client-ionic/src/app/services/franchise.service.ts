import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Franchise } from '../models/franchise.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FranchiseService {

  constructor(private http: HttpClient) { }

  private url = `https://aps-josh.herokuapp.com/api/franchises`;
  private localUrl = `http://localhost:8080/api/franchises`;

  async createFranchise(newFranchise: Franchise) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.post(this.localUrl, newFranchise, httpOptions).toPromise();
      } else {
        return this.http.post(this.url, newFranchise, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async getFranchise(id: number) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.get(this.localUrl.replace('franchises', `franchises/${id}`), httpOptions).pipe(map(f => new Franchise(f))).toPromise();
      } else {
        return this.http.get(this.url.replace('franchises', `franchises/${id}`), httpOptions).pipe(map(f => new Franchise(f))).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async deleteFranchise(id: number) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.delete(this.localUrl.replace('franchises', `franchises/${id}`), httpOptions).toPromise();
      } else {
        return this.http.delete(this.url.replace('franchises', `franchises/${id}`), httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async updateFranchise(id: number, updatedFranchise: Franchise) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.put(this.localUrl.replace('franchises', `franchises/${id}`), updatedFranchise, httpOptions).toPromise();
      } else {
        return this.http.put(this.url.replace('franchises', `franchises/${id}`), updatedFranchise, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

}
