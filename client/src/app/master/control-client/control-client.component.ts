import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from '../../services/util.service';
import { PhonePipe } from 'src/app/phone.pipe';
import { MessageService } from '../../services/message.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-control-client',
	templateUrl: './control-client.component.html',
	styleUrls: ['./control-client.component.css']
})
export class ControlClientComponent implements OnInit {

	Client: any = {
		Name: '',
		Address: '',
		Phone: '',
		Email: '',
		ContactPerson: '',
		Description: '',
		FranchiseId: this.authService.currentUser.FranchiseId
	};
	clients: any;
	franchises: any;
	editing = false;
	selectedId = '';
	addClient = false;
	searchClients = true;

	// tslint:disable-next-line:max-line-length
	constructor(private authService: AuthService, private messagingService: MessageService, private clientService: ClientService, private utilService: UtilService, private phonePipe: PhonePipe) {
		this.getClients();
	}

	ngOnInit() {
	}

	setView() {
		if (this.searchClients === true) {
			this.searchClients = false;
			this.addClient = true;
		} else {
			this.searchClients = true;
			this.addClient = false;
		}
	}

	notifySocket() {
		const data = { MessageType: 'update', Action: 'clients' };
		this.messagingService.sendUpdate(data);
	}

	getClients() {
		this.utilService.processClients();
		this.utilService.clients.subscribe(response => {
			this.sortClients(response);
		});
	}

	sortClients(obj) {
		obj.sort((a, b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0));
		this.clients = obj;
	}

	submitClient() {
		if ((<any>window).deviceReady === true) {
			(<any>window).Keyboard.hide();
		}
		if (this.editing === false) {
			this.clientService.createClient(this.Client).subscribe(res => {
				console.log('response: ', res);
			}, error => {
				console.log('error: ', error);
			});
		} else {
			this.clientService.updateClient(this.selectedId, this.Client).subscribe(response => {
				console.log('respnse: ', response);
			});
		}
		setTimeout(() => this.utilService.processClients(), 500);
		setTimeout(() => this.notifySocket(), 500);
		this.clearForm();
		this.setView();
	}

	editClient(data) {
		this.editing = true;
		this.addClient = true;
		this.searchClients = false;
		this.Client = data;
		this.selectedId = data.id;
	}

	clearForm() {
		if ((<any>window).deviceReady === true) {
			(<any>window).Keyboard.hide();
		}
		this.Client = {
			Name: '',
			Address: '',
			Phone: '',
			Email: '',
			ContactPerson: '',
			Description: '',
			FranchiseId: this.authService.currentUser.FranchiseId
		};
		this.editing = false;
		this.selectedId = '';
	}

	deleteClient(id) {
		this.clientService.deleteClient(id).subscribe(res => {
			console.log(`delete: ${res}`);
			if (res === 1) {
				this.clearForm();
				this.utilService.processClients();
				this.notifySocket();
			} else {
				console.log('error deleting');
			}
		});
	}

	states() {
		return this.utilService.states;
	}

	formatPhone() {
		this.Client.Phone = this.phonePipe.transform(this.Client.Phone);
	}

}
