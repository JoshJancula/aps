import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TestBed } from '@angular/core/testing';
import { UtilService } from 'src/app/services/util.service';
import { PhonePipe } from '../../phone.pipe';
import { HttpEventType } from '@angular/common/http';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from '../../services/auth.service';
import * as moment from 'moment';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-control-user',
	templateUrl: './control-user.component.html',
	styleUrls: ['./control-user.component.css']
})
export class ControlUserComponent implements OnInit {

	searchUsers = false;
	addUser = true;
	User: any = {
		Username: '',
		FirstName: '',
		LastName: '',
		Role: '',
		Password: '',
		Email: '',
		Phone: '',
		FranchiseId: '',
		Active: true,
	};
	users = [];
	testPassword = '';
	testUsername = '';
	franchises: any;
	editing = false;
	selectedId = '';
	roles = ['Owner', 'Manager', 'Tech', 'Print shop', 'Reception'];

	// tslint:disable-next-line:max-line-length
	constructor(public authService: AuthService, private userService: UserService, private utilService: UtilService, private phonePipe: PhonePipe, private messagingService: MessageService) {
		this.getUsers();
	}

	ngOnInit() {
		if (this.authService.currentUser.Role === 'Super') {
			this.loadFranchises();
		}
	}

	getUsers() {
		this.utilService.processUsers();
		this.utilService.users.subscribe(response => {
			this.users = [];
			response.forEach(item => {
				this.users.push({ Username: item.Username, FirstName: item.FirstName, LastName: item.LastName, Role: item.Role, id: item.id });
			});
		});
	}

	setView() {
		if (this.searchUsers === true) {
			this.searchUsers = false;
			this.addUser = true;
		} else {
			this.searchUsers = true;
			this.addUser = false;
		}
	}

	notifySocket() {
		const data = {MessageType: 'update', Action: 'users'};
		this.messagingService.sendUpdate(data);
	}

	loadFranchises() {
		this.utilService.processFranchises();
		this.utilService.franchises.subscribe(response => {
			this.franchises = response;
		});
	}

	submitUser() {
		if (this.editing === false) {
			this.userService.createUser(this.User).subscribe(res => {
				console.log('res: ', JSON.stringify(res));
			});
		} else {
			this.userService.updateUser(this.selectedId, this.User).subscribe(res => {
				console.log('res: ', res);
			});
		}
		setTimeout(() => this.utilService.processUsers(), 500);
		setTimeout(() => this.notifySocket(), 500);
		this.clearForm();
	}

	testLogin() {
		this.userService.loginUser(this.testUsername, this.testPassword).subscribe(res => {
			console.log('login response: ', res.json());
		}, error => {
			console.log('error: ', error);
		});
	}

	formatPhone() {
		this.User.Phone = this.phonePipe.transform(this.User.Phone);
	}

	deleteUser(id) {
		this.userService.deleteUser(id).subscribe(res => {
			console.log(`delete: ${res}`);
			if (res === 1) {
				this.clearForm();
				this.notifySocket();
				this.utilService.processUsers();
			} else {
				console.log('error deleting');
			}
		});
	}

	editUser(id) {
		console.log('id: ', id);
		this.editing = true;
		this.searchUsers = false;
		this.addUser = true;
		this.userService.getUser(id).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				const data = JSON.parse(JSON.stringify(events.body));
				console.log('data: ', data);
				this.User = data;
				this.selectedId = data.id;
			}
		});
	}

	clearForm() {
		this.User = {
			Username: '',
			FirstName: '',
			LastName: '',
			Role: '',
			Password: '',
			Email: '',
			Phone: '',
			FranchiseId: '',
			Active: true,
		};
		this.editing = false;
		this.selectedId = '';
	}

	formatDate(date) {
		return moment(date).format('MMMM Do YYYY');
	}

}
