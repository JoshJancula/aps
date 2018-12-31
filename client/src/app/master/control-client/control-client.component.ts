import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from '../../services/util.service';
import { PhonePipe } from 'src/app/phone.pipe';


@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-control-client',
	templateUrl: './control-client.component.html',
	styleUrls: ['./control-client.component.css']
})
export class ControlClientComponent implements OnInit {

	Client: any = {
		Name: '',
		StreetAddress: '',
		City: '',
		State: '',
		Zip: '',
		Phone: '',
		Email: '',
		ContactPerson: '',
		Description: '',
		FranchiseId: ''
	};
	clients: any;
	franchises: any;
	editing = false;
	selectedId = '';

	constructor(private clientService: ClientService, private utilService: UtilService, private phonePipe: PhonePipe) {
		this.loadFranchises();
		this.getClients();
	 }

	ngOnInit() {
	}

	getClients() {
		this.utilService.processClients();
		this.utilService.clients.subscribe(response => {
			this.clients = response;
		});
	}

	loadFranchises() {
		this.utilService.processFranchises();
		this.utilService.franchises.subscribe(response => {
			this.franchises = response;
		});
	}


	submitClient() {
		if (this.editing === false) {
			console.log('client: ', this.Client);
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
		this.utilService.processClients();
		this.clearForm();
	}

	editClient(id) {
		this.editing = true;
		console.log('id for get client: ', id);
		this.clientService.getClient(id).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				const data = JSON.parse(JSON.stringify(events.body));
				this.Client = data;
				this.selectedId = data.id;
				console.log('this.client: ', this.Client);
			}
		});
	}

	clearForm() {
		this.Client = {
			Name: '',
			StreetAddress: '',
			City: '',
			State: '',
			Zip: '',
			Phone: '',
			Email: '',
			ContactPerson: '',
			Description: '',
			FranchiseId: ''
		};
		this.editing = false;
		this.selectedId = '';
	}

	deleteClient(id) {
		this.clientService.deleteClient(id).subscribe(res => {
			console.log(`delete: ${res}`);
			if (res === 1) {
				this.utilService.processClients();
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
