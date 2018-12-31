import { Component, OnInit, ViewChild } from '@angular/core';
import { ControlUserComponent } from './control-user/control-user.component';
import { ControlFranchiseComponent } from './control-franchise/control-franchise.component';
import { ControlClientComponent } from './control-client/control-client.component';
import { UtilService } from '../services/util.service';
import { HttpEventType } from '@angular/common/http';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-master',
	templateUrl: './master.component.html',
	styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {

	userMode = false;
	franchiseMode = false;
	clientMode = false;
	@ViewChild('controlUser') controlUser: ControlUserComponent;
	@ViewChild('controlFranchise') controlFranchise: ControlFranchiseComponent;
	@ViewChild('controlClient') controlClient: ControlClientComponent;
	constructor(private utilService: UtilService) { }

	ngOnInit() {
		this.utilService.getFranchises().subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				this.utilService.franchises = events.body;
				}
		});
	}

	clearStorage() {
		localStorage.removeItem('jwtToken');
	}

	openUsers() {
		this.userMode = true;
		this.franchiseMode = false;
		this.clientMode = false;
	}

	openFranchises() {
		this.franchiseMode = true;
		this.userMode = false;
		this.clientMode = false;
	}

	openClients() {
		this.clientMode = true;
		this.userMode = false;
		this.franchiseMode = false;
	}

}
