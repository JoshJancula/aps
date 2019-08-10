import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Franchise } from '../models/franchise.model';
import { Client } from '../models/client.model';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {
    this.authService.loginStatus.subscribe(res => {
      if (res === false) { this.clearData(); }
    });
  }

  private userStore: User[] = [];
  private userSubject = new BehaviorSubject(this.userStore);
  public users: Observable<User[]> = this.userSubject.asObservable();
  private franchiseStore: Franchise[] = [];
  private franchiseSubject = new BehaviorSubject(this.franchiseStore);
  public franchises: Observable<Franchise[]> = this.franchiseSubject.asObservable();
  private clientStore: Client[] = [];
  private clientSubject = new BehaviorSubject(this.clientStore);
  public clients: Observable<Client[]> = this.clientSubject.asObservable();
  private appointmentStore: Appointment[] = [];
  private appointmentSubject = new BehaviorSubject(this.appointmentStore);
  public appointments: Observable<Appointment[]> = this.appointmentSubject.asObservable();
  private invoiceStore = [];
  private invoiceSubject = new BehaviorSubject(this.invoiceStore);
  public invoices = this.invoiceSubject.asObservable();

  private clearData() {
    this.invoiceStore = [];
    this.userStore = [];
    this.franchiseStore = [];
    this.appointmentStore = [];
    this.clientStore = [];
    this.router.navigate([`/`], {});
  }

  async getFranchises() {
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
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.get(localUrl, httpOptions).toPromise();
      } else {
        return this.http.get(url, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  public processFranchises() {
    this.getFranchises().then((events) => {
      if (events.type === HttpEventType.Response) {
        this.franchiseStore = (<any>events).body.map(f => new Franchise(f));
        this.franchiseSubject.next(this.franchiseStore);
      }
    }, error => {
      if (error.status === 401) { this.clearData(); }
    });
  }

  async getUsers() {
    const url = `https://aps-josh.herokuapp.com/api/users/${this.authService.currentUser.FranchiseId}`;
    const localUrl = `http://localhost:8080/api/users/${this.authService.currentUser.FranchiseId}`;
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.get(localUrl, httpOptions).toPromise();
      } else {
        return this.http.get(url, httpOptions).toPromise();
      }
    }
  }

  public processUsers() {
    this.getUsers().then((events) => {
      if (events.type === HttpEventType.Response) {
        this.userStore = (<any>events).body.map(u => new User(u));
        this.userSubject.next(this.userStore);
      }
    }, error => {
      if (error.status === 401) { this.clearData(); }
    });
  }

  async getClients() {
    const url = `https://aps-josh.herokuapp.com/api/clients/${this.authService.currentUser.FranchiseId}`;
    const localUrl = `http://localhost:8080/api/clients/${this.authService.currentUser.FranchiseId}`;
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.get(localUrl, httpOptions).toPromise();
      } else {
        return this.http.get(url, httpOptions).toPromise();
      }
    }
  }

  public processClients() {
    this.getClients().then((events) => {
      if ((<any>events).type === HttpEventType.Response) {
        this.clientStore = (<any>events).body.map(c => new Client(c));
        this.clientSubject.next(this.clientStore);
      }
    }, error => {
      if (error.status === 401) { this.clearData(); }
    });
  }

  async getAppointments() {
    let url;
    let localUrl;
    url = `https://aps-josh.herokuapp.com/api/appointments/sub/${this.authService.currentUser.FranchiseId}`;
    localUrl = `http://localhost:8080/api/appointments/sub/${this.authService.currentUser.FranchiseId}`;
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.get(localUrl, httpOptions).toPromise();
      } else {
        return this.http.get(url, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  public processAppointments() {
    this.getAppointments().then((events) => {
      if ((<any>events).type === HttpEventType.Response) {
        this.appointmentStore = (<any>events).body.map(a => new Appointment(a));
        this.appointmentSubject.next(this.appointmentStore);
      }
    }, error => {
      if (error.status === 401) { this.clearData(); }
    });
  }

  async getInvoices(filter) {
    const url = `https://aps-josh.herokuapp.com/api/invoices/sub/`;
    const localUrl = `http://localhost:8080/api/invoices/sub/`;
    if (localStorage.getItem('jwtToken')) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken'),
        }),
        reportProgress: true,
        observe: 'events' as 'events'
      };
      if (window.location.host.indexOf('localhost') > -1) {
        return this.http.post(localUrl, filter, httpOptions).toPromise();
      } else {
        return this.http.post(url, filter, httpOptions).toPromise();
      }
    } else {
      console.log('no token found');
    }
  }

  public processInvoices(filter) {
    this.getInvoices(filter).then((events) => {
      this.invoiceStore = JSON.parse(JSON.stringify(events));
      this.invoiceSubject.next(this.invoiceStore);
    }, error => {
      if (error.status === 401) { this.clearData(); }
    });
  }


}
