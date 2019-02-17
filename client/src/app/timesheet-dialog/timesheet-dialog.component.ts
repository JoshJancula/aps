import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { InvoicePreviewComponent } from '../master/control-invoice/invoice-preview/invoice-preview.component';
import * as moment from 'moment';
import { UtilService } from '../services/util.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-timesheet-dialog',
	templateUrl: './timesheet-dialog.component.html',
	styleUrls: ['./timesheet-dialog.component.css']
})
export class TimesheetDialogComponent implements OnInit {

	dates = [];
	weekTotal: any;

	constructor(public utilService: UtilService, private dialog: MatDialog, public authService: AuthService, private emailService: EmailService, public dialogRef: MatDialogRef<InvoicePreviewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		console.log('data: ', this.data);
		let wt = 0;
		const temp = this.utilService.sortDates(this.data);
		let tempDates = [];
		Object.keys(temp).forEach(key => { temp[key].data.forEach(k => tempDates.push(k)); this.dates.push(temp[key]);  });
		this.weekTotal = this.utilService.getTotalTime(tempDates);
		console.log('weekTotal: ', this.weekTotal);
	}

	formatMinutes(a) {
		return moment(a).format('hh:mm');
	}

}
