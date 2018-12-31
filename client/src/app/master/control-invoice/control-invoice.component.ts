import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';


@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-control-invoice',
	templateUrl: './control-invoice.component.html',
	styleUrls: ['./control-invoice.component.css']
})
export class ControlInvoiceComponent implements OnInit {

	Invoice: any = {
		Employee: '',
		Client: '',
		Total: '',
		Paid: false,
		PaymentMethod: '',
		PO: '',
		RO: '',
		VIN: '',
		Stock: '',
		Description: '',
		Comments: '',
		ServiceType: '',
		FranchiseId: ''
	};
	invoices: any;
	editing = false;
	selectedId = '';
	franchises: any;

	constructor(private invoiceService: InvoiceService, private utilService: UtilService) {
		this.loadFranchises();
	}

	ngOnInit() {
		this.getInvoices();
	}

	getInvoices() {
		this.invoiceService.getInvoices().subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				this.invoices = JSON.parse(JSON.stringify(events.body));
			}
		});
	}

	loadFranchises() {
		this.utilService.processFranchises();
		this.utilService.franchises.subscribe(response => {
			this.franchises = response;
		});
	}

	submitInvoice() {
		if (this.editing === false) {
			this.invoiceService.createInvoice(this.Invoice).subscribe(res => {
				console.log('response: ', res);
			}, error => {
				console.log('error: ', error);
			});
		} else {
			this.invoiceService.updateInvoice(this.selectedId, this.Invoice).subscribe(res => {
				console.log(res);
			});
		}
		this.getInvoices();
		this.clearForm();
	}

	editInvoice(id) {
		this.editing = true;
		this.invoiceService.getInvoice(id).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				const data = JSON.parse(JSON.stringify(events.body));
				this.Invoice = data;
				this.selectedId = data.id;
			}
		});
	}

	clearForm() {
		this.Invoice = {
			Name: '',
			Active: true
		};
		this.editing = false;
		this.selectedId = '';
	}

	deleteInvoice(id) {
		this.invoiceService.deleteInvoice(id).subscribe(res => {
			console.log(`delete: ${res}`);
			if (res === 1) {
				this.getInvoices();
			} else {
				console.log('error deleting');
			}
		});
	}

}
