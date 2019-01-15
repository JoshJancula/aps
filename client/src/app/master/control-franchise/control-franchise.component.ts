import { Component, OnInit } from '@angular/core';
import { FranchiseService } from '../../services/franchise.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';
import { MessageService } from '../../services/message.service';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user.service';
import { PhonePipe } from 'src/app/phone.pipe';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-control-franchise',
	templateUrl: './control-franchise.component.html',
	styleUrls: ['./control-franchise.component.css']
})
export class ControlFranchiseComponent implements OnInit {

	Franchise: any = {
		Name: '',
		Active: true
	};
	franchises: any;
	editing = false;
	selectedId = '';
	searchFranchises = true;
	addFranchise = false;

	User: any = {
		Username: '',
		FirstName: '',
		LastName: '',
		Role: 'Owner',
		Password: '',
		Email: '',
		Phone: '',
		FranchiseId: '',
		Active: true,
	};

	location: ''; // this is dummy right now;

	constructor(private phonePipe: PhonePipe, private userService: UserService, private messagingService: MessageService, private franchiseService: FranchiseService, private utilService: UtilService) {
		this.loadFranchises();
	}

	ngOnInit() {
	}

	setView() {
		if (this.searchFranchises === true) {
			this.searchFranchises = false;
			this.addFranchise = true;
		} else {
			this.searchFranchises = true;
			this.addFranchise = false;
		}
	}

	loadFranchises() {
		this.utilService.processFranchises();
		this.utilService.franchises.subscribe(response => {
			this.franchises = response;
			console.log('franchises: ', this.franchises);
		});
	}

	notifySocket() {
		const data = { MessageType: 'update', Action: 'franchises' };
		this.messagingService.sendUpdate(data);
	}

	submitFranchise() {
		if (this.editing === false) {
			this.franchiseService.createFranchise(this.Franchise).subscribe(res => {
				console.log('response: ', res);
				const data = JSON.parse(JSON.stringify(res));
				this.User.FranchiseId = data.id;
				this.submitUser();
			}, error => {
				console.log('error: ', error);
			});
		} else {
			this.franchiseService.updateFranchise(this.selectedId, this.Franchise).subscribe(res => {
				console.log(res);
			});
		}
		setTimeout(() => this.utilService.processFranchises(), 500);
		setTimeout(() => this.notifySocket(), 500);
	}

	editFranchise(id) {
		this.searchFranchises = false;
		this.addFranchise = true;
		this.editing = true;
		this.franchiseService.getFranchise(id).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				const data = JSON.parse(JSON.stringify(events.body));
				this.Franchise = data;
				this.selectedId = data.id;
			}
		});
	}

	submitUser() {
		this.userService.createUser(this.User).subscribe(res => {
			console.log('res: ', JSON.stringify(res));
		});
		setTimeout(() => this.utilService.processUsers(), 500);
		setTimeout(() => this.notifySocket(), 500);
		setTimeout(() => this.utilService.processFranchises(), 600);
		setTimeout(() => this.notifySocket(), 600);
		this.clearForm();
	}

	clearForm() {
		this.Franchise = {
			Name: '',
			Active: true
		};
		this.editing = false;
		this.selectedId = '';
		this.location = '';
		this.clearUserForm();
	}

	clearUserForm() {
		this.User = {
			Username: '',
			FirstName: '',
			LastName: '',
			Role: 'Owner',
			Password: '',
			Email: '',
			Phone: '',
			FranchiseId: '',
			Active: true,
		};
	}

	deleteFranchise(id) {
		this.franchiseService.deleteFranchise(id).subscribe(res => {
			console.log(`delete: ${res}`);
			if (res === 1) {
				this.clearForm();
				this.utilService.processFranchises();
				this.notifySocket();
			} else {
				console.log('error deleting');
			}
		});
	}

	formatDate(date) {
		return moment(date).format('MMMM Do YYYY');
	}

	formatPhone() {
		this.User.Phone = this.phonePipe.transform(this.User.Phone);
	}

}
