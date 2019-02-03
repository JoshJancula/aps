import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadFileService } from '../../services/upload-file.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from '../../services/user.service';
import { UtilService } from '../../services/util.service';
import * as moment from 'moment';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	@ViewChild('calendar') calendar: any;
	@ViewChild('calendar2') calendar2: any;
	targetFile: any;
	newPassword = '';
	oldPassword = '';
	confirmNewPassword = '';
	backgroundImage = '';
	ptoTime = '';
	ptoComments = '';
	 date = moment(new Date()).add(7, 'days');
	 minDate = (<any>this.date)._d;
	leaveDate = this.minDate;
	returnDate = this.minDate;
	progress: { percentage: number } = { percentage: 0 };
	actions = ['Timesheet', 'Request time off', 'Change password', 'Set background'];
	images = [
		{ name: 'SharkNado', src: 'assets/logo.jpeg' },
		{ name: 'Classic', src: 'assets/logo5.png' },
		{ name: 'Stripes 1', src: 'assets/stripes1.png' },
		{ name: 'Stripes 2', src: 'assets/stripes2.png' },
		{ name: 'Stripes 3', src: 'assets/stripes5.png' },
	];
	userAction = 'Request time off';

	constructor(private utilService: UtilService, private userService: UserService, public uploadService: UploadFileService, public authService: AuthService) { }

	ngOnInit() {
		if (localStorage.getItem('background')) {
			this.backgroundImage = localStorage.getItem('background');
		} else {
			this.backgroundImage = 'assets/logo.jpeg';
		}
	}

	uploadImage($event) {
		if ($event.target.files.length > 0) {
			let reader = new FileReader();
			reader.onload = () => { this.submitImage(); };
			reader.onerror = (error) => { };
			this.targetFile = $event.target.files[0];
		}
	}

	submitImage() {
		this.uploadService.pushFileToStorage(this.targetFile, this.progress, 'avatar');
	}

	submitPasswordChange() {
		if (this.newPassword === this.confirmNewPassword) {
			this.authService.loginUser(this.authService.currentUser.Username, this.oldPassword).subscribe(res => {
				if (res.status === 200) {
					this.userService.updatePassword(this.confirmNewPassword).subscribe(response => {
						if ((<any>response).success === true) {
							this.clearForms();
							this.utilService.alertError(`Save successfull`);
						}
					});
				}
			}, error => {
				if (error.status === 401) {
					this.utilService.alertError(`Incorrect old password`);
				}
			});
		} else {
			this.utilService.alertError(`The passwords do not match`);
		}
	}

	clearForms() {
		this.oldPassword = '';
		this.newPassword = '';
		this.confirmNewPassword = '';
		this.ptoTime = '';
		this.ptoComments = '';
		this.leaveDate = this.minDate;
		this.returnDate = this.minDate;
	}

	saveBackground() {
		if (localStorage.getItem('background')) {
			localStorage.removeItem('background');
		}
		localStorage.setItem('background', this.backgroundImage);
		document.body.style.backgroundImage = `url(${this.backgroundImage})`;
	}

	openCalendar(event) {
		event.preventDefault();
		this.calendar.open();
	}

	openCalendar2(event) {
		event.preventDefault();
		this.calendar2.open();
	}

	getMinDate() {
		let date = moment(new Date()).add(7, 'days');
		let minDate = (<any>date)._d;
		return minDate;
	}

	getMinDateReturn() {
		return this.leaveDate;
	}

	submitPtoRequest() {
		// not sure if we need to connect to timesheet or just email request, will come back to this
		this.clearForms();
	}

}