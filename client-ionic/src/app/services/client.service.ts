import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Client } from '../models/client.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  private url = `https://aps-josh.herokuapp.com/api/clients`;
  private localUrl = `http://localhost:8080/api/clients`;

  async createClient(newClient: Client) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.post(this.localUrl, newClient, httpOptions).toPromise();
      } else {
        return this.http.post(this.url, newClient, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async getClient(id: number) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.get(this.localUrl.replace('clients', `clients/${id}`), httpOptions).pipe(map(c => new Client(c))).toPromise();
      } else {
        return this.http.get(this.url.replace('clients', `clients/${id}`), httpOptions).pipe(map(c => new Client(c))).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async deleteClient(id) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.delete(this.localUrl.replace('clients', `clients/${id}`), httpOptions).toPromise();
      } else {
        return this.http.delete(this.url.replace('clients', `clients/${id}`), httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async updateClient(id: number, updatedClient: Client) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.put(this.localUrl.replace('clients', `clients/${id}`), updatedClient, httpOptions).toPromise();
      } else {
        return this.http.put(this.url.replace('clients', `clients/${id}`), updatedClient, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

}
