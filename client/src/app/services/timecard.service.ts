import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimecardService {

  constructor(private http: HttpClient) { }

	createTimecard(newTimecard) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host.indexOf('localhost') > -1) {
				const localUrl = `http://localhost:8080/api/timecards`;
				return this.http.post(localUrl, newTimecard, httpOptions);
			} else {
				const url = `https://aps-josh.herokuapp.com/api/timecards`;
				return this.http.post(url, newTimecard, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	getTodaysTimecards(id) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host.indexOf('localhost') > -1) {
				const localUrl = `http://localhost:8080/api/timecards/employee/today/${id}`;
				return this.http.get(localUrl, httpOptions);
			} else {
				const url = `https://aps-josh.herokuapp.com/api/timecards/employee/today/${id}`;
				return this.http.get(url, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	getRangeTimecards(params) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				}),
				reportProgress: true,
				observe: 'events' as 'events'
			};
			if (window.location.host.indexOf('localhost') > -1) {
				const localUrl = `http://localhost:8080/api/timecards/employee/all/${params.EmployeeId}`;
				return this.http.post(localUrl, params, httpOptions);
			} else {
				const url = `https://aps-josh.herokuapp.com/api/timecards/employee/all/${params.EmployeeId}`;
				return this.http.post(url, params, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	updateTimecard(id, updatedTimecard) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host.indexOf('localhost') > -1) {
				const localUrl = `http://localhost:8080/api/timecards/${id}`;
				return this.http.put(localUrl, updatedTimecard, httpOptions);
			} else {
				const url = `https://aps-josh.herokuapp.com/api/timecards/${id}`;
				return this.http.put(url, updatedTimecard, httpOptions);
			}
		} else {
			console.log('no token found');
		}
	}

	deleteTimeCard(id: string) {
		if (localStorage.getItem('jwtToken')) {
			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': localStorage.getItem('jwtToken'),
				})
			};
			if (window.location.host.indexOf('localhost') > -1) {
				const localUrl = `http://localhost:8080/api/timecards/${id}`;
				return this.http.delete(localUrl, httpOptions);
			} else {
				const url = `https://aps-josh.herokuapp.com/api/timecards/${id}`;
				return this.http.delete(url, httpOptions);
			}
		}
	}


}
