import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	constructor(private userService: UserService, private authService: AuthService, private router: Router) { }
	username = '';
	password = '';

	ngOnInit() {
		document.body.style.backgroundImage = 'url("assets/logo5.png")';
		localStorage.removeItem('jwtToken');
	}

	navigate(role) {
		switch (role) {
			case 'Super': this.router.navigate([`/master`], {}); break;
			case 'Tech': this.router.navigate([`/master`], {}); break;
			case 'Owner': this.router.navigate([`/master`], {}); break;
			case 'Manager': this.router.navigate([`/master`], {}); break;
			case 'Reception': this.router.navigate([`/master`], {}); break;
			case 'Shop hand': this.router.navigate([`/master`], {}); break;
		}
	}

	checkCordova() {
		if ((<any>window).deviceReady === true) {
			(<any>window).Keyboard.hide();
			setTimeout(() => this.login(), 100);
		} else {
			this.login();
		}
	}

	login() {
		this.authService.loginUser(this.username, this.password).subscribe(res => {
			console.log('login response: ', res);
			if (res.status === 200) {
				localStorage.setItem('jwtToken', res.json().token);
				console.log('res.json() ', res.json());
				localStorage.removeItem('currentUser');
				this.authService.currentUser.Name = res.json().user.FirstName + ' ' + res.json().user.LastName;
				this.authService.currentUser.Role = res.json().user.Role;
				this.authService.currentUser.Email = res.json().user.Email;
				this.authService.currentUser.Username = res.json().user.Username;
				this.authService.currentUser.Phone = res.json().user.Phone;
				this.authService.currentUser.id = res.json().user.id;
				this.authService.currentUser.Avatar = res.json().user.Avatar;
				this.authService.currentUser.FranchiseId = res.json().user.FranchiseId;
				this.authService.currentUser.Initials = `${res.json().user.FirstName.substr(0, 1)}${res.json().user.LastName.substr(0, 1)}`;
				localStorage.setItem('currentUser', JSON.stringify(this.authService.currentUser));
				this.navigate(res.json().user.Role);
			}
		}, error => {
			console.log('error: ', error);
		});
	}

	submitPasswordChange() {
		this.userService.updatePassword('test').subscribe(response => {
			console.log('response updating password', response);
		});
	}


}
