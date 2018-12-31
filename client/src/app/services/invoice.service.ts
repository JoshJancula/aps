import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class InvoiceService {

	constructor(private http: HttpClient) { }

	private url = `https://aps-josh.herokuapp.com/api/invoices`;
	private localUrl = `http://localhost:8080/api/invoices`;

	createInvoice(newInvoice: string) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.post(this.localUrl, newInvoice, httpOptions);
			} else {
				return this.http.post(this.url, newInvoice, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	getInvoices() {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.get(this.localUrl, httpOptions);
			} else {
				return this.http.get(this.url, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	getInvoice(id) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.get(this.localUrl.replace('invoices', `invoices/${id}?`), httpOptions);
			} else {
				return this.http.get(this.url.replace('invoices', `invoices/${id}?`), httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	deleteInvoice(id) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.delete(this.localUrl.replace('invoices', `invoices/${id}?`), httpOptions);
			} else {
				return this.http.delete(this.url.replace('invoices', `invoices/${id}?`), httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	updateInvoice(id) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.put(this.localUrl.replace('invoices', `invoices/${id}?`), httpOptions);
			} else {
				return this.http.put(this.url.replace('invoices', `invoices/${id}?`), httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

}
