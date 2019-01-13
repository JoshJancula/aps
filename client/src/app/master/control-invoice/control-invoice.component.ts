import { Component, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';
import { MessageService } from '../../services/message.service';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceSearchComponent } from './invoice-search/invoice-search.component';
import * as moment from 'moment';
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

	constructor(private authService: AuthService, private messagingService: MessageService, private invoiceService: InvoiceService, private utilService: UtilService) {
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
