import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-user-selector',
	templateUrl: './user-selector.component.html',
	styleUrls: ['./user-selector.component.css']
})
export class UserSelectorComponent implements OnInit {

	@Output() userSelected = new EventEmitter();
	public users: any;
	constructor(private subService: SubscriptionsService, private authService: AuthService) { }

	ngOnInit() {
		this.getUsers();
	}

	getUsers() {
		this.subService.processUsers();
		this.subService.users.subscribe(response => {
			let temp = [];
			response.forEach(item => {
				if (item.Username !== this.authService.currentUser.Username) {
					temp.push(item);
				}
			});
			this.sortUsers(temp);
		});
	}

	sortUsers(obj) {
		obj.sort((a, b) => (a.LastName > b.LastName) ? 1 : ((b.LastName > a.LastName) ? -1 : 0));
		this.users = obj;
	}

}
