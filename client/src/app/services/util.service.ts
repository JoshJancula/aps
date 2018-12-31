import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class UtilService {

	constructor(private http: HttpClient) { }

	// tslint:disable-next-line:max-line-length
	states = ['AL', 'AK', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NC', 'ND', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
	franchises: any;

	getFranchises() {
		const url = `https://aps-josh.herokuapp.com/api/franchises`;
	const localUrl = `http://localhost:8080/api/franchises`;
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
}
