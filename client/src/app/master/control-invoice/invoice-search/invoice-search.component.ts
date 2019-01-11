import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
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
	invoiceNumber = '';
	franchise: any;
	filter: any = {
		dateFrom: new Date(),
		dateTo: new Date(),
		employee: '',
		invoiceNumber: '',
		franchise: this.authService.currentUser.FranchiseId,
		client: ''
	};

	constructor(private authService: AuthService, public utilService: UtilService) {
		this.loadInvoices();
		this.loadFranchises();
		this.getClients();
	}

	ngOnInit() {
	}

	getClients() { // need this so I can filter on clients
		this.utilService.processClients();
		this.utilService.clients.subscribe(response => {
			this.clients = response;
		});
	}

	public loadInvoices() {
		this.utilService.processInvoices(this.filter);
		this.utilService.invoices.subscribe(response => {
			this.invoices = response.body;
		});
	}

	clearSearch() {
		this.filter = {
			dateFrom: new Date(),
			dateTo: new Date(),
			employee: '',
			invoiceNumber: '',
			franchise: this.authService.currentUser.FranchiseId,
			client: ''
		};
		this.loadInvoices();
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
