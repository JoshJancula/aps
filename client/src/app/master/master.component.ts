import { Component, OnInit, ViewChild } from '@angular/core';
import { ControlUserComponent } from './control-user/control-user.component';
import { ControlFranchiseComponent } from './control-franchise/control-franchise.component';
import { ControlClientComponent } from './control-client/control-client.component';
import { ControlAppointmentComponent } from './control-appointment/control-appointment.component';
import { UtilService } from '../services/util.service';
import { HttpEventType } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-master',
	templateUrl: './master.component.html',
	styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {

	userMode = true;
	franchiseMode = false;
	clientMode = false;
	appointmentMode = false;
	invoiceMode = false;
	messageConnection: any;
	updateConnection: any;
	@ViewChild('controlUser') controlUser: ControlUserComponent;
	@ViewChild('controlFranchise') controlFranchise: ControlFranchiseComponent;
	@ViewChild('controlClient') controlClient: ControlClientComponent;
	@ViewChild('controlAppointment') controlAppointment: ControlAppointmentComponent;
	// tslint:disable-next-line:max-line-length
	constructor(private authService: AuthService, private utilService: UtilService, private userService: UserService, private messagingService: MessageService) { }

	ngOnInit() {
		this.messagingService.initSocket();
			this.messageConnection = this.messagingService.onMessage().subscribe((response: any) => {
				console.log('socket response: ', response);
			});
			this.subscribeToUpdates();
		setTimeout(() => this.sendConnectionMessage(), 500);
	}

	sendConnectionMessage() {
		const message = {
			AuthorId: this.authService.currentUser.id,
			MessageType: 'connect',
		};
		this.messagingService.sendConnectionInfo(message);
	}

	subscribeToUpdates() {
		this.updateConnection = this.messagingService.onUpdate().subscribe((response: any) => {
			console.log('response: ', response);
			this.processUpdate(response.Action);
		});
	}

	processUpdate(action) {
		switch (action) {
			case 'updateClients': this.utilService.processClients(); break;
			case 'updateFranchises': this.utilService.processFranchises(); break;
			case 'updateUsers': this.utilService.processUsers(); break;
		}
	}


	clearStorage() {
		localStorage.removeItem('jwtToken');
	}

	openUsers() {
		this.userMode = true;
		this.franchiseMode = false;
		this.clientMode = false;
		this.appointmentMode = false;
		this.invoiceMode = false;
	}

	openFranchises() {
		this.franchiseMode = true;
		this.userMode = false;
		this.clientMode = false;
		this.appointmentMode = false;
		this.invoiceMode = false;
	}

	openClients() {
		this.clientMode = true;
		this.userMode = false;
		this.franchiseMode = false;
		this.appointmentMode = false;
		this.invoiceMode = false;
	}

	openAppointments() {
		this.appointmentMode = true;
		this.clientMode = false;
		this.userMode = false;
		this.franchiseMode = false;
		this.invoiceMode = false;
	}

	openInvoices() {
		this.invoiceMode = true;
		this.appointmentMode = false;
		this.clientMode = false;
		this.userMode = false;
		this.franchiseMode = false;
	}

}
