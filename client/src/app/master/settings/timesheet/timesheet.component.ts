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
	dayTotal: any;

	constructor(private utilService: UtilService, private authService: AuthService, private timeCardService: TimecardService) { }

	ngOnInit() {
		this.getTodayHours();
	}

	getTodayHours() {
		this.timeCardService.getTodaysTimecards(this.authService.currentUser.id).subscribe(response => {
			console.log('response: ', response);
			if ((<any>response).length <= 0) {
				this.isClockedIn = false;
			} else {
				(<any>response).forEach(card => {
					if (card.TimeOut === '' || card.TimeOut === null || card.TimeIn === undefined) { this.isClockedIn = true; }
				});
				this.todaysActivity = response;
				this.getTotal();
			}
		});
	}

	getDiff(a, b, total) {
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
		if (total) {
			return diff._milliseconds.toString().replace('-', '');
		} else {
			let tempTime = moment.duration(diff._milliseconds);
			if (tempTime.hours() < 0) {
				return `${tempTime.hours().toString().replace('-', '')}  hour(s) ${tempTime.minutes().toString().replace('-', '')} minute(s)`;
			} else {
				return `${tempTime.minutes().toString().replace('-', '')} minute(s)`;
			}
		}
	}

	getTotal() {
		let total = 0;
		this.todaysActivity.forEach(card => {
			// tslint:disable-next-line:radix
			total += parseInt(this.getDiff(card.TimeIn, card.TimeOut, true));
		});
		let tempTime = moment.duration(total);
		if (tempTime.hours() > 0) {
			this.dayTotal = `${tempTime.hours().toString().replace('-', '')}  hour(s) ${tempTime.minutes().toString().replace('-', '')} minute(s)`;
		} else {
			this.dayTotal = `${tempTime.minutes().toString().replace('-', '')} minute(s)`;
		}
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
			this.getTodayHours();
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
