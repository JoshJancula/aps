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
import { SubscriptionsService } from '../services/subscriptions.service';
import { MessagingComponent } from '../messaging/messaging.component';

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
	showMessages = false;
	showUserSelector = false;
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
	@ViewChild('messagingComponent') messagingComponent: MessagingComponent;
	@ViewChild('bottomSheet') bottomSheet: MatBottomSheetRef<BottomPopupComponent>;

	constructor(public subService: SubscriptionsService, private franchiseService: FranchiseService, private bottomSheetRef: MatBottomSheet, public authService: AuthService, public utilService: UtilService, private userService: UserService, private messagingService: MessageService) { }

	ngOnInit() {
		if (localStorage.getItem('background')) {
			document.body.style.backgroundImage = localStorage.getItem('background');
			document.body.style.backgroundImage = `url(${localStorage.getItem('background')})`;
		} else {
			document.body.style.backgroundImage = 'url("assets/logo5.png")';
		}
		this.messagingService.initSocket();
		this.messagingService.onConnectionMessage().subscribe((response: any) => {
			console.log('all messages response: ', response);
			this.messagingComponent.messages = response.messages;
			if (response.messages.length > 0) { this.messagingComponent.getUsers(); }
		});
		this.messageConnection = this.messagingService.onMessage().subscribe((response: any) => {
			console.log('socket response: ', response);
			this.messagingComponent.messages.push(response);
			this.messagingComponent.getUsers();
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

	logout() {
		this.authService.logout();
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
			this.subService.processClients();
			setTimeout(() => this.subService.processFranchises(), 100);
			setTimeout(() => this.subService.processUsers(), 200);
			setTimeout(() => this.subService.processInvoices(this.controlInvoice.invoiceSearch.filter), 300);
			setTimeout(() => this.subService.processAppointments(), 400);
			setTimeout(() => this.processTimeCards(), 500);
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
				case 'updateClients': this.subService.processClients(); break;
				case 'updateFranchises': this.subService.processFranchises(); break;
				case 'updateUsers': this.subService.processUsers(); break;
				case 'updateInvoices': this.subService.processInvoices(this.controlInvoice.invoiceSearch.filter); break;
				case 'updateAppointments': this.subService.processAppointments(); break;
				case 'updateTimeCards': this.processTimeCards(); break;
			}
		}
	}

	processTimeCards() {
		if (this.settingsMode === true) {
			if (this.controlSettings.userAction === this.controlSettings.actions[0]) {
				this.controlSettings.timeSheet.getTodayHours();
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
