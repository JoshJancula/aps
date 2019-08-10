import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Timecard } from '../models/timecard.model';

@Injectable({
  providedIn: 'root'
})
export class TimecardService {

  constructor(private http: HttpClient) { }

  async createTimecard(newTimecard: Timecard) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        const localUrl = `http://localhost:8080/api/timecards`;
        return this.http.post(localUrl, newTimecard, httpOptions).toPromise();
      } else {
        const url = `https://aps-josh.herokuapp.com/api/timecards`;
        return this.http.post(url, newTimecard, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async getTodaysTimecards(id: number) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        const localUrl = `http://localhost:8080/api/timecards/employee/today/${id}`;
        return this.http.get(localUrl, httpOptions).toPromise();
      } else {
        const url = `https://aps-josh.herokuapp.com/api/timecards/employee/today/${id}`;
        return this.http.get(url, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async getRangeTimecards(params: any) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        const localUrl = `http://localhost:8080/api/timecards/employee/all/${params.EmployeeId}`;
        return this.http.post(localUrl, params, httpOptions).toPromise();
      } else {
        const url = `https://aps-josh.herokuapp.com/api/timecards/employee/all/${params.EmployeeId}`;
        return this.http.post(url, params, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async updateTimecard(id: number, updatedTimecard: any) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        const localUrl = `http://localhost:8080/api/timecards/${id}`;
        return this.http.put(localUrl, updatedTimecard, httpOptions).toPromise();
      } else {
        const url = `https://aps-josh.herokuapp.com/api/timecards/${id}`;
        return this.http.put(url, updatedTimecard, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async deleteTimeCard(id: number) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        const localUrl = `http://localhost:8080/api/timecards/${id}`;
        return this.http.delete(localUrl, httpOptions).toPromise();
      } else {
        const url = `https://aps-josh.herokuapp.com/api/timecards/${id}`;
        return this.http.delete(url, httpOptions).toPromise();
      }
    }
  }


}
