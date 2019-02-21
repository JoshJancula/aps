import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import * as moment from 'moment';
import { UtilService } from '../services/util.service';
import { TimeChangeDialogComponent } from '../time-change-dialog/time-change-dialog.component';
import { TimecardService } from '../services/timecard.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-timesheet-dialog',
	templateUrl: './timesheet-dialog.component.html',
	styleUrls: ['./timesheet-dialog.component.css']
})
export class TimesheetDialogComponent implements OnInit {

	dates = [];
	weekTotal: any;
	_printIframe: any;
	employeeName: '';
	tempDates: any;
	updateConnection: any;

	constructor(private timeCardService: TimecardService, public utilService: UtilService, private dialog: MatDialog, public authService: AuthService, private emailService: EmailService, public dialogRef: MatDialogRef<TimesheetDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		const temp = this.utilService.sortDates(this.data.Cards);
		let tempDates = [];
		Object.keys(temp).forEach(key => { temp[key].data.forEach(k => { tempDates.push(k); }); this.dates.push(temp[key]); });
		this.weekTotal = this.utilService.getTotalTime(tempDates);
		this.tempDates = tempDates;
		console.log('name: ', this.data.Name);
		this.employeeName = this.data.Name;
	}

	formatMinutes(a) {
		return moment(a).format('hh:mm');
	}

	editTimecard(card) {
		const newDialog = this.dialog.open(TimeChangeDialogComponent, {
			data: { timeIn: card.TimeIn, timeOut: card.TimeOut },
			disableClose: true
		});
		console.log('card: ', card);
		newDialog.beforeClose().subscribe(result => {
			const toSave = newDialog.componentInstance.saveData;
			const diffIn = newDialog.componentInstance.diffIn;
			const diffOut = newDialog.componentInstance.diffOut;
			const addIn = newDialog.componentInstance.addIn;
			const addOut = newDialog.componentInstance.addOut;
			if (toSave === true) {
				let data = {
					TimeIn: undefined,
					TimeOut: undefined,
					id: card.id
				};
				if (addIn === true) { data.TimeIn = moment(card.TimeIn).add(diffIn, 'milliseconds'); }
				if (addOut === true) { data.TimeOut = moment(card.TimeOut).add(diffOut, 'milliseconds'); }
				if (addIn === false) { data.TimeIn = moment(card.TimeIn).subtract(diffIn, 'milliseconds'); }
				if (addOut === false) { data.TimeOut = moment(card.TimeOut).subtract(diffOut, 'milliseconds'); }
				this.timeCardService.updateTimecard(card.id, data).subscribe(res2 => {
					console.log('clock out response: ', res2);
					card.TimeIn = data.TimeIn;
					card.TimeOut = data.TimeOut;
					this.weekTotal = this.utilService.getTotalTime(this.tempDates);
					// need to put a notify socket here
				}, error => { console.log('error updating timecard'); });
			}
		});
	}

	clockUserOut(card) {
		const data = {
			TimeIn: card.TimeIn,
			TimeOut: moment(new Date()),
			id: card.id
		};
		this.timeCardService.updateTimecard(card.id, data).subscribe(res2 => {
			console.log('clock out response: ', res2);
			card.TimeOut = data.TimeOut;
			this.weekTotal = this.utilService.getTotalTime(this.tempDates);
		}, error => {
			console.log('error clocking user out: ', error);
		});
	}

	getPDF(action) {
		const div = document.querySelector('#mainContent');
		const message = `${this.employeeName}, ${this.data.Range.Start} ${this.data.Range.End} `;
		this.utilService.generatePDF(action, div, message);
	}


}
