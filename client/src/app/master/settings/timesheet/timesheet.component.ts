import { Component, OnInit, ViewChild } from '@angular/core';
import { TimecardService } from '../../../services/timecard.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';
import { TimesheetDialogComponent } from '../../../timesheet-dialog/timesheet-dialog.component';
import * as moment from 'moment';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-timesheet',
	templateUrl: './timesheet.component.html',
	styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

	@ViewChild('timesheetCalendar') timesheetCalendar: any;
	isClockedIn = false;
	todaysActivity: any;
	dayTotal: any;
	dayForTimesheet: any;

	constructor(public dialog: MatDialog, public utilService: UtilService, private authService: AuthService, private timeCardService: TimecardService) { }

	ngOnInit() {
		this.getTodayHours();
	}

	getTodayHours() {
		this.timeCardService.getTodaysTimecards(this.authService.currentUser.id).subscribe(response => {
			if (response) {
				if ((<any>response).length <= 0) {
					this.isClockedIn = false;
				} else {
					(<any>response).forEach(card => {
						if (card.TimeOut === '' || card.TimeOut === null || card.TimeIn === undefined) { this.isClockedIn = true; }
					});
					this.todaysActivity = response;
					this.dayTotal = this.utilService.getTotalTime(response);
				}
			}
		}, error => {
			console.log('error getting timecards: ', error);
		});
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

	openCalendar(event) {
		event.preventDefault();
		this.timesheetCalendar.open();
	}

	getTimesheet() {
		const params = {
			EmployeeId: this.authService.currentUser.id,
			Date: moment(this.dayForTimesheet).format('MM/DD/YYYY')
		};
		this.timeCardService.getRangeTimecards(params).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				if (events.status === 200 && events.type === 4) {
					console.log('currentUser.Name: ', this.authService.currentUser.Name);
					const newDialog = this.dialog.open(TimesheetDialogComponent, {
						data: { Cards: events.body, Range: this.utilService.getDateRange(this.dayForTimesheet), Name: this.authService.currentUser.Name },
						panelClass: 'invoicePreview'
					});
				}
			}
		}, error => {
			console.log('error: ', error);
		});
	}

	getMax() {
		return new Date();
	}

	delete(id) {
		this.timeCardService.deleteTimeCard(id).subscribe(res => {
			console.log('deleted res: ', res);
			this.getTodayHours();
		});
	}

}
