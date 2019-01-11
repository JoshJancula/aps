import { Component, OnInit, ViewChild } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';
import { MessageService } from '../../services/message.service';
import { AuthService } from 'src/app/services/auth.service';
import { PhonePipe } from 'src/app/phone.pipe';
import * as moment from 'moment';


@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-control-appointment',
	templateUrl: './control-appointment.component.html',
	styleUrls: ['./control-appointment.component.css']
})
export class ControlAppointmentComponent implements OnInit {

	Appointment: any = {
		Date: '',
		Time: '',
		Client: '',
		Location: '',
		ContactPerson: '',
		ContactPersonPhone: '',
		ScheduledBy: '',
		ScheduledById: '',
		AssignedEmployee: '',
		AssignedEmployeeId: '',
		Comments: '',
		FranchiseId: ''
	};
	clients: any;
	appointments = [];
	franchises: any;
	editing = false;
	selectedId = '';
	selectFromClients = false;
	users: any;
	anytime = false;
	searchAppointments = true;
	addAppointment = false;
	showTodays = true;
	searchDate = new Date();
	@ViewChild('calendar') calendar: any;
	@ViewChild('calendar2') calendar2: any;

	// tslint:disable-next-line:max-line-length
	constructor(private phonePipe: PhonePipe, private authService: AuthService, private messagingService: MessageService, private appointmentService: AppointmentService, private utilService: UtilService) {
		this.loadAppointments();
		this.getClients();
		this.loadFranchises();
		this.getUsers();
	}

	ngOnInit() {
	}

	loadAppointments() {
		this.utilService.processAppointments();
		this.utilService.appointments.subscribe(response => {
			this.filterResponse(response);
		});
	}

	filterResponse(res) {
		this.appointments = [];
		res.forEach(app => {
			if (moment(app.Date).format('MM/DD/YY') === moment(this.searchDate).format('MM/DD/YY')) {
				this.appointments.push(app);
			}
		});
	}

	setView() {
		if (this.searchAppointments === true) {
			this.searchAppointments = false;
			this.addAppointment = true;
		} else {
			this.searchAppointments = true;
			this.addAppointment = false;
		}
	}

	getUsers() {
		this.utilService.processUsers();
		this.utilService.users.subscribe(response => {
			this.users = [];
			response.forEach(item => {
				// tslint:disable-next-line:max-line-length
				this.users.push({ Name: item.FirstName + ' ' + item.LastName, Username: item.Username, FirstName: item.FirstName, LastName: item.LastName, Role: item.Role, id: item.id });
			});
		});
	}

	loadFranchises() {
		this.utilService.processFranchises();
		this.utilService.franchises.subscribe(response => {
			this.franchises = response;
		});
	}

	updateLocation(client) {
		this.Appointment.Location = client.StreetAddress + ', ' + client.City + ', ' + client.State + ' ' + client.Zip;
	}

	getClients() {
		this.utilService.processClients();
		this.utilService.clients.subscribe(response => {
			this.clients = response;
		});
	}

	notifySocket() {
		const data = { MessageType: 'update', Action: 'appointments' };
		this.messagingService.sendUpdate(data);
	}

	submitAppointment() {
		if (this.editing === false) {
			this.Appointment.ScheduledBy = this.authService.currentUser.Name;
			this.Appointment.ScheduledById = this.authService.currentUser.id;
			this.appointmentService.createAppointment(this.Appointment).subscribe(res => {
				console.log('response: ', res);
			}, error => {
				console.log('error: ', error);
			});
		} else {
			this.appointmentService.updateAppointment(this.selectedId, this.Appointment).subscribe(res => {
				console.log(res);
			});
		}
		setTimeout(() => this.utilService.processAppointments(), 500);
		setTimeout(() => this.notifySocket(), 500);
		this.clearForm();
	}

	editAppointment(id) {
		this.editing = true;
		this.anytime = false;
		this.searchAppointments = false;
		this.addAppointment = true;
		this.appointmentService.getAppointment(id).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				const data = JSON.parse(JSON.stringify(events.body));
				console.log('app: ', data);
				this.Appointment = data;
				this.selectedId = data.id;
				if (this.Appointment.Time === 'Anytime') {
					this.anytime = true;
				}
			}
		});
	}

	clearForm() {
		this.Appointment = {
			Date: '',
			Time: '',
			Client: '',
			Location: '',
			ContactPerson: '',
			ContactPersonPhone: '',
			ScheduledBy: '',
			ScheduledById: '',
			AssignedEmployee: '',
			AssignedEmployeeId: '',
			Comments: '',
			FranchiseId: ''
		};
		this.editing = false;
		this.anytime = false;
		this.selectedId = '';
	}

	formatPhone() {
		this.Appointment.ContactPersonPhone = this.phonePipe.transform(this.Appointment.ContactPersonPhone);
	}

	deleteAppointment(id) {
		this.appointmentService.deleteAppointment(id).subscribe(res => {
			console.log(`delete: ${res}`);
			if (res === 1) {
				this.clearForm();
				this.utilService.processAppointments();
				this.notifySocket();
			} else {
				console.log('error deleting');
			}
		});
	}

	openCalendar(event) {
		event.preventDefault();
		this.calendar.open();
	}

	openCalendar2(event) {
		event.preventDefault();
		this.calendar2.open();
	}

	renderAppointments() {
	}


	getMinDate() {
		return new Date();
	}

	setTime() {
		if (this.anytime === true) {
			this.Appointment.Time = 'Anytime';
		} else {
			this.Appointment.Time = '';
		}
	}

	formatDate(date) {
		return moment(date).format('MM Do YYYY');
	}

}
