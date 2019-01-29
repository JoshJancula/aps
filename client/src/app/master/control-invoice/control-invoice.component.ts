import { Component, OnInit, ViewChild } from '@angular/core';
import { InvoiceSearchComponent } from './invoice-search/invoice-search.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-control-invoice',
	templateUrl: './control-invoice.component.html',
	styleUrls: ['./control-invoice.component.css']
})
export class ControlInvoiceComponent implements OnInit {

	@ViewChild('invoiceSearch') invoiceSearch: InvoiceSearchComponent;
	@ViewChild('invoiceForm') invoiceForm: InvoiceFormComponent;
	searchInvoices = true;
	addInvoice = false;

	constructor() {
	}

	ngOnInit() {
	}

	setView() {
		if (this.searchInvoices === true) {
			this.searchInvoices = false;
			this.addInvoice = true;
			console.log('switching to add view');
		} else if (this.searchInvoices === false) {
			this.searchInvoices = true;
			this.addInvoice = false;
			console.log('switching to search view');
		}
	}

}
