import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { NgModel } from '../../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';
import { MessageService } from '../../../services/message.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-invoice-search',
	templateUrl: './invoice-search.component.html',
	styleUrls: ['./invoice-search.component.css']
})
export class InvoiceSearchComponent implements OnInit {

	@ViewChild('calendar') calendar: any;
	@ViewChild('calendar2') calendar2: any;
	@Output() editThis = new EventEmitter();
	clients: any;
	invoices: any;
	franchises: any;
	dateFrom = '';
	dateTo = '';
	invoiceNumber = '';
	franchise: any;

	constructor(private authService: AuthService, private messagingService: MessageService, private invoiceService: InvoiceService, public utilService: UtilService) {
		this.loadInvoices();
		this.loadFranchises();
		this.getClients();
	}

	ngOnInit() {
	}

	// need to write new api to get invoices by franchise
	// that api needs to only get results for selected dates
	// dates to and from need to default to today
	// need to write another api that searches by invoice number

	getClients() { // need this so I can filter on clients
		this.utilService.processClients();
		this.utilService.clients.subscribe(response => {
			this.clients = response;
		});
	}

	loadInvoices() {
		this.utilService.processInvoices();
		this.utilService.invoices.subscribe(response => {
			this.invoices = response;
			console.log('ivoices from invoice search: ', response);
		});
	}

	loadFranchises() { // for master mode
		if (this.authService.currentUser.Role.toLowerCase().search('super|honcho') >= 0) {
			this.utilService.processFranchises();
			this.utilService.franchises.subscribe(response => {
				this.franchises = response;
			});
		}
	}

	editInvoice(invoice) {
		this.editThis.emit(invoice);
	}

	formatDate(date) {
		return moment(date).format('MMMM Do YYYY');
	}

	openCalendar(event) {
		event.preventDefault();
		this.calendar.open();
	}

	openCalendar2(event) {
		event.preventDefault();
		this.calendar2.open();
	}


}
