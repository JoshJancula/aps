import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { EmailService } from '../../../services/email.service';
import { AuthService } from 'src/app/services/auth.service';
import { InputEmailDialogComponent } from 'src/app/input-email-dialog/input-email-dialog.component';
import { UtilService } from '../../../services/util.service';
import { SignatureDialogComponent } from '../../../signature-dialog/signature-dialog.component';
import { UploadFileService } from '../../../services/upload-file.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-invoice-preview',
	templateUrl: './invoice-preview.component.html',
	styleUrls: ['./invoice-preview.component.css']
})
export class InvoicePreviewComponent implements OnInit {

	showTint = false;
	serviceDisplay = [];
	displayedColumns: string[] = ['name', 'quantity', 'pricePer', 'total'];
	progress: { percentage: number } = { percentage: 0 };
	dataSource = new MatTableDataSource<any>([]);
	vins = [];
	stocks = [];
	RO = '';
	PO = '';
	Description = '';
	Client = '';
	invoiceNumber = 0;
	tax = 0;
	total = 0;
	grandTotal = 0;
	calcTax = false;
	printing = false;
	clients: any;
	_printIframe: any;
	signature = '';
	isCordova = false;

	constructor(private subService: SubscriptionsService, public uploadService: UploadFileService, private utilService: UtilService, private dialog: MatDialog, public authService: AuthService, private emailService: EmailService, public dialogRef: MatDialogRef<InvoicePreviewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		this.setServices(this.data.content);
		setTimeout(() => this.performAction(), 500);
		this.getClients();
		if ((<any>window).deviceReady === true) {
			this.isCordova = true;
		}
		console.log('data passed to invoice: ', this.data.content);
	}

	performAction() {
		switch (this.data.action) {
			case 'print': this.getPDF('print'); break;
			case 'email': this.emailInvoice(); break;
			case 'download': this.getPDF('download'); break;
			case 'open': break;
		}
	}

	getPDF(action) {
		const div = document.querySelector('#previewContent');
		const message = `Invoice # ${this.invoiceNumber}, ${this.formatDatePDF(this.data.content.createdAt)}`;
		this.utilService.generatePDF(action, div, message);
	}

	formatDate(date) {
		return moment(date).format('MMMM Do YYYY');
	}

	formatDatePDF(date) {
		return moment(date).format('MM/DD/YYYY');
	}

	getClients() {
		this.subService.processClients();
		this.subService.clients.subscribe(response => {
			this.clients = response;
		});
	}

	emailInvoice() {
		let email = '';
		this.clients.forEach(client => {
			if (client.Name === this.data.content.Client) {
				email = client.Email;
			}
		});
		const dialogRef = this.dialog.open(InputEmailDialogComponent, {
			width: '300px',
			data: { clientEmail: email }
		});
		dialogRef.beforeClose().subscribe(result => {
			const sendTo = dialogRef.componentInstance.sendTo;
			// check for email
			if (sendTo !== '' && sendTo !== undefined && sendTo !== null) {
				console.log('should be sending email to: ', sendTo);
				const div: HTMLDivElement = document.querySelector('#hiddenContent');
				this.emailService.sendInvoice(div.innerHTML).subscribe(response => { });
				this.dialogRef.close();
			} else {
				this.dialogRef.close();
				return;
			}
		});
	}

	setServices(data) {
		this.processOthers(data);
		if (data.Tint !== '') {
			this.processTint(data);
		}
		if (data.Stripes !== '') {
			this.processStripes(data);
		}
		if (data.PPF !== '') {
			this.processPPF(data);
		}
		if (data.VIN !== '') {
			this.vins = JSON.parse('[' + data.VIN + ']');
		}
		if (data.Stock !== '') {
			this.stocks = JSON.parse('[' + data.Stock + ']');
		}
		if (data.RO !== '') {
			this.RO = data.RO;
		}
		if (data.PO !== '') {
			this.PO = data.PO;
		}
		this.calcTax = data.CalcTax;
		this.invoiceNumber = data.id;
		this.Description = data.Description;
		this.Client = data.Client;
		this.dataSource = new MatTableDataSource<any>(this.serviceDisplay);
		this.signature = data.VehicleDescription;
		this.processCustom(data);
		this.getTotal();
	}

	getTotal() {
		let newTotal = 0;
		this.serviceDisplay.forEach(item => {
			newTotal += item.totalPrice;
		});
		this.total = newTotal;
		if (this.calcTax === true) {
			const calc = newTotal * this.authService._franchiseInfo.TaxRate;
			const tax = Math.ceil(calc * 100) / 100;
			this.tax = tax;
			this.grandTotal = tax + newTotal;
		} else {
			this.grandTotal = newTotal;
		}
	}

	processStripes(data) {
		let panelOpts = JSON.parse(data.Stripes);
		let panels = 0;
		let rates = [];
		for (let i = 0; i < panelOpts.length; i++) {
			if (panelOpts[i].checked === true) {
				// tslint:disable-next-line:radix
				rates.push(parseInt(panelOpts[i].value));
				panels++;
			}
		}
		let r2 = '';
		let total = 0;
		rates.forEach(r => { if (rates[0] === r) { r2 += `${r} `; } else { r2 += `, ${r} `; } total += r; });
		let service = { name: 'Pinstriping repair', quantity: `${panels} panels striped`, pricePer: r2, totalPrice: total };
		this.serviceDisplay.push(service);
	}

	processPPF(data) {
		let options = JSON.parse(data.PPF);
		options.forEach(item => {
			if (item.selected === true) {
				let service = { name: `${item.model} paint protection`, quantity: item.quantity, pricePer: item.value, totalPrice: (item.value * item.quantity) };
				this.serviceDisplay.push(service);
			}
		});
	}

	processTint(data) {
		let tints = JSON.parse(data.Tint);
		tints.forEach(item => {
			if (item.selected === true) {
				let service = { name: `${item.model} window tint`, quantity: item.quantity, pricePer: item.value, totalPrice: (item.value * item.quantity) };
				this.serviceDisplay.push(service);
			}
		});
	}

	processOthers(data) {
		const parsed = JSON.parse(data.OtherServices);
		parsed.forEach(item => {
			if (item.id !== 2 && item.id !== 3 && item.id !== 4) {
				if (item.checked == true) {
					let service = { name: item.model, quantity: item.optionsArray[0].quantity, pricePer: item.optionsArray[0].value, totalPrice: (item.optionsArray[0].value * item.optionsArray[0].quantity) };
					this.serviceDisplay.push(service);
				}
			}
		});
	}

	processCustom(data) {
		const parsed = JSON.parse(data.CustomPinstripe);
		if (parsed.quantity > 0) {
			let service = { name: parsed.description, quantity: parsed.quantity, pricePer: parsed.value, totalPrice: (parsed.value * parsed.quantity) };
			this.serviceDisplay.push(service);
		}
	}

	convertToBlob() {
		const url = this.signature;
		fetch(url)
			.then(res => res.blob())
			.then(blob => {
				this.uploadService.pushFileToStorage(blob, this.progress, { value: 'signature', id: this.data.content.id });
			});
	}

	openSignaturePad() {
		const newDialog = this.dialog.open(SignatureDialogComponent, {
			data: '',
			panelClass: 'signaturePad'
		});
		newDialog.beforeClose().subscribe(result => {
			this.signature = newDialog.componentInstance.signatureURL;
			if (this.signature !== '') {
				this.convertToBlob();
			}
		});
	}

}
