import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-input-email-dialog',
	templateUrl: './input-email-dialog.component.html',
	styleUrls: ['./input-email-dialog.component.css']
})
export class InputEmailDialogComponent implements OnInit {

	sendTo = '';

	constructor(public dialogRef: MatDialogRef<InputEmailDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
	}

	setClientEmail() {
		if (this.sendTo !== '') {
			this.sendTo = '';
		} else {
			this.sendTo = this.data.clientEmail;
		}
	}

}
