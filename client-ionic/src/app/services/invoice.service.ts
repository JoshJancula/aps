import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Invoice } from '../models/invoice.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  private url = `https://aps-josh.herokuapp.com/api/invoices`;
  private localUrl = `http://localhost:8080/api/invoices`;

  async createInvoice(newInvoice: Invoice) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.post(this.localUrl, newInvoice, httpOptions).toPromise();
      } else {
        return this.http.post(this.url, newInvoice, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async getInvoice(id: number) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.get(this.localUrl.replace('invoices', `invoices/${id}`), httpOptions).pipe(map(i => new Invoice(i))).toPromise();
      } else {
        return this.http.get(this.url.replace('invoices', `invoices/${id}`), httpOptions).pipe(map(i => new Invoice(i))).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async deleteInvoice(id: number) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.delete(this.localUrl.replace('invoices', `invoices/${id}`), httpOptions).toPromise();
      } else {
        return this.http.delete(this.url.replace('invoices', `invoices/${id}`), httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async updateInvoice(id: number, updatedInvoice: Invoice) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.put(this.localUrl.replace('invoices', `invoices/${id}`), updatedInvoice, httpOptions).toPromise();
      } else {
        return this.http.put(this.url.replace('invoices', `invoices/${id}`), updatedInvoice, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async addInvoiceSignature(data: any) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.put(this.localUrl.replace('invoices', `invoices/signature/${data.id}`), data, httpOptions).toPromise();
      } else {
        return this.http.put(this.url.replace('invoices', `invoices/signature/${data.id}`), data, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

}
