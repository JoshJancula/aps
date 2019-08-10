import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Appointment } from '../models/appointment.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  private url = `https://aps-josh.herokuapp.com/api/appointments`;
  private localUrl = `http://localhost:8080/api/appointments`;

  async createAppointment(newAppointment: Appointment) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.post(this.localUrl, newAppointment, httpOptions).toPromise();
      } else {
        return this.http.post(this.url, newAppointment, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async getAppointment(id: number) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.get(this.localUrl.replace('appointments', `appointments/${id}`), httpOptions).pipe(map(a => new Appointment(a))).toPromise();
      } else {
        return this.http.get(this.url.replace('appointments', `appointments/${id}`), httpOptions).pipe(map(a => new Appointment(a))).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async deleteAppointment(id: number) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.delete(this.localUrl.replace('appointments', `appointments/${id}`), httpOptions).toPromise();
      } else {
        return this.http.delete(this.url.replace('appointments', `appointments/${id}`), httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  async updateAppointment(id: number, updatedAppointment: Appointment) {
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        })
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.put(this.localUrl.replace('appointments', `appointments/${id}`), updatedAppointment, httpOptions).toPromise();
      } else {
        return this.http.put(this.url.replace('appointments', `appointments/${id}`), updatedAppointment, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

}
