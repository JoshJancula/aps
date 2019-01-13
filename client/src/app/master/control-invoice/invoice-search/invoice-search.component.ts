import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { InvoiceService } from '../../../services/invoice.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import { HttpEventType } from '@angular/common/http';

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
	invoices = [];
	franchises: any;
	invoiceNumber = '';
	franchise: any;
	searchBy = '';
	filter: any = {
		dateFrom: new Date(),
		dateTo: new Date(),
		employee: '',
		invoiceNumber: '',
		franchise: this.authService.currentUser.FranchiseId,
		client: ''
	};
	controlArray: any;
	searchOptions = ['Invoice number', 'Employee', 'Client'];

	constructor(private invoiceService: InvoiceService, private authService: AuthService, public utilService: UtilService) {
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
			if (response.status === 200 && response.type === 4) {
				this.applyFilter(response.body);
			}
		}, error => {
			console.log('error trying to get invoices: ', error);
		});
	}

	processSearch() {
		if (this.searchBy === 'Invoice number') {
			// get invoice by ID
			this.getInvoiceByNumber();
		} else {
			this.loadInvoices();
		}
	}

	getInvoiceByNumber() {
		this.invoiceService.getInvoice(this.filter.invoiceNumber).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				// const data = JSON.parse(JSON.stringify(events.body));
				this.invoices = [];
				this.invoices.push(events.body);
				console.log('events.body: ', events.body);
			}
		});
	}

	applyFilter(data) {
		let returnThis = [];
		data.forEach(invoice => {
			if (this.filter.employee !== '') {
				if (invoice.Employee.toLowerCase().indexOf(this.filter.employee.toLowerCase()) > -1) { returnThis.push(invoice); }
			} else if (this.filter.client !== '') {
				if (invoice.Client.toLowerCase().indexOf(this.filter.client.toLowerCase()) > -1) { returnThis.push(invoice); }
			} else { returnThis.push(invoice); }
		});
		this.invoices = returnThis;
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
		this.searchBy = '';
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
