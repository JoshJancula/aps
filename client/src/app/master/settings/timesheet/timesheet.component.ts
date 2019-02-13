import { Component, OnInit } from '@angular/core';
import { TimecardService } from '../../../services/timecard.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-timesheet',
	templateUrl: './timesheet.component.html',
	styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

	isClockedIn = false;
	todaysActivity: any;

	constructor(private utilService: UtilService, private authService: AuthService, private timeCardService: TimecardService) { }

	ngOnInit() {
		this.getTodayHours();
	}

	getTodayHours() {
		this.timeCardService.getTodaysTimecards(this.authService.currentUser.id).subscribe(response => {
			console.log('response: ', response);
			if ((<any>response).length <= 0) {
				console.log('length was <= 0');
				this.isClockedIn = false;
			} else {
				(<any>response).forEach(card => {
					console.log('card: ', card);
					if (card.TimeOut === '' || card.TimeOut === null || card.TimeIn === undefined) { this.isClockedIn = true; }
				});
				this.todaysActivity = response;
			}
		});
	}

	getDiff(a, b) {
		let diff;
		if (b !== null && b !== '' && b !== undefined) {
			let x = moment(a);
			let y = moment(b);
			 diff = moment.duration(x.diff(y));
		} else {
			let x = moment(a);
			let y = moment(new Date);
			 diff = moment.duration(x.diff(y));
		}
		return diff._data.minutes;
	}

	formatMinutes(a) {
		return moment(a).format('hh:mm');
	}

	clockIn() {
		const data = {
			EmployeeName: this.authService.currentUser.Name,
			EmployeeId: this.authService.currentUser.id,
			FranchiseId: this.authService.currentUser.FranchiseId,
			Date: moment(new Date()).format('MM/DD/YYYY'),
			TimeIn: moment(new Date())
		};

		this.timeCardService.createTimecard(data).subscribe(res => {
			console.log('res saving timecard: ', res);
			this.isClockedIn = true;
		}, error => {
			this.utilService.alertError(`error saving timecard: ${error}`);
		});
	}

	clockOut() {
		this.timeCardService.getTodaysTimecards(this.authService.currentUser.id).subscribe(res => {
			(<any>res).forEach(card => {
				if (card.TimeOut === '' || card.TimeOut === null || card.TimeIn === undefined) {
					const data = {
						TimeIn: card.TimeIn,
						TimeOut: moment(new Date()),
						id: card.id
					};
					this.timeCardService.updateTimecard(card.id, data).subscribe(res2 => {
						console.log('clock out response: ', res2);
						this.isClockedIn = false;
						this.getTodayHours();
					});
				}
			});
		});
	}

}
