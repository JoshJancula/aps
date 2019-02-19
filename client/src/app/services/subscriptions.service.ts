import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class SubscriptionsService {

	constructor(private router: Router, private authService: AuthService, private http: HttpClient) {
		this.authService.loginStatus.subscribe(res => {
			if (res === false) { this.clearData(); }
		});
	}

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

	clearData() {
		this.invoiceStore = [];
		this.userStore = [];
		this.franchiseStore = [];
		this.appointmentStore = [];
		this.clientStore = [];
		this.router.navigate([`/`], {});
	}

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
		}, error => {
			if (error.status === 401) { this.clearData(); }
		});
	}

	getUsers() {
		const url = `https://aps-josh.herokuapp.com/api/users/${this.authService.currentUser.FranchiseId}`;
		const localUrl = `http://localhost:8080/api/users/${this.authService.currentUser.FranchiseId}`;
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
		}, error => {
			if (error.status === 401) { this.clearData(); }
		});
	}

	getClients() {
		const url = `https://aps-josh.herokuapp.com/api/clients/${this.authService.currentUser.FranchiseId}`;
		const localUrl = `http://localhost:8080/api/clients/${this.authService.currentUser.FranchiseId}`;
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
		}, error => {
			if (error.status === 401) { this.clearData(); }
		});
	}

	getAppointments() {
		let url;
		let localUrl;
		url = `https://aps-josh.herokuapp.com/api/appointments/sub/${this.authService.currentUser.FranchiseId}`;
		localUrl = `http://localhost:8080/api/appointments/sub/${this.authService.currentUser.FranchiseId}`;
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
		}, error => {
			if (error.status === 401) { this.clearData(); }
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
		}, error => {
			if (error.status === 401) { this.clearData(); }
		});
	}


}
