import { Component, OnInit } from '@angular/core';
import { FranchiseService } from '../../services/franchise.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';
import { MessageService } from '../../services/message.service';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user.service';
import { PhonePipe } from 'src/app/phone.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-control-franchise',
	templateUrl: './control-franchise.component.html',
	styleUrls: ['./control-franchise.component.css']
})
export class ControlFranchiseComponent implements OnInit {

	Franchise: any = {
		Name: '',
		Phone: '',
		Email: '',
		Address: '',
		TaxRate: '',
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

	constructor(private subService: SubscriptionsService, public authService: AuthService, private phonePipe: PhonePipe, private userService: UserService, private messagingService: MessageService, private franchiseService: FranchiseService, private utilService: UtilService) {
	}

	ngOnInit() {
		this.loadFranchises();
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
		this.subService.processFranchises();
		this.subService.franchises.subscribe(response => {
			this.franchises = response;
		});
	}

	notifySocket() {
		const data = { Franchise: this.authService.currentUser.FranchiseId, MessageType: 'update', Action: 'franchises' };
		this.messagingService.sendUpdate(data);
	}

	submitFranchise() {
		if (this.editing === false) {
			this.franchiseService.createFranchise(this.Franchise).subscribe(res => {
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
		setTimeout(() => this.subService.processFranchises(), 500);
		setTimeout(() => this.notifySocket(), 500);
		this.setView();
	}

	editFranchise(data) {
		this.searchFranchises = false;
		this.addFranchise = true;
		this.editing = true;
		this.Franchise = data;
		this.selectedId = data.id;
	}

	submitUser() {
		this.userService.createUser(this.User).subscribe(res => {
			console.log('res: ', JSON.stringify(res));
		});
		setTimeout(() => this.subService.processUsers(), 500);
		setTimeout(() => this.notifySocket(), 500);
		setTimeout(() => this.subService.processFranchises(), 600);
		setTimeout(() => this.notifySocket(), 600);
		this.clearForm();
	}

	clearForm() {
		if ((<any>window).deviceReady === true) {
			(<any>window).Keyboard.hide();
		}
		this.Franchise = {
			Name: '',
			Phone: '',
			Email: '',
			Address: '',
			TaxRate: '',
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
				this.subService.processFranchises();
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
		this.Franchise.Phone = this.phonePipe.transform(this.Franchise.Phone);
	}

	formatUserPhone() {
		this.User.Phone = this.phonePipe.transform(this.User.Phone);
	}

}
