import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TestBed } from '@angular/core/testing';
import { UtilService } from 'src/app/services/util.service';

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
	constructor(private userService: UserService, private utilService: UtilService) { }

	ngOnInit() {
		this.getUsers();
		this.franchises = this.utilService.franchises;
	}

	getUsers() {
		this.userService.getUsers().subscribe(res => {
			const data = res.json();
			data.forEach(item => {
				this.users.push({ FirstName: item.FirstName, LastName: item.LastName, Role: item.Role });
				if (item.Username === 'test') { // test for string array manipulation in invoice
					let a = item.Phone;
					a = a.replace(/'/g, '"');
					a = JSON.parse(a);
					console.log('a: ', a);
				}
			});
			console.log('this.users: ', data);
		});
	}

	submitUser() {
		this.userService.createUser(this.User).subscribe(res => {
			console.log('res: ', JSON.stringify(res));
		});
	}

	testLogin() {
		this.userService.loginUser(this.testUsername, this.testPassword).subscribe(res => {
			console.log('login response: ', res);
			localStorage.removeItem('jwtToken');
			localStorage.setItem('jwtToken', res.json().token);
		}, error => {
			console.log('error: ', error);
		});
	}

}
