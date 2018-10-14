import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
	selector: 'app-master',
	templateUrl: './master.component.html',
	styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {

	user: any = {
		Username: '',
		FirstName: '',
		LastName: '',
		Role: '',
		Password: '',
		Email: '',
		Phone: '',
		Active: true,
	};

	constructor(private userService: UserService) { }

	ngOnInit() {
	}

	submit() {
		this.userService.createUser(JSON.stringify(this.user)).subscribe(res => {
			console.log('res: ', JSON.stringify(res));
		});
	}

}
