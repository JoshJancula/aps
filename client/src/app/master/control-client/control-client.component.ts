import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from '../../services/util.service';


@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-control-client',
	templateUrl: './control-client.component.html',
	styleUrls: ['./control-client.component.css']
})
export class ControlClientComponent implements OnInit {

	streetAddress = '';
	city = '';
	state = '';
	zip = '';
	Client: any = {
		Name: '',
		Address: '',
		Phone: '',
		Email: '',
		ContactPerson: '',
		Description: '',
		FranchiseId: ''
	};
	clients: any;
	showMore = false;
	franchises: any;

	constructor(private clientService: ClientService, private utilService: UtilService) { }

	ngOnInit() {
		this.getClients();
		this.franchises = this.utilService.franchises;
		console.log('franchises: ', this.franchises);
	}

	getClients() {
		this.clientService.getClients().subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				console.log('clients: ', events.body);
				this.clients = events.body;
			}
		});
	}

	submitClient() {
		this.Client.Address = this.streetAddress + ', ' + this.city + ', ' + this.state + ' ' + this.zip;
		console.log('client: ', this.Client);
		this.clientService.createClient(this.Client).subscribe(res => {
			console.log('response: ', res);
		}, error => {
			console.log('error: ', error);
		});
	}

	getClientInfo(id) {
		this.clientService.getClient(id).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				const data = events.body;
				this.Client.Name = (<any>data).Name;
				this.showMore = true;
			}
		});
	}

	hideMore() {
		this.showMore = false;
	}

	deleteClient(id) {
		this.clientService.deleteClient(id).subscribe(res => {
			console.log(`delete: ${res}`);
			if (res === 1) {
				this.getClients();
			} else {
				console.log('error deleting');
			}
		});
	}

	states() {
		return this.utilService.states;
	}

}
