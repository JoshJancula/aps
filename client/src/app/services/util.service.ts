import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
	providedIn: 'root'
})
export class UtilService {

	constructor(private authService: AuthService, private http: HttpClient) { }

	states = ['AL', 'AK', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NC', 'ND', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
	private userStore = [];
	private userSubject = new BehaviorSubject(this.userStore);
	users = this.userSubject.asObservable();
	private franchiseStore = [];
	private franchiseSubject = new BehaviorSubject(this.franchiseStore);
	franchises = this.franchiseSubject.asObservable();
	private clientStore = [];
	private clientSubject = new BehaviorSubject(this.clientStore);
	clients = this.clientSubject.asObservable();
	private appointmentStore = [];
	private appointmentSubject = new BehaviorSubject(this.appointmentStore);
	appointments = this.appointmentSubject.asObservable();
	private invoiceStore = [];
	private invoiceSubject = new BehaviorSubject(this.invoiceSubject);
	invoices = this.invoiceSubject.asObservable();


	getFranchises() {
		let url;
		let localUrl;
		if (this.authService.currentUser.Role === 'Super') {
			url = `https://aps-josh.herokuapp.com/api/franchises`;
			localUrl = `http://localhost:8080/api/franchises`;
		} else {
			url = `https://aps-josh.herokuapp.com/api/franchises`;
			localUrl = `http://localhost:8080/api/franchises`;
		}
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				}),
				reportProgress: true,
				observe: 'events' as 'events'
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.get(localUrl, httpOptions);
			} else {
				return this.http.get(url, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	processFranchises() {
		this.getFranchises().subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				this.franchiseStore = JSON.parse(JSON.stringify(events.body));
				this.franchiseSubject.next(this.franchiseStore);
			}
		});
	}

	getUsers() {
		const url = `https://aps-josh.herokuapp.com/api/users`;
		const localUrl = `http://localhost:8080/api/users`;
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				}),
				reportProgress: true,
				observe: 'events' as 'events'
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.get(localUrl, httpOptions);
			} else {
				return this.http.get(url, httpOptions);
			}
		}
	}

	processUsers() {
		this.getUsers().subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				this.userStore = JSON.parse(JSON.stringify(events.body));
				this.userSubject.next(this.userStore);
			}
		});
	}

	getClients() {
		const url = `https://aps-josh.herokuapp.com/api/clients`;
		const localUrl = `http://localhost:8080/api/clients`;
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				}),
				reportProgress: true,
				observe: 'events' as 'events'
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.get(localUrl, httpOptions);
			} else {
				return this.http.get(url, httpOptions);
			}
		}
	}

	processClients() {
		this.getClients().subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				this.clientStore = JSON.parse(JSON.stringify(events.body));
				this.clientSubject.next(this.clientStore);
			}
		});
	}

	getAppointments() {
		let url;
		let localUrl;
		// if (this.authService.currentUser.Role === 'Super') {
		//  url = `https://aps-josh.herokuapp.com/api/appointments`;
		//  localUrl = `http://localhost:8080/api/appointments`;
		// } else {
		url = `https://aps-josh.herokuapp.com/api/appointments/sub/${this.authService.currentUser.FranchiseId}`;
		localUrl = `http://localhost:8080/api/appointments/sub/${this.authService.currentUser.FranchiseId}`;
		// }
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				}),
				reportProgress: true,
				observe: 'events' as 'events'
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.get(localUrl, httpOptions);
			} else {
				return this.http.get(url, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	processAppointments() {
		this.getAppointments().subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				this.appointmentStore = JSON.parse(JSON.stringify(events.body));
				this.appointmentSubject.next(this.appointmentStore);
			}
		});
	}

	getInvoices(filter) {
		const url = `https://aps-josh.herokuapp.com/api/invoices/sub/`;
		const localUrl = `http://localhost:8080/api/invoices/sub/`;
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				}),
				reportProgress: true,
				observe: 'events' as 'events'
			};
			if (window.location.host === 'localhost:4200') {
				return this.http.post(localUrl, filter, httpOptions);
			} else {
				return this.http.post(url, filter, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	processInvoices(filter) {
		this.getInvoices(filter).subscribe((events) => {
			this.invoiceStore = JSON.parse(JSON.stringify(events));
			this.invoiceSubject.next(this.invoiceStore);
		});
	}


}
