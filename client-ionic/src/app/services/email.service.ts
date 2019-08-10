import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  private url = `https://aps-josh.herokuapp.com/api/email`;
  private localUrl = `http://localhost:8080/api/email`;

  async sendInvoice(invoice: any) {
    const msg = {
      to: 'joshjancula@gmail.com',
      from: this.authService._franchiseInfo.Email,
      subject: 'Automated test invoice from APS',
      html: invoice.toString(),
    };

    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.post(this.localUrl, msg, httpOptions).toPromise();
      } else {
        return this.http.post(this.url, msg, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

}
