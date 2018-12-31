import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';


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
		AssignedEmployee: '',
		Comments: ''
	};
	appointments: any;
	franchises: any;
	editing = false;
	selectedId = '';

	constructor(private appointmentService: AppointmentService, private utilService: UtilService) {
		this.loadFranchises();
	}

	ngOnInit() {
		this.getAppointments();
	}

	getAppointments() {
		this.appointmentService.getAppointments().subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				this.appointments = JSON.parse(JSON.stringify(events.body));
			}
		});
	}

	loadFranchises() {
		this.utilService.processFranchises();
		this.utilService.franchises.subscribe(response => {
			this.franchises = response;
		});
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
		this.getAppointments();
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
			AssignedEmployee: '',
			Comments: ''
		};
		this.editing = false;
		this.selectedId = '';
	}

	deleteAppointment(id) {
		this.appointmentService.deleteAppointment(id).subscribe(res => {
			console.log(`delete: ${res}`);
			if (res === 1) {
				this.getAppointments();
			} else {
				console.log('error deleting');
			}
		});
	}

}
