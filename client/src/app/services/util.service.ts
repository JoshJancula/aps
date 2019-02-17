import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import * as moment from 'moment';

@Injectable({
	providedIn: 'root'
})
export class UtilService {

	constructor(public dialog: MatDialog, private router: Router, private authService: AuthService, private http: HttpClient) { }

	alertError(message) {
		const newDialog = this.dialog.open(ErrorDialogComponent, {
			data: message,
			panelClass: 'errorAlert'
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

	getTotalTime(activity) {
		let total = 0;
		activity.forEach(card => {
			// tslint:disable-next-line:radix
			total += parseInt(this.getDiff(card.TimeIn, card.TimeOut, true));
		});
		let tempTime = moment.duration(total);
		if (tempTime.hours() > 0) {
			return `${tempTime.hours().toString().replace('-', '')}  hour(s) ${tempTime.minutes().toString().replace('-', '')} minute(s)`;
		} else {
			return `${tempTime.minutes().toString().replace('-', '')} minute(s)`;
		}
	}


}
