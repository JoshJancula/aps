import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { InvoiceService } from '../../../services/invoice.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { InvoicePreviewComponent } from '../invoice-preview/invoice-preview.component';
import { Router } from '@angular/router';
import * as jsPDF from 'jspdf';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-invoice-search',
	templateUrl: './invoice-search.component.html',
	styleUrls: ['./invoice-search.component.css']
})
export class InvoiceSearchComponent implements OnInit {

	@ViewChild('calendar') calendar: any;
	@ViewChild('calendar2') calendar2: any;
	@ViewChild('searchPanel') searchPanel: any;
	@Output() editThis = new EventEmitter();
	@Output() newInvoice = new EventEmitter();
	clients: any;
	invoices = [];
	franchises: any;
	invoiceNumber = '';
	franchise: any;
	isCordova = false;
	searchBy = '';
	slideDrawer = false;
	filter: any = {
		dateFrom: new Date(),
		dateTo: new Date(),
		employee: '',
		invoiceNumber: '',
		franchise: this.authService.currentUser.FranchiseId,
		client: '',
		payment: '',
	};
	controlArray: any;
	payments = ['Paid', 'Unpaid'];
	searchOptions = ['Invoice number', 'Employee', 'Client', 'Payment'];
	display = '';
	_printIframe;

	constructor(private subService: SubscriptionsService, private router: Router, private dialog: MatDialog, private invoiceService: InvoiceService, private authService: AuthService, public utilService: UtilService) {
	}

	ngOnInit() {
		this.loadInvoices();
		this.loadFranchises();
		this.getClients();
		setTimeout(() => this.checkCordova(), 500);
		this.searchPanel.open();
	}

	checkCordova() {
		if ((<any>window).deviceReady === true) {
			this.isCordova = true;
		}
	}

	openDrawer() {
		if (window.outerWidth < 769) {
		if (this.slideDrawer === false) {
			this.slideDrawer = true;
		} else {
			this.slideDrawer = false;
		}
	}
	}

	getClients() { // need this so I can filter on clients
		this.subService.processClients();
		this.subService.clients.subscribe(response => {
			this.clients = response;
		});
	}

	setDisplay() {
		let temp = new Date();
		let newTemp = moment(temp).format('MM/DD/YYYY');
		if (moment(newTemp).isSame(moment(this.filter.dateFrom).format('MM/DD/YYYY'))) {
			this.display = `Today's invoices`;
		} else {
			this.display = `${this.formatDateDisplay(this.filter.dateFrom)} - ${this.formatDateDisplay(this.filter.dateTo)}`;
		}
	}

	public loadInvoices() {
		this.subService.processInvoices(this.filter);
		this.subService.invoices.subscribe(response => {
			console.log('res status: ', response.status);
			if (response.status === 401) {
				this.router.navigate([`/`], {});
			}
			if (response.status === 200 && response.type === 4) {
				this.applyFilter(response.body);
				this.setDisplay();
			}
		}, error => {
			console.log('error trying to get invoices: ', error);
			if (error.status === 401) { this.subService.clearData(); }
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
				this.invoices = [];
				this.invoices.push(events.body);
			}
		});
	}

	applyFilter(data) {
		let returnThis = [];
		let temp = new Date();
		let newTemp = moment(temp).format('MM/DD/YYYY');
		data.forEach(invoice => {
			if (this.filter.employee !== '') {
				if (invoice.Employee.toLowerCase().indexOf(this.filter.employee.toLowerCase()) > -1) { returnThis.push(invoice); }
			} else if (this.filter.client !== '') {
				if (invoice.Client.toLowerCase().indexOf(this.filter.client.toLowerCase()) > -1) { returnThis.push(invoice); }
			} else if (this.filter.payment !== '') {
				if (this.filter.payment === 'Paid') {
					if (invoice.Paid === true) { returnThis.push(invoice); }
				} else {
					if (invoice.Paid === false) { returnThis.push(invoice); }
				}
			} else { returnThis.push(invoice); }
		});
		this.invoices = returnThis;
	}

	clearSearch() {
		console.log(moment.utc().local());
		this.filter = {
			dateFrom: new Date(),
			dateTo: new Date(),
			employee: '',
			invoiceNumber: '',
			franchise: this.authService.currentUser.FranchiseId,
			client: '',
			payment: ''
		};
		this.searchBy = '';
		this.loadInvoices();
	}

	loadFranchises() { // for master mode
		if (this.authService.currentUser.Role.toLowerCase().search('super|honcho') >= 0) {
			this.subService.processFranchises();
			this.subService.franchises.subscribe(response => {
				this.franchises = response;
			});
		}
	}

	formatDate(date) {
		return moment(date).format('MMMM Do YYYY');
	}

	formatDateDisplay(date) {
		return moment(date).format('MM/DD/YYYY');
	}

	openCalendar(event) {
		event.preventDefault();
		this.calendar.open();
	}

	openCalendar2(event) {
		event.preventDefault();
		this.calendar2.open();
	}

	getMinDate() {
		return this.filter.dateFrom;
	}

	getMaxDate() {
		return new Date();
	}

	openPreview(invoice) {
		const newDialog = this.dialog.open(InvoicePreviewComponent, {
			data: { content: invoice, action: 'open' },
			panelClass: 'invoicePreview'
		});
		newDialog.beforeClose().subscribe(result => {
			setTimeout(() => this.loadInvoices(), 2000);
		});
	}

	printInvoice(invoice) {
		const newDialog = this.dialog.open(InvoicePreviewComponent, {
			data: { content: invoice, action: 'print' },
			panelClass: 'invoicePreview'
		});
	}

	emailInvoice(invoice) {
		const newDialog = this.dialog.open(InvoicePreviewComponent, {
			data: { content: invoice, action: 'email' },
			panelClass: 'invoicePreview'
		});
	}

	downloadPDF(invoice) {
		const newDialog = this.dialog.open(InvoicePreviewComponent, {
			data: { content: invoice, action: 'download' },
			panelClass: 'invoicePreview'
		});
	}

}
