import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { PhonePipe } from 'src/app/pipes/phone.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { Appointment } from 'src/app/models/appointment.model';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-appointment-layout',
  templateUrl: './appointment-layout.component.html',
  styleUrls: ['./appointment-layout.component.scss'],
})

export class AppointmentLayoutComponent implements OnInit, OnDestroy {

  @ViewChild('calendar', null) calendar: any;
  @ViewChild('calendar2', null) calendar2: any;
  @Input() searchDate: string = new Date().toISOString();
  public Appointment = new Appointment();
  public clients: Client[] = [];
  public appointments: Appointment[] = [];
  public franchises: any;
  public editing: boolean = false;
  public selectedId: any = null;
  public selectFromClients: boolean = false;
  public users: any = [];
  public anytime: boolean = false;
  public searchAppointments: boolean = true;
  public addAppointment: boolean = false;
  public showTodays: boolean = true;
  public cordova: boolean = false;
  public subscriptions: Subscription[] = [];

  constructor(
    private launchNavigator: LaunchNavigator,
    private subService: SubscriptionsService,
    private phonePipe: PhonePipe,
    private authService: AuthService,
    private messagingService: MessageService,
    private appointmentService: AppointmentService,
    private utilService: UtilService) { }

  ngOnInit(): void {
    this.loadAppointments();
    this.getClients();
    this.loadFranchises();
    this.getUsers();
  }

  ngOnDestroy(): void {
    console.log('destroy lifecycle called');
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  private loadAppointments(): void {
    this.subService.processAppointments();
    this.subscriptions.push(
      this.subService.appointments.subscribe((response: Appointment[]) => {
        this.filterResponse(response);
      }));
  }

  private filterResponse(res: Appointment[]): void {
    this.appointments = [];
    res.forEach(app => {
      if (moment(app.Date).format('MM/DD/YY') === moment(this.searchDate).format('MM/DD/YY')) {
        this.appointments.push(app);
      } else if (moment(app.Date).isBefore(moment(new Date().toISOString()))) {
        this.appointmentService.deleteAppointment(app.id).then(response => { console.log('res deleting old appointment: ', response); });
      }
    });
  }

  public getDirections(address: any): void {
    if ((<any>window).deviceReady === true) {
      this.launchNavigator.navigate(address.Location);
    }
  }

  public setView(): void {
    if (this.searchAppointments === true) {
      this.searchAppointments = false;
      this.addAppointment = true;
    } else {
      this.searchAppointments = true;
      this.addAppointment = false;
    }
  }

  public getUsers(): void {
    this.subService.processUsers();
    this.subscriptions.push(
      this.subService.users.subscribe(response => {
        this.users = [];
        response.forEach(item => {
          this.users.push({ Name: item.FirstName + ' ' + item.LastName, Username: item.Username, FirstName: item.FirstName, LastName: item.LastName, Role: item.Role, id: item.id });
        });
      }));
  }

  private loadFranchises(): void {
    if (this.authService.currentUser.Role === 'Super') {
      this.subService.processFranchises();
      this.subscriptions.push(
        this.subService.franchises.subscribe(response => {
          this.franchises = response;
        }));
    }
  }

  public updateLocation(client: Client): void {
    this.Appointment.Location = client.Address;
  }

  private getClients(): void {
    this.subService.processClients();
    this.subscriptions.push(
      this.subService.clients.subscribe((response: Client[]) => {
        this.clients = response;
      }));
  }

  private notifySocket(): void {
    const data = { Franchise: this.authService.currentUser.FranchiseId, MessageType: 'update', Action: 'appointments' };
    this.messagingService.sendUpdate(data);
  }

  public submitAppointment(): void {
    if (this.editing === false) {
      this.Appointment.FranchiseId = this.authService._franchiseInfo.id;
      this.Appointment.ScheduledBy = this.authService.currentUser.Name;
      this.Appointment.ScheduledById = this.authService.currentUser.id;
      this.appointmentService.createAppointment(this.Appointment).then(res => {
        this.appointmentSuccess();
      }).catch(error => {
        this.utilService.alertError(`error submitting appointment: ${error}`);
      });
    } else {
      this.appointmentService.updateAppointment(this.selectedId, this.Appointment).then(res => {
        console.log(res);
        this.appointmentSuccess();
      }).catch(error => {
        this.utilService.alertError(`error submitting appointment: ${error}`);
      });
    }
  }

  private appointmentSuccess(): void {
    setTimeout(() => this.subService.processAppointments(), 500);
    setTimeout(() => this.notifySocket(), 500);
    this.clearForm();
    this.setView();
  }

  public editAppointment(data: Appointment): void {
    this.editing = true;
    this.anytime = false;
    this.searchAppointments = false;
    this.addAppointment = true;
    this.Appointment = new Appointment(data);
    this.selectedId = data.id;
    if (this.Appointment.Time === 'Anytime') {
      this.anytime = true;
    }
  }

  public clearForm(): void {
    this.Appointment = new Appointment();
    this.editing = false;
    this.anytime = false;
    this.selectedId = '';
  }

  public formatPhone(): void {
    this.Appointment.ContactPersonPhone = this.phonePipe.transform(this.Appointment.ContactPersonPhone);
  }

  public deleteAppointment(id: number): void {
    this.appointmentService.deleteAppointment(id).then(res => {
      if (res === 1) {
        this.clearForm();
        this.subService.processAppointments();
        this.notifySocket();
      } else {
        console.log('error deleting');
      }
    }).catch(error => {
      this.utilService.alertError(`error submitting appointment: ${error}`);
    });
  }

  public openCalendar(event: any): void {
    event.preventDefault();
    this.calendar.open();
  }

  public getMinDate(): Date {
    return new Date();
  }

  public setTime(): void {
    if (this.anytime === true) {
      this.Appointment.Time = 'Anytime';
    } else {
      this.Appointment.Time = '';
    }
  }

  public formatDate(date: any): string {
    const temp = new Date().toISOString();
    const newTemp = moment(temp).format('MM/DD/YYYY');
    if (moment(newTemp).isSame(moment(date).format('MM/DD/YYYY'))) {
      return 'Today';
    } else {
      return moment(date).format('dddd, MMMM Do YYYY');
    }
  }

}
