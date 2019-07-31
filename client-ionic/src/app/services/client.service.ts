import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  private url = `https://aps-josh.herokuapp.com/api/clients`;
  private localUrl = `http://localhost:8080/api/clients`;

  async createClient(newClient: string) {
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

  async getClients() {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.get(this.localUrl, httpOptions).toPromise();
      } else {
        return this.http.get(this.url, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async getClient(id) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.get(this.localUrl.replace('clients', `clients/${id}`), httpOptions).toPromise();
      } else {
        return this.http.get(this.url.replace('clients', `clients/${id}`), httpOptions).toPromise();
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

  async updateClient(id, updatedClient) {
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
