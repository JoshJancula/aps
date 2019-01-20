import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class EmailService {

	constructor(private http: HttpClient) { }

	private url = `https://aps-josh.herokuapp.com/api/email`;
	private localUrl = `http://localhost:8080/api/email`;

	sendInvoice(invoice: any) {
		console.log('sending invoice from sendInvoice, data is: ', invoice);
		if (localStorage.getItem('jwtToken')) {
			console.log('found the token');
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.post(this.localUrl, invoice, httpOptions);
			} else {
				return this.http.post(this.url, invoice, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

}
