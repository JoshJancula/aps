import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';
import { MessageService } from '../../services/message.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-control-invoice',
	templateUrl: './control-invoice.component.html',
	styleUrls: ['./control-invoice.component.css']
})
export class ControlInvoiceComponent implements OnInit {

	Invoice: any = {
		Employee: '',
		EmployeeId: '',
		ServiceType: '',
		Client: '',
		Total: '',
		Paid: '',
		PaymentMethod: '',
		PO: '',
		CheckNumber: '',
		RO: '',
		VIN: '',
		Stock: '',
		Description: '',
		Comments: '',
		FranchiseId: ''
	};
	invoices: any;
	editing = false;
	selectedId = '';
	selectFromClients = false;
	addRO = false;
	addStock = false;
	addVIN = false;
	clients: any;
	franchises: any;
	paymentMethods = ['Cash', 'PO', 'Check', 'Other', 'None'];
	serviceTypes = ['Pinstriping repair', 'Pinstriping repair & Paint protection', 'New car pinstriping', 'Vinyl wrap', 'Signs', 'Decals', 'Paint protection with install',  'Paint protection no install', 'Other'];
	stockNumber = '';
	vehicles = [];


	// tslint:disable-next-line:max-line-length
	constructor(private authService: AuthService, private messagingService: MessageService, private invoiceService: InvoiceService, private utilService: UtilService) {
		this.loadInvoices();
		this.loadFranchises();
		this.getClients();
	}

	ngOnInit() {
	}

	getClients() {
		this.utilService.processClients();
		this.utilService.clients.subscribe(response => {
			this.clients = response;
		});
	}

	loadInvoices() {
		this.utilService.processInvoices();
		this.utilService.invoices.subscribe(response => {
			this.invoices = response;
			console.log('ivoices: ', response);
		});
	}

	notifySocket() {
		const data = { MessageType: 'update', Action: 'invoices' };
		this.messagingService.sendUpdate(data);
	}

	loadFranchises() {
		this.utilService.processFranchises();
		this.utilService.franchises.subscribe(response => {
			this.franchises = response;
		});
	}

	pushVehicle() {
		console.log('stock to push: ', this.stockNumber);
		this.vehicles.push(this.stockNumber);
		console.log('vehicles: ', this.vehicles);
		this.stockNumber = '';
	}

	removeVehicle(vehicle) {
		console.log('vehicle to remove: ', vehicle);
		this.vehicles.splice(this.vehicles.indexOf(vehicle), 1);
	}

	submitInvoice() {
		if (this.Invoice.PaymentMethod === 'None') {
			this.Invoice.Paid = false;
		}
		this.Invoice.VIN = this.vehicles.toString();
		console.log('invoice before save: ', this.Invoice);
		if (this.editing === false) {
			this.Invoice.Employee = this.authService.currentUser.Name;
			this.Invoice.EmployeeId = this.authService.currentUser.id;
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
		this.utilService.processInvoices();
		this.notifySocket();
		this.clearForm();
	}

	editInvoice(id) {
		this.clearForm();
		this.editing = true;
		this.invoiceService.getInvoice(id).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				const data = JSON.parse(JSON.stringify(events.body));
				console.log('data for getInvoice: ', data);
				this.Invoice = data;
				this.selectedId = data.id;
				if (this.Invoice.VIN !== '') {
					this.vehicles = JSON.parse('[' + data.VIN + ']');
				}
			}
		});
	}

	clearForm() {
		this.Invoice = {
			Employee: '',
			EmployeeId: '',
			ServiceType: '',
			Client: '',
			Total: '',
			Paid: '',
			PaymentMethod: '',
			PO: '',
			CheckNumber: '',
			RO: '',
			VIN: '',
			Stock: '',
			Description: '',
			Comments: '',
			FranchiseId: ''
		};
		this.vehicles = [];
		this.stockNumber = '';
		this.editing = false;
		this.selectedId = '';
	}

	deleteInvoice(id) {
		this.invoiceService.deleteInvoice(id).subscribe(res => {
			console.log(`delete: ${res}`);
			if (res === 1) {
				this.clearForm();
				this.utilService.processInvoices();
				this.notifySocket();
			} else {
				console.log('error deleting');
			}
		});
	}

}
