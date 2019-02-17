import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { InvoicePreviewComponent } from '../master/control-invoice/invoice-preview/invoice-preview.component';
import * as moment from 'moment';
import { UtilService } from '../services/util.service';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

	constructor(public utilService: UtilService, private dialog: MatDialog, public authService: AuthService, private emailService: EmailService, public dialogRef: MatDialogRef<InvoicePreviewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		console.log('data: ', this.data);
		let wt = 0;
		const temp = this.utilService.sortDates(this.data.Cards);
		let tempDates = [];
		Object.keys(temp).forEach(key => { temp[key].data.forEach(k => { this.employeeName = k.EmployeeName; tempDates.push(k); }); this.dates.push(temp[key]); });
		this.weekTotal = this.utilService.getTotalTime(tempDates);
		console.log('weekTotal: ', this.weekTotal);
	}

	formatMinutes(a) {
		return moment(a).format('hh:mm');
	}

	generatePDF(action) {
		const data = document.querySelector('#mainContent');
		html2canvas(data).then(canvas => {
			const imgWidth = 210;
			const imgHeight = canvas.height * imgWidth / canvas.width;
			const contentDataURL = canvas.toDataURL('image/png');
			let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
			let position = 0;
			pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
			if (action === 'download') {
				setTimeout(() => { pdf.save(`${this.employeeName}, ${this.data.Range.Start} ${this.data.Range.End} `); }, 1000); // Generated PDF
			} else {
				let blob = pdf.output('blob');
				this.print(blob);
				this.dialogRef.close();
			}
		});
	}

	print(blob) {
		const fileUrl = URL.createObjectURL(blob);
		let iframe = this._printIframe;
		if (!this._printIframe) {
			iframe = this._printIframe = document.createElement('iframe');
			document.body.appendChild(iframe);
			iframe.style.display = 'none';
			iframe.onload = function () {
				setTimeout(() => {
					iframe.focus();
					iframe.contentWindow.print();
				}, 100);
			};
		}
		iframe.src = fileUrl;
	}


}
