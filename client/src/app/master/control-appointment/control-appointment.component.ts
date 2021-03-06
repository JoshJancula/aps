import { Component, OnInit, ViewChild } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';
import { MessageService } from '../../services/message.service';
import { AuthService } from 'src/app/services/auth.service';
import { PhonePipe } from 'src/app/phone.pipe';
import * as moment from 'moment';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

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
		FranchiseId: this.authService.currentUser.FranchiseId
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
	cordova = false;
	@ViewChild('calendar') calendar: any;
	@ViewChild('calendar2') calendar2: any;

	// tslint:disable-next-line:max-line-length
	constructor(private launchNavigator: LaunchNavigator, private subService: SubscriptionsService, private phonePipe: PhonePipe, private authService: AuthService, private messagingService: MessageService, private appointmentService: AppointmentService, private utilService: UtilService) {
	}

	ngOnInit() {
		this.loadAppointments();
		this.getClients();
		this.loadFranchises();
		this.getUsers();
		if ((<any>window).deviceReady === true) {
			this.cordova = true;
		}
	}

	loadAppointments() {
		this.subService.processAppointments();
		this.subService.appointments.subscribe(response => {
			this.filterResponse(response);
		});
	}

	filterResponse(res) {
		this.appointments = [];
		res.forEach(app => {
			if (moment(app.Date).format('MM/DD/YY') === moment(this.searchDate).format('MM/DD/YY')) {
				this.appointments.push(app);
			} else if (moment(app.Date).isBefore(moment(new Date))) {
				this.appointmentService.deleteAppointment(app.id).subscribe(response => { console.log('res deleting old appointment: ', response); });
			}
		});
	}

	getDirections(address) {
		if ((<any>window).deviceReady === true) {
			this.launchNavigator.navigate(address.Location);
		}
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
		this.subService.processUsers();
		this.subService.users.subscribe(response => {
			this.users = [];
			response.forEach(item => {
				// tslint:disable-next-line:max-line-length
				this.users.push({ Name: item.FirstName + ' ' + item.LastName, Username: item.Username, FirstName: item.FirstName, LastName: item.LastName, Role: item.Role, id: item.id });
			});
		});
	}

	loadFranchises() {
		if (this.authService.currentUser.Role === 'Super') {
			this.subService.processFranchises();
			this.subService.franchises.subscribe(response => {
				this.franchises = response;
			});
		}
	}

	updateLocation(client) {
		this.Appointment.Location = client.Address;
	}

	getClients() {
		this.subService.processClients();
		this.subService.clients.subscribe(response => {
			this.clients = response;
		});
	}

	notifySocket() {
		const data = { Franchise: this.authService.currentUser.FranchiseId, MessageType: 'update', Action: 'appointments' };
		this.messagingService.sendUpdate(data);
	}

	submitAppointment() {
		if ((<any>window).deviceReady === true) {
			(<any>window).Keyboard.hide();
		}
		if (this.editing === false) {
			this.Appointment.ScheduledBy = this.authService.currentUser.Name;
			this.Appointment.ScheduledById = this.authService.currentUser.id;
			this.appointmentService.createAppointment(this.Appointment).subscribe(res => {
				console.log('response: ', res);
			}, error => {
				this.utilService.alertError(`error submitting appointment: ${error}`);
			});
		} else {
			this.appointmentService.updateAppointment(this.selectedId, this.Appointment).subscribe(res => {
				console.log(res);
			});
		}
		setTimeout(() => this.subService.processAppointments(), 500);
		setTimeout(() => this.notifySocket(), 500);
		this.clearForm();
		this.setView();
	}

	editAppointment(data) {
		this.editing = true;
		this.anytime = false;
		this.searchAppointments = false;
		this.addAppointment = true;
		this.Appointment = data;
		this.selectedId = data.id;
		if (this.Appointment.Time === 'Anytime') {
			this.anytime = true;
		}
	}

	clearForm() {
		if ((<any>window).deviceReady === true) {
			(<any>window).Keyboard.hide();
		}
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
			FranchiseId: this.authService.currentUser.FranchiseId
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
				this.subService.processAppointments();
				this.notifySocket();
			} else {
				console.log('error deleting');
			}
		});
	}

	openCalendar(event) {
		if ((<any>window).deviceReady === true) {
			(<any>window).Keyboard.hide();
		}
		event.preventDefault();
		this.calendar.open();
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
		let temp = new Date();
		let newTemp = moment(temp).format('MM/DD/YYYY');
		if (moment(newTemp).isSame(moment(date).format('MM/DD/YYYY'))) {
			return 'Today';
		} else {
			return moment(date).format('dddd, MMMM Do YYYY');
		}
	}

}
