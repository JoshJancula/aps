import { Component, OnInit, ViewChild } from '@angular/core';
import { ControlUserComponent } from './control-user/control-user.component';
import { ControlFranchiseComponent } from './control-franchise/control-franchise.component';
import { ControlClientComponent } from './control-client/control-client.component';
import { ControlAppointmentComponent } from './control-appointment/control-appointment.component';
import { SettingsComponent } from './settings/settings.component';
import { UtilService } from '../services/util.service';
import { HttpEventType } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { BottomPopupComponent } from '../bottom-popup/bottom-popup.component';
import { ControlInvoiceComponent } from './control-invoice/control-invoice.component';
import { FranchiseService } from '../services/franchise.service';
import * as moment from 'moment';

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
	invoiceMode = false;
	settingsMode = true;
	messageConnection: any;
	updateConnection: any;
	pauseTime: any;
	screen = this.authService.currentUser.Name;
	@ViewChild('appointmentCalendar') appointmentCalendar: any;
	@ViewChild('controlUser') controlUser: ControlUserComponent;
	@ViewChild('controlSettings') controlSettings: SettingsComponent;
	@ViewChild('controlFranchise') controlFranchise: ControlFranchiseComponent;
	@ViewChild('controlClient') controlClient: ControlClientComponent;
	@ViewChild('controlAppointment') controlAppointment: ControlAppointmentComponent;
	@ViewChild('controlInvoice') controlInvoice: ControlInvoiceComponent;
	@ViewChild('bottomSheet') bottomSheet: MatBottomSheetRef<BottomPopupComponent>;

	constructor(private franchiseService: FranchiseService, private bottomSheetRef: MatBottomSheet, public authService: AuthService, public utilService: UtilService, private userService: UserService, private messagingService: MessageService) { }

	ngOnInit() {
		if (localStorage.getItem('background')) {
			document.body.style.backgroundImage = localStorage.getItem('background');
			document.body.style.backgroundImage = `url(${localStorage.getItem('background')})`;
		} else {
			document.body.style.backgroundImage = 'url("assets/logo5.png")';
		}
		this.messagingService.initSocket();
		this.messageConnection = this.messagingService.onMessage().subscribe((response: any) => {
			console.log('socket response: ', response);
		});
		this.subscribeToUpdates();
		setTimeout(() => this.sendConnectionMessage(), 500);
		setTimeout(() => this.loadFranchiseInfo(), 600);
		setTimeout(() => this.listenForResume(), 1000);
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
				case 'settings': this.openSettings(); break;
			}
		});
	}

	listenForResume() {
		if ((<any>window).deviceReady === true) {
			document.addEventListener('resume', (e) => {
				this.getUpdates();
			}, false);
			document.addEventListener('pause', (e) => {
				this.pauseTime = moment().add(2, 'hours');
			}, false);
		}
	}

	getUpdates() {
		if (moment(new Date()).isBefore(moment(this.pauseTime))) {
			this.messagingService.initSocket();
			this.messageConnection = this.messagingService.onMessage().subscribe((response: any) => {
				console.log('socket response: ', response);
			});
			this.subscribeToUpdates();
			setTimeout(() => this.sendConnectionMessage(), 500);
			this.utilService.processClients();
			setTimeout(() => this.utilService.processFranchises(), 100);
			setTimeout(() => this.utilService.processUsers(), 200);
			setTimeout(() => this.utilService.processInvoices(this.controlInvoice.invoiceSearch.filter), 300);
			setTimeout(() => this.utilService.processAppointments(), 400);
		} else {
			this.authService.logout();
		}
	}

	loadFranchiseInfo() {
		if (this.authService.currentUser.FranchiseId !== '') {
			this.franchiseService.getFranchise(this.authService.currentUser.FranchiseId).subscribe((events) => {
				if (events.type === HttpEventType.Response) {
					this.authService._franchiseInfo = events.body;
				}
			});
		} else { this.loadFranchiseInfo(); }
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
			this.processUpdate(response);
		});
	}

	processUpdate(data) {
		if (data.Franchise === this.authService.currentUser.FranchiseId) {
			switch (data.Action) {
				case 'updateClients': this.utilService.processClients(); break;
				case 'updateFranchises': this.utilService.processFranchises(); break;
				case 'updateUsers': this.utilService.processUsers(); break;
				case 'updateInvoices': this.utilService.processInvoices(this.controlInvoice.invoiceSearch.filter); break;
				case 'updateAppointments': this.utilService.processAppointments(); break;
			}
		}
	}

	openCalendar(event) {
		event.preventDefault();
		this.appointmentCalendar.open();
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
		this.settingsMode = false;
		this.screen = 'Staff';
	}

	openFranchises() {
		this.franchiseMode = true;
		this.userMode = false;
		this.clientMode = false;
		this.appointmentMode = false;
		this.invoiceMode = false;
		this.settingsMode = false;
		this.screen = 'Franchises';
	}

	openClients() {
		this.clientMode = true;
		this.userMode = false;
		this.franchiseMode = false;
		this.appointmentMode = false;
		this.invoiceMode = false;
		this.settingsMode = false;
		this.screen = 'Clients';
	}

	openAppointments() {
		this.appointmentMode = true;
		this.clientMode = false;
		this.userMode = false;
		this.franchiseMode = false;
		this.invoiceMode = false;
		this.settingsMode = false;
		this.screen = 'Appointments';
	}

	openInvoices() {
		this.invoiceMode = true;
		this.appointmentMode = false;
		this.clientMode = false;
		this.userMode = false;
		this.franchiseMode = false;
		this.settingsMode = false;
		this.screen = 'Invoicing';
	}

	openSettings() {
		this.settingsMode = true;
		this.invoiceMode = false;
		this.appointmentMode = false;
		this.clientMode = false;
		this.userMode = false;
		this.franchiseMode = false;
		this.screen = this.authService.currentUser.Name;
	}

}
