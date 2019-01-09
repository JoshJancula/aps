import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';
import { MessageService } from '../../services/message.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';

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
		Stripes: '',
		Tint: '',
		PPF: '',
		OtherServices: '',
		Client: '',
		Total: 0,
		Paid: '',
		PaymentMethod: '',
		PO: '',
		CheckNumber: '',
		RO: '',
		VIN: '',
		Stock: '',
		Description: '',
		VehicleDescription: '',
		Comments: '',
		Vehicle: '',
		EditedBy: '',
		FranchiseId: ''
	};
	serviceSelected = false;
	searchInvoices = false;
	addInvoice = true;
	invoices: any;
	editing = false;
	selectedId = '';
	selectFromClients = false;
	addRO = false;
	addStock = false;
	addVIN = false;
	addDescription = false;
	additionalServices = false;
	clients: any;
	franchises: any;
	vins = [];
	stocks = [];
	vehicles = [];
	panelsStriped: any;
	customPinstriping = false;
	customPinstripes = { description: '', value: 0 };
	newCarRate = 0;
	numbers = [];
	prices = [];
	paymentMethods = ['Cash', 'PO', 'Check', 'Other', 'None'];
	stockNumber = '';
	manualAmountInput = false;
	ppfAdded = [];
	panelOptions: any = [
		{ id: 1, model: 'First panel', value: 0 },
		{ id: 2, model: 'Second panel', value: 0 },
		{ id: 3, model: 'Third panel', value: 0 },
		{ id: 4, model: 'Fourth panel', value: 0 },
		{ id: 5, model: 'Fifth panel', value: 0 },
		{ id: 6, model: 'Sixth panel', value: 0 },
		{ id: 7, model: 'Seventh panel', value: 0 },
		{ id: 8, model: 'Whole car', value: 0 }
	];
	ppfOptions: any = [
		{ id: 1, model: 'Edge guard', value: 0, quantity: 0, selected: false },
		{ id: 2, model: 'Door cup', value: 0, quantity: 0, selected: false },
		{ id: 3, model: 'Whole fender', value: 0, quantity: 0, selected: false },
		{ id: 4, model: 'Partial fender', value: 0, quantity: 0, selected: false },
		{ id: 5, model: 'Full hood', value: 0, quantity: 0, selected: false },
		{ id: 6, model: 'Partial hood', value: 0, quantity: 0, selected: false },
		{ id: 7, model: 'Front bumper', value: 0, quantity: 0, selected: false },
		{ id: 8, model: 'Rear bumper', value: 0, quantity: 0, selected: false },
		{ id: 9, model: 'Mirror', value: 0, quantity: 0, selected: false },
		{ id: 10, model: 'Stone guard', value: 0, quantity: 0, selected: false },
		{ id: 11, model: 'Other', value: 0, quantity: 0, selected: false }
	];
	windowOptions: any = [
		{ id: 1, model: 'Roll up window', quantity: 0, value: 0, selected: false },
		{ id: 2, model: 'Butterfly window', quantity: 0, value: 0, selected: false },
		{ id: 3, model: 'Back windshield', quantity: 0, value: 0, selected: false },
		{ id: 4, model: 'Tint removal', quantity: 0, value: 0, selected: false },
		{ id: 5, model: 'Other', quantity: 0, value: 0, selected: false }
	];
	serviceTypes: any = [
		{ id: 0, model: 'Decals', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }] },
		{ id: 1, model: 'New car pinstriping', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }] },
		{ id: 2, model: 'Paint protection', checked: false, array: true, optionsArray: this.ppfOptions },
		{ id: 3, model: 'Pinstripe repair', checked: false, array: true, optionsArray: this.panelOptions },
		{ id: 4, model: 'Window tint', checked: false, array: true, optionsArray: this.windowOptions },
		{ id: 5, model: 'Signs', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }] },
		{ id: 6, model: 'Vinyl wrap', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }] },
		{ id: 7, model: 'Other', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }] }
	];

	// tslint:disable-next-line:max-line-length
	constructor(private authService: AuthService, private messagingService: MessageService, private invoiceService: InvoiceService, private utilService: UtilService) {
		this.loadInvoices();
		this.loadFranchises();
		this.getClients();
	}

	ngOnInit() {
		this.generateNumbers();
	}

	clearZeros() {
		this.panelOptions.forEach(opt => {
			if (opt.value === 0) {
				opt.value = null;
			}
		});
	}

	generateNumbers() {
		for (let i = 1; i < 201; i++) {
			this.numbers.push(i);
			const five = i * 5;
			this.prices.push(five);
		}
	}

	setView() {
		if (this.searchInvoices === true) {
			this.searchInvoices = false;
			this.addInvoice = true;
		} else {
			this.searchInvoices = true;
			this.addInvoice = false;
		}
	}

	addService() {
		this.serviceSelected = false;
		this.serviceTypes.forEach(type => {
			if (type.checked === true) {
				this.serviceSelected = true;
			}
		});
		this.updateTotal();
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

	updateTotal() {
		this.Invoice.Total = 0;
		this.serviceTypes.forEach(service => {
			if (service.checked === true) { // all other services
				if (service.id !== 2 && service.id !== 3 && service.id !== 4) {
					console.log('this.serviceTypes:', this.serviceTypes);
					this.Invoice.Total  += (service.optionsArray[0].value * service.optionsArray[0].quantity);
				}
				if (service.id === 2) { // ppf
					this.ppfOptions.forEach(ppf => {
						this.Invoice.Total  += (ppf.value * ppf.quantity);
					});
				}
				if (service.id === 3) { // stripes by panel
					this.panelOptions.forEach(panel => {
						this.Invoice.Total  += panel.value;
					});
				}
				if (service.id === 4) { // window tinting
					this.windowOptions.forEach(win => {
						this.Invoice.Total  += (win.value * win.quantity);
					});
				}
			}
		});
	}

	getPPFValues() {
		this.ppfAdded.forEach(ppf => {
			this.Invoice.Total += ppf.value;
		});
	}

	pushVehicle() {
		if (this.addStock === true) {
			this.stocks.push(this.stockNumber);
			this.stockNumber = '';
		} else {
			this.vins.push(this.stockNumber);
			this.stockNumber = '';
		}
		this.updateTotal();
	}

	removeVehicle(vehicle) {
		if (this.stocks.indexOf(vehicle), 1) {
			this.stocks.splice(this.stocks.indexOf(vehicle), 1);
		}
		if (this.vins.indexOf(vehicle), 1) {
			this.vins.splice(this.vins.indexOf(vehicle), 1);
		}
	}

	updateInvoiceData() {
		if (this.Invoice.PaymentMethod === 'None') {
			this.Invoice.Paid = false;
		}
		if (this.authService.currentUser.Role !== 'Super' && this.authService.currentUser.Role !== 'Honch' && this.authService.currentUser.Role !== 'Manager' && this.authService.currentUser.Role !== 'Owner') {
			this.Invoice.Paid = false;
		}
		this.Invoice.VIN = this.vins.toString();
		this.Invoice.Stock = this.stocks.toString();
		if (this.serviceTypes[2].checked === true) {
			this.Invoice.PPF = JSON.stringify(this.ppfOptions);
		}
		if (this.serviceTypes[3].checked === true) {
			this.Invoice.Stripes = JSON.stringify(this.panelOptions);
		}
		if (this.serviceTypes[4].checked === true) {
			this.Invoice.Tint = JSON.stringify(this.windowOptions);
		}
		this.Invoice.OtherServices = JSON.stringify(this.serviceTypes);
	}

	submitInvoice() {
		this.updateTotal();
		this.updateInvoiceData();
		if (this.editing === false) {
			this.Invoice.Employee = this.authService.currentUser.Name;
			this.Invoice.EmployeeId = this.authService.currentUser.id;
			this.Invoice.FranchiseId = this.authService.currentUser.FranchiseId;
			this.invoiceService.createInvoice(this.Invoice).subscribe(res => {
				console.log('response: ', res);
			}, error => {
				console.log('error: ', error);
			});
		} else {
			this.Invoice.EditedBy = this.authService.currentUser.Name;
			this.invoiceService.updateInvoice(this.selectedId, this.Invoice).subscribe(res => {
				console.log(res);
			});
		}
		setTimeout(() => this.notifySocket(), 500);
		setTimeout(() => this.utilService.processInvoices(), 500);
		this.clearForm();
	}

	editInvoice(id) {
		this.clearForm();
		this.searchInvoices = false;
		this.addInvoice = true;
		this.editing = true;
		this.invoiceService.getInvoice(id).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				const data = JSON.parse(JSON.stringify(events.body));
				console.log('data: ', data);
				this.Invoice = data;
				this.selectedId = data.id;
				// tslint:disable-next-line:radix
				this.Invoice.Total = parseInt(this.Invoice.Total);
				this.setupEdit(data);
			}
		});
	}

	setupEdit(data) {
		if (data.Tint !== '') {
			this.windowOptions =  JSON.parse(data.Tint);
		}
		if (data.Stripes !== '') {
			this.panelOptions =  JSON.parse(data.Stripes);
		}
		if (data.PPF !== '') {
			this.ppfOptions =  JSON.parse(data.PPF);
		}
		if (this.Invoice.VIN !== '') {
			this.vins = JSON.parse('[' + data.VIN + ']');
		}
		if (this.Invoice.Stock !== '') {
			this.stocks = JSON.parse('[' + data.Stock + ']');
		}
		this.serviceTypes = JSON.parse(data.OtherServices);
		console.log('invoice: ', this.Invoice);
		console.log('serviceTypes: ', this.serviceTypes);
	}

	clearForm() {
		this.Invoice = {
			Employee: '',
			EmployeeId: '',
			Stripes: '',
			Tint: '',
			PPF: '',
			Client: '',
			Total: 0,
			Paid: '',
			PaymentMethod: '',
			PO: '',
			CheckNumber: '',
			RO: '',
			VIN: '',
			Stock: '',
			Description: '',
			OtherServices: '',
			VehicleDescription: '',
			Comments: '',
			Vehicle: '',
			EditedBy: '',
			FranchiseId: ''
		};
		this.stocks = [];
		this.vins = [];
		this.stockNumber = '';
		this.editing = false;
		this.selectedId = '';
		this.selectFromClients = false;
		this.panelsStriped = '';
		this.newCarRate = 0;
		this.ppfAdded = [];
		this.addRO = false;
		this.addStock = false;
		this.addVIN = false;
		this.addDescription = false;
		this.customPinstriping = false;
		this.stocks = [];
		this.vins = [];
		this.panelsStriped = '';
		this.newCarRate = 0;
		this.panelOptions = [
			{ id: 1, model: 'First panel', value: 0 },
			{ id: 2, model: 'Second panel', value: 0 },
			{ id: 3, model: 'Third panel', value: 0 },
			{ id: 4, model: 'Fourth panel', value: 0 },
			{ id: 5, model: 'Fifth panel', value: 0 },
			{ id: 6, model: 'Sixth panel', value: 0 },
			{ id: 7, model: 'Seventh panel', value: 0 },
			{ id: 8, model: 'Whole car', value: 0 }
		];
		this.windowOptions = [
			{ id: 1, model: 'Roll up window', quantity: 0, value: 0, selected: false },
			{ id: 2, model: 'Butterfly window', quantity: 0, value: 0, selected: false },
			{ id: 3, model: 'Back windshield', quantity: 0, value: 0, selected: false },
			{ id: 4, model: 'Tint removal', quantity: 0, value: 0, selected: false },
			{ id: 5, model: 'Other', quantity: 0, value: 0, selected: false }
		];
		this.ppfOptions = [
			{ id: 1, model: 'Edge guard', value: 0, quantity: 0, selected: false },
			{ id: 2, model: 'Door cup', value: 0, quantity: 0, selected: false },
			{ id: 3, model: 'Whole fender', value: 0, quantity: 0, selected: false },
			{ id: 4, model: 'Partial fender', value: 0, quantity: 0, selected: false },
			{ id: 5, model: 'Full hood', value: 0, quantity: 0, selected: false },
			{ id: 6, model: 'Partial hood', value: 0, quantity: 0, selected: false },
			{ id: 7, model: 'Front bumper', value: 0, quantity: 0, selected: false },
			{ id: 8, model: 'Rear bumper', value: 0, quantity: 0, selected: false },
			{ id: 9, model: 'Mirror', value: 0, quantity: 0, selected: false },
			{ id: 10, model: 'Stone guard', value: 0, quantity: 0, selected: false },
			{ id: 11, model: 'Other', value: 0, quantity: 0, selected: false }
		];
		this.serviceTypes = [
			{ id: 0, model: 'Decals', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }] },
			{ id: 1, model: 'New car pinstriping', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }] },
			{ id: 2, model: 'Paint protection', checked: false, array: true, optionsArray: [{ value: 0, quantity: 0 }] },
			{ id: 3, model: 'Pinstripe repair', checked: false, array: true, optionsArray: this.panelOptions },
			{ id: 4, model: 'Window tint', checked: false, array: true, optionsArray: this.windowOptions },
			{ id: 5, model: 'Signs', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }] },
			{ id: 6, model: 'Vinyl wrap', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }] },
			{ id: 7, model: 'Other', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }] }
		];
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

	formatDate(date) {
		return moment(date).format('MMMM Do YYYY');
	}

}
