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
import {MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { BottomPopupComponent } from '../bottom-popup/bottom-popup.component';
import { ControlInvoiceComponent } from './control-invoice/control-invoice.component';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-master',
	templateUrl: './master.component.html',
	styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {

	userMode = false;
	franchiseMode = false;
	clientMode = false;
	appointmentMode = false;
	invoiceMode = true;
	messageConnection: any;
	updateConnection: any;
	@ViewChild('controlUser') controlUser: ControlUserComponent;
	@ViewChild('controlFranchise') controlFranchise: ControlFranchiseComponent;
	@ViewChild('controlClient') controlClient: ControlClientComponent;
	@ViewChild('controlAppointment') controlAppointment: ControlAppointmentComponent;
	@ViewChild('controlInvoice') controlInvoice: ControlInvoiceComponent;
	@ViewChild('bottomSheet') bottomSheet: MatBottomSheetRef<BottomPopupComponent>;

	// controllers = [
	// 	{ click: this.controlUser.setView(), bool: this.userMode, bool2: this.controlUser.addUser },
	// 	{ click: this.controlAppointment.setView(), bool: this.appointmentMode, bool2: this.controlAppointment.addAppointment },
	// 	{ click: this.controlClient.setView(), bool: this.clientMode, bool2: this.controlClient.addClient },
	// 	{ click: this.controlClient.setView(), bool: this.invoiceMode, bool2: this.controlInvoice.addInvoice },
	// 	{ click: this.controlFranchise.setView(), bool: this.franchiseMode, bool2: this.controlFranchise.addFranchise },
	// ];


	// tslint:disable-next-line:max-line-length
	constructor(private bottomSheetRef: MatBottomSheet, private authService: AuthService, private utilService: UtilService, private userService: UserService, private messagingService: MessageService) { }

	ngOnInit() {
		this.messagingService.initSocket();
			this.messageConnection = this.messagingService.onMessage().subscribe((response: any) => {
				console.log('socket response: ', response);
			});
			this.subscribeToUpdates();
		setTimeout(() => this.sendConnectionMessage(), 500);
	}

	openPopup() {
		const sheet = this.bottomSheetRef.open(BottomPopupComponent);
		sheet.afterDismissed().subscribe((res) => {
			switch (res) {
				case 'clients': this.openClients(); break;
				case 'franchises': this.openFranchises(); break;
				case 'users': this.openUsers(); break;
				case 'invoices': this.openInvoices(); break;
				case 'appointments': this.openAppointments(); break;
			}
		});
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
			case 'updateInvoices': this.utilService.processInvoices(this.controlInvoice.invoiceSearch.filter); break;
			case 'updateAppointments': this.utilService.processAppointments(); break;
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
