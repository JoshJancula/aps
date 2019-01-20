import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { EmailService } from '../services/email.service';

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

	constructor(private emailService: EmailService, public dialogRef: MatDialogRef<InvoicePreviewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		console.log('invoice passed to preview: ', this.data);
		this.setServices(this.data);

	}

	print() {
		// const printContents = document.querySelector('#previewContent').innerHTML;
		// let w = window.open();
		// w.document.write(printContents);
		// w.document.write('<scr' + 'ipt type="text/javascript">' + 'window.onload = function() { window.print(); window.close(); };' + '</sc' + 'ript>');
		// w.document.close(); // necessary for IE >= 10
		// w.focus(); // necessary for IE >= 10
		// return true;
		window.focus();
		window.print();
		}

	formatDate(date) {
		return moment(date).format('MMMM Do YYYY');
	}

	emailInvoice() {
		// const div: HTMLDivElement = document.querySelector('#previewContent');
		this.emailService.sendInvoice('hello world');
		console.log('sending email from emailInvoice()');
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
			const calc = newTotal * 0.0725;
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
		const parsed =  JSON.parse(data.CustomPinstripe);
		if (parsed.quantity > 0) {
			let service = { name: parsed.description, quantity: parsed.quantity, pricePer: parsed.value, totalPrice: (parsed.value * parsed.quantity) };
			this.serviceDisplay.push(service);
		}
	}

}
