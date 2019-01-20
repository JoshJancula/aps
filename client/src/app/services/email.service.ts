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

		console.log('invoice inside sendInvoice: ', invoice);
		const msg = {
			to: 'josh@jancula.com',
			from: 'test@example.com',
			subject: 'Test invoice',
			html: invoice.toString(),
		};

		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.post(this.localUrl, msg, httpOptions);
			} else {
				return this.http.post(this.url, msg, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

}
