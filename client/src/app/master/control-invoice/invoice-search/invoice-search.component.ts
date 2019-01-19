import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { InvoiceService } from '../../../services/invoice.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { InvoicePreviewComponent } from '../../../invoice-preview/invoice-preview.component';
import { Router } from '@angular/router';

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
	@Output() newInvoice = new EventEmitter();
	clients: any;
	invoices = [];
	franchises: any;
	invoiceNumber = '';
	franchise: any;
	searchBy = '';
	slideDrawer = false;
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
	display = '';

	constructor(private router: Router, private dialog: MatDialog, private invoiceService: InvoiceService, private authService: AuthService, public utilService: UtilService) {
		this.loadInvoices();
		this.loadFranchises();
		this.getClients();
	}

	ngOnInit() {
	}

	openDrawer() {
		console.log('slide drawer');
		if (this.slideDrawer === false) {
			this.slideDrawer = true;
		} else {
			this.slideDrawer = false;
		}
	}

	getClients() { // need this so I can filter on clients
		this.utilService.processClients();
		this.utilService.clients.subscribe(response => {
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
		this.utilService.processInvoices(this.filter);
		this.utilService.invoices.subscribe(response => {
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
			} else if (moment(newTemp).isSame(moment(this.filter.dateFrom).format('MM/DD/YYYY'))) {
				if (moment(invoice.Date).format('MM/DD/YYYY') === newTemp) { returnThis.push(invoice); }
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

	// editInvoice(invoice) {
	// 	this.editThis.emit(invoice);
	// }

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

	openPreview(invoice) {
		const newDialog = this.dialog.open(InvoicePreviewComponent, {
			data: invoice,
			panelClass: 'invoicePreview'
			// height: '300px',
			// width: '360px;',
		});
	}

}
