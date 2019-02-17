import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { InvoicePreviewComponent } from '../master/control-invoice/invoice-preview/invoice-preview.component';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-timesheet-dialog',
	templateUrl: './timesheet-dialog.component.html',
	styleUrls: ['./timesheet-dialog.component.css']
})
export class TimesheetDialogComponent implements OnInit {

	constructor(private dialog: MatDialog, public authService: AuthService, private emailService: EmailService, public dialogRef: MatDialogRef<InvoicePreviewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		console.log('data: ', this.data);
	}

}
