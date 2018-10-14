import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
	selector: 'app-master',
	templateUrl: './master.component.html',
	styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {

	User: any = {
		Username: '',
		FirstName: '',
		LastName: '',
		Role: '',
		Password: '',
		Email: '',
		Phone: '',
		Active: true,
	};
	users = [];

	constructor(private userService: UserService) { }

	ngOnInit() {
		this.userService.getUsers().subscribe(res => {
			const data = res.json();
			console.log('data: ', data);
			data.forEach(item => {
				this.users.push({ FirstName: item.FirstName, LastName: item.LastName, Role: item.Role });
			});
			console.log('users: ', this.users);
		});
	}

	submit() {
		this.userService.createUser(this.User).subscribe(res => {
			console.log('res: ', JSON.stringify(res));
		});
	}

}
