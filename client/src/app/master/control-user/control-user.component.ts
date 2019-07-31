import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TestBed } from '@angular/core/testing';
import { UtilService } from 'src/app/services/util.service';
import { PhonePipe } from '../../phone.pipe';
import { HttpEventType } from '@angular/common/http';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from '../../services/auth.service';
import * as moment from 'moment';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { TimesheetDialogComponent } from 'src/app/timesheet-dialog/timesheet-dialog.component';
import { MatDialog } from '@angular/material';
import { TimecardService } from 'src/app/services/timecard.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-control-user',
	templateUrl: './control-user.component.html',
	styleUrls: ['./control-user.component.css']
})
export class ControlUserComponent implements OnInit {

	@ViewChild('timesheetCalendar') timesheetCalendar: any;
	dayForTimesheet: any;
	searchUsers = true;
	addUser = false;
	User: any = {
		Username: '',
		FirstName: '',
		LastName: '',
		Role: '',
		Password: '',
		Email: '',
		Phone: '',
		Avatar: '',
		FranchiseId: '',
		Active: true,
		RequireTimesheet: false
	};
	users = [];
	testPassword = '';
	testUsername = '';
	franchises: any;
	editing = false;
	selectedId = '';
	roles = ['Owner', 'Manager', 'Tech', 'Print shop', 'Reception'];

	// tslint:disable-next-line:max-line-length
	constructor(public dialog: MatDialog, private timeCardService: TimecardService, private subService: SubscriptionsService, public authService: AuthService, private userService: UserService, private utilService: UtilService, private phonePipe: PhonePipe, private messagingService: MessageService) {
	}

	ngOnInit() {
		// if (this.authService.currentUser.Role === 'Super') {
		// 	this.loadFranchises();
		// }
		// this.getUsers();
		// console.log('moment.utc(), ', moment().utc());
		this.submitUser();
	}

	getUsers() {
		this.subService.processUsers();
		this.subService.users.subscribe(response => {
			this.sortUsers(response);
		});
	}

	editTimesheet(user) {
		console.log('user: ', user);
			const params = {
				EmployeeId: user.id,
				Date: moment(this.dayForTimesheet).format('MM/DD/YYYY')
			};
			this.timeCardService.getRangeTimecards(params).subscribe((events) => {
				if (events.type === HttpEventType.Response) {
					if (events.status === 200 && events.type === 4) {
						console.log('user is... ', user);
						const newDialog = this.dialog.open(TimesheetDialogComponent, {
							data: { Cards: events.body, Range: this.utilService.getDateRange(this.dayForTimesheet), Name: `${user.FirstName} ${user.LastName}`},
							panelClass: 'invoicePreview'
						});
					}
				}
			}, error => {
				console.log('error: ', error);
			});
	}

	sortUsers(obj) {
		obj.sort((a, b) => (a.LastName > b.LastName) ? 1 : ((b.LastName > a.LastName) ? -1 : 0));
		this.users = obj;
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
		const data = { Franchise: this.authService.currentUser.FranchiseId, MessageType: 'update', Action: 'users' };
		this.messagingService.sendUpdate(data);
	}

	loadFranchises() {
		this.subService.processFranchises();
		this.subService.franchises.subscribe(response => {
			this.franchises = response;
		});
	}

	submitUser() {
		if (this.editing === false) {
			this.userService.createUser(this.User).subscribe(res => {
				console.log('res: ', JSON.stringify(res));
			});
		} else {
			console.log('updating user info: ', this.User);
			this.userService.updateUser(this.selectedId, this.User).subscribe(res => {
				console.log('res: ', res);
			});
		}
		setTimeout(() => this.subService.processUsers(), 500);
		setTimeout(() => this.notifySocket(), 500);
		this.clearForm();
		this.setView();
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
				this.subService.processUsers();
			} else {
				console.log('error deleting');
			}
		});
	}

	editUser(data) {
		console.log('user to edit: ', data);
		this.editing = true;
		this.searchUsers = false;
		this.addUser = true;
		this.User = data;
		this.selectedId = data.id;
		console.log('selectedId: ', data.id);
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
			RequireTimesheet: true
		};
		this.editing = false;
		this.selectedId = '';
	}

	formatDate(date) {
		return moment(date).format('MMMM Do YYYY');
	}

	getMax() {
		return new Date();
	}

	openCalendar(event) {
		event.preventDefault();
		this.timesheetCalendar.open();
	}

}
