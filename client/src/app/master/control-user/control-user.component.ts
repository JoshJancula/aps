import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TestBed } from '@angular/core/testing';
import { UtilService } from 'src/app/services/util.service';
import { PhonePipe } from '../../phone.pipe';
import { HttpEventType } from '@angular/common/http';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-control-user',
	templateUrl: './control-user.component.html',
	styleUrls: ['./control-user.component.css']
})
export class ControlUserComponent implements OnInit {

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

	constructor(private userService: UserService, private utilService: UtilService, private phonePipe: PhonePipe) {
		this.getUsers();
		this.loadFranchises();
	 }

	ngOnInit() {
		// this.getUsers();
		this.franchises = this.utilService.franchises;
	}

	getUsers() {
		this.utilService.processUsers();
		this.utilService.users.subscribe(response => {
			response.forEach(item => {
				this.users.push({ FirstName: item.FirstName, LastName: item.LastName, Role: item.Role });
			});
		});
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
		this.utilService.processUsers();
		this.clearForm();
	}

	testLogin() {
		this.userService.loginUser(this.testUsername, this.testPassword).subscribe(res => {
			console.log('login response: ', res.json());
			localStorage.removeItem('jwtToken');
			localStorage.setItem('jwtToken', res.json().token);
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
				this.utilService.processUsers();
			} else {
				console.log('error deleting');
			}
		});
	}

	editUser(id) {
		this.editing = true;
		this.userService.getUser(id).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				const data = JSON.parse(JSON.stringify(events.body));
				this.User = data;
				this.selectedId = data.id;
				console.log('this.User: ', this.User);
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

}
