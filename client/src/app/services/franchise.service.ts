import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class FranchiseService {

	constructor(private http: HttpClient) { }

	private url = `https://aps-josh.herokuapp.com/api/franchises`;
	private localUrl = `http://localhost:8080/api/franchises`;

	createFranchise(newFranchise: string) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host.indexOf('localhost') > -1) {
				return this.http.post(this.localUrl, newFranchise, httpOptions);
			} else {
				return this.http.post(this.url, newFranchise, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	getFranchises() {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				}),
				reportProgress: true,
				observe: 'events' as 'events'
			};
			if (window.location.host.indexOf('localhost') > -1) {
				return this.http.get(this.localUrl, httpOptions);
			} else {
				return this.http.get(this.url, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	getFranchise(id) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				}),
				reportProgress: true,
				observe: 'events' as 'events'
			};
			if (window.location.host.indexOf('localhost') > -1) {
				return this.http.get(this.localUrl.replace('franchises', `franchises/${id}`), httpOptions);
			} else {
				return this.http.get(this.url.replace('franchises', `franchises/${id}`), httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	deleteFranchise(id) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host.indexOf('localhost') > -1) {
				return this.http.delete(this.localUrl.replace('franchises', `franchises/${id}`), httpOptions);
			} else {
				return this.http.delete(this.url.replace('franchises', `franchises/${id}`), httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	updateFranchise(id, updatedFranchise) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host.indexOf('localhost') > -1) {
				return this.http.put(this.localUrl.replace('franchises', `franchises/${id}`), updatedFranchise, httpOptions);
			} else {
				return this.http.put(this.url.replace('franchises', `franchises/${id}`), updatedFranchise, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

}
