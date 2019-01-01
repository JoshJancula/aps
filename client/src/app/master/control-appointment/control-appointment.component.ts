import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';
import { MessageService } from '../../services/message.service';

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
		Comments: '',
		FranchiseId: ''
	};
	clients: any;
	appointments: any;
	franchises: any;
	editing = false;
	selectedId = '';
	selectFromClients = false;

	constructor(private messagingService: MessageService, private appointmentService: AppointmentService, private utilService: UtilService) {
		this.loadAppointments();
		this.getClients();
		this.loadFranchises();
	}

	ngOnInit() {
	}

	loadAppointments() {
		this.utilService.processAppointments();
		this.utilService.appointments.subscribe(response => {
			this.appointments = response;
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
		this.utilService.processAppointments();
		this.notifySocket();
		this.clearForm();
	}

	editAppointment(id) {
		this.editing = true;
		this.appointmentService.getAppointment(id).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				const data = JSON.parse(JSON.stringify(events.body));
				this.Appointment = data;
				this.selectedId = data.id;
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
			Comments: '',
			FranchiseId: ''
		};
		this.editing = false;
		this.selectedId = '';
	}

	deleteAppointment(id) {
		this.appointmentService.deleteAppointment(id).subscribe(res => {
			console.log(`delete: ${res}`);
			if (res === 1) {
				this.utilService.processAppointments();
				this.notifySocket();
			} else {
				console.log('error deleting');
			}
		});
	}

}
