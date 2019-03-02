import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadFileService } from '../../services/upload-file.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from '../../services/user.service';
import { UtilService } from '../../services/util.service';
import { TimesheetComponent } from './timesheet/timesheet.component';
import * as moment from 'moment';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	@ViewChild('timeSheet') timeSheet: TimesheetComponent;
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
		{ id: 1, name: 'SharkNado', src: 'assets/logo.jpeg' },
		{ id: 2, name: 'Classic', src: 'assets/logo5.png' },
		{ id: 3, name: 'Stripes 1', src: 'assets/stripes1.png' },
		{ id: 4, name: 'Stripes 2', src: 'assets/stripes2.png' },
		{ id: 5, name: 'Stripes 3', src: 'assets/stripes5.png' },
	];
	userAction = this.actions[1];

	constructor(private subService: SubscriptionsService, private utilService: UtilService, private userService: UserService, public uploadService: UploadFileService, public authService: AuthService) { }

	ngOnInit() {
		if (localStorage.getItem('background')) {
			this.backgroundImage = localStorage.getItem('background');
		} else {
			this.backgroundImage = 'assets/logo.jpeg';
		}
	}

	uploadImage($event) {
		console.log('upload image was called');
		if ($event.target.files.length > 0) {
			console.log('event.target.files: ', $event.target.files.length);
			let reader = new FileReader();
			reader.onload = (event) => { console.log('reader.onload was called'); this.submitImage(event); };
			reader.onerror = (error) => { this.utilService.alertError(`error uploading image ${error}`); };
			reader.readAsBinaryString($event.target.files[0]);
			this.targetFile = $event.target.files[0];
		}
	}

	submitImage(event) {
		console.log('reader onload event passed is.... ', event);
		console.log('should be submitting file');
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

	updateReturn(event) {
		console.log('should be updating return date');
		this.returnDate = this.leaveDate;
	}

	submitPtoRequest() {
		// not sure if we need to connect to timesheet or just email request, will come back to this
		this.clearForms();
	}

	selectImage(image) {
		let button: HTMLButtonElement = document.querySelector(`#radioImage${image.id}`);
		button.click();
		this.backgroundImage = image.src;
	}

}
