import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { NgModel } from '../../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';
import { MessageService } from '../../../services/message.service';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceSearchComponent } from '../invoice-search/invoice-search.component';
import * as moment from 'moment';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-invoice-form',
	templateUrl: './invoice-form.component.html',
	styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent implements OnInit {

	@Output() switchToSearch = new EventEmitter();
	Invoice: any = {
		Employee: '',
		EmployeeId: '',
		Stripes: '',
		Tint: '',
		PPF: '',
		OtherServices: '',
		CustomPinstripe: '',
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
		CalcTax: false,
		Comments: '',
		Vehicle: '',
		EditedBy: '',
		FranchiseId: '',
	};
	serviceSelected = false;
	editing = false;
	selectedId = '';
	selectFromClients = false;
	addRO = false;
	addStock = false;
	addVIN = false;
	addDescription = false;
	additionalServices = false;
	calculateTax = false;
	clients: any;
	franchises: any;
	vins = [];
	stocks = [];
	vehicles = [];
	panelsStriped: any;
	customPinstriping = false;
	customPinstripes = { description: 'Custom pinstriping', value: 0, quantity: 0 };
	newCarRate = 0;
	numbers = [];
	prices = [];
	paymentMethods = ['Cash', 'PO', 'Check', 'Other', 'None'];
	stockNumber = '';
	manualAmountInput = false;
	cordova = false;
	fieldsToValidate = [];
	panelOptions: any = [
		{ id: 1, model: 'First panel', value: 45, checked: false },
		{ id: 2, model: 'Second panel', value: 20, checked: false },
		{ id: 3, model: 'Third panel', value: 10, checked: false },
		{ id: 4, model: 'Fourth panel', value: 10, checked: false },
		{ id: 5, model: 'Fifth panel', value: 10, checked: false },
		{ id: 6, model: 'Sixth panel', value: 10, checked: false },
		{ id: 7, model: 'Seventh panel', value: 10, checked: false },
		{ id: 8, model: 'Whole car', value: 95, checked: false }
	];
	windowOptions: any = [
		{ id: 1, model: 'Roll up window', quantity: 0, value: 0, selected: false, error: false },
		{ id: 2, model: 'Butterfly window', quantity: 0, value: 0, selected: false, error: false },
		{ id: 3, model: 'Back windshield', quantity: 0, value: 0, selected: false, error: false },
		{ id: 4, model: 'Tint removal', quantity: 0, value: 0, selected: false, error: false },
		{ id: 5, model: 'Whole car', quantity: 0, value: 0, selected: false, error: false },
		{ id: 6, model: 'Other', quantity: 0, value: 0, selected: false, error: false }
	];
	ppfOptions: any = [
		{ id: 1, model: 'Edge guard', value: 0, quantity: 0, selected: false, error: false },
		{ id: 2, model: 'Door cup', value: 0, quantity: 0, selected: false, error: false },
		{ id: 3, model: 'Whole fender', value: 0, quantity: 0, selected: false, error: false },
		{ id: 4, model: 'Partial fender', value: 0, quantity: 0, selected: false, error: false },
		{ id: 5, model: 'Full hood', value: 0, quantity: 0, selected: false, error: false },
		{ id: 6, model: 'Partial hood', value: 0, quantity: 0, selected: false, error: false },
		{ id: 7, model: 'Front bumper', value: 0, quantity: 0, selected: false, error: false },
		{ id: 8, model: 'Rear bumper', value: 0, quantity: 0, selected: false, error: false },
		{ id: 9, model: 'Mirror', value: 0, quantity: 0, selected: false, error: false },
		{ id: 10, model: 'Stone guard', value: 0, quantity: 0, selected: false, error: false },
		{ id: 11, model: 'Other', value: 0, quantity: 0, selected: false, error: false }
	];
	serviceTypes: any = [
		{ id: 0, model: 'Decals', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }], error: false },
		{ id: 1, model: 'New car pinstriping', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }], error: false },
		{ id: 2, model: 'Paint protection', checked: false, array: true, optionsArray: [{ value: 0, quantity: 0 }], error: false },
		{ id: 3, model: 'Pinstripe repair', checked: false, array: true, optionsArray: this.panelOptions, error: false },
		{ id: 4, model: 'Window tint', checked: false, array: true, optionsArray: this.windowOptions, error: false },
		{ id: 5, model: 'Signs', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }], error: false },
		{ id: 6, model: 'Vinyl wrap', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }], error: false },
		{ id: 7, model: 'Other', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }], error: false }
	];

	constructor(private barcodeScanner: BarcodeScanner, private authService: AuthService, private messagingService: MessageService, private invoiceService: InvoiceService, private utilService: UtilService) {
	}

	ngOnInit() {
		this.loadFranchises();
		this.getClients();
		this.generateNumbers();
		if ((<any>window).deviceReady === true) { this.cordova = true; }
	}

	clearZeros() {
		this.panelOptions.forEach(opt => {
			if (opt.value === 0) {
				opt.value = null;
			}
		});
	}

	generateNumbers() {
		for (let i = 0; i < 201; i++) {
			this.numbers.push(i);
			const five = i * 5;
			this.prices.push(five);
		}
	}

	addService(service) {
		if (service.id === 7 && this.serviceTypes[service.id].checked === true) {
			this.serviceTypes[service.id].model = 'Other';
		}
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

	notifySocket() {
		const data = { Franchise: this.authService.currentUser.FranchiseId, MessageType: 'update', Action: 'invoices' };
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
					this.Invoice.Total += (service.optionsArray[0].value * service.optionsArray[0].quantity);
				}
				if (service.id === 2) { // ppf
					this.ppfOptions.forEach(ppf => {
						this.Invoice.Total += (ppf.value * ppf.quantity);
					});
				}
				if (service.id === 3) { // stripes by panel
					for (let i = 0; i < this.panelsStriped; i++) {
						this.Invoice.Total += this.panelOptions[i].value;
					}
				}
				if (service.id === 4) { // window tinting
					this.windowOptions.forEach(win => {
						this.Invoice.Total += (win.value * win.quantity);
					});
				}
				this.Invoice.Total += (this.customPinstripes.value * this.customPinstripes.quantity);
			}
		});
		if (this.Invoice.CalcTax === true) { this.applyTax(); }
	}

	applyTax() {
		const calc = this.Invoice.Total * this.authService._franchiseInfo.TaxRate;
		const tax = Math.ceil(calc * 100) / 100;
		this.Invoice.Total += tax;
		this.Invoice.Total = Math.ceil(this.Invoice.Total * 100) / 100;
	}

	pushVehicle() {
		if ((<any>window).deviceReady === true) {
			(<any>window).Keyboard.hide();
		}
		if (this.addStock === true) {
			if (this.stocks.indexOf(this.stockNumber) > -1) {
				this.utilService.alertError(`This vehicle has already been added to this invoice.`);
				return;
			} else {
				this.stocks.push(this.stockNumber);
				this.stockNumber = '';
				this.serviceTypes[1].optionsArray[0].quantity = this.stocks.length + this.vins.length;
				this.updateTotal();
			}
		} else {
			if (this.vins.indexOf(this.stockNumber) > -1) {
				this.utilService.alertError(`This vehicle has already been added to this invoice.`);
				return;
			} else {
				this.vins.push(this.stockNumber);
				this.stockNumber = '';
				this.serviceTypes[1].optionsArray[0].quantity = this.stocks.length + this.vins.length;
				this.updateTotal();
			}
		}
		this.updateTotal();
	}

	scanVIN() {
		this.barcodeScanner.scan().then(data => {
			if (this.vins.indexOf(this.stockNumber) > -1) {
				this.utilService.alertError(`This vehicle has already been added to this invoice.`);
				return;
			} else {
				this.vins.push(data.text);
			}
		}).catch(err => {
			console.log('Error', err);
		});
	}

	removeVehicle(vehicle) {
		if (this.stocks.indexOf(vehicle), 1) {
			this.stocks.splice(this.stocks.indexOf(vehicle), 1);
			this.serviceTypes[1].optionsArray[0].quantity = this.stocks.length + this.vins.length;
		}
		if (this.vins.indexOf(vehicle), 1) {
			this.vins.splice(this.vins.indexOf(vehicle), 1);
			this.serviceTypes[1].optionsArray[0].quantity = this.stocks.length + this.vins.length;
		}
		this.updateTotal();
	}

	updateInvoiceData() {
		if (this.Invoice.PaymentMethod === '') {
			this.Invoice.PaymentMethod = 'None';
		}
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
			for (let i = 0; i < this.panelsStriped; i++) {
				this.panelOptions[i].checked = true;
			}
			this.Invoice.Stripes = JSON.stringify(this.panelOptions);
		}
		if (this.serviceTypes[4].checked === true) {
			this.Invoice.Tint = JSON.stringify(this.windowOptions);
		}
		this.Invoice.CustomPinstripe = JSON.stringify(this.customPinstripes);
		this.Invoice.OtherServices = JSON.stringify(this.serviceTypes);
	}

	submitInvoice() {
		if ((<any>window).deviceReady === true) {
			(<any>window).Keyboard.hide();
		}
		this.updateTotal();
		this.updateInvoiceData();
		if (this.editing === false) {
			this.Invoice.Employee = this.authService.currentUser.Name;
			this.Invoice.EmployeeId = this.authService.currentUser.id;
			this.Invoice.FranchiseId = this.authService.currentUser.FranchiseId;
			console.log('invoice to save: ', this.Invoice);
			this.invoiceService.createInvoice(this.Invoice).subscribe(res => {
				console.log('response: ', res);
			}, error => { this.utilService.alertError(`Error submitting invoice, please try again.`); });
		} else {
			this.Invoice.EditedBy = this.authService.currentUser.Name;
			this.invoiceService.updateInvoice(this.selectedId, this.Invoice).subscribe(res => {
				console.log(res);
			}, error => { this.utilService.alertError(`Error submitting invoice, please try again.`); });
		}
		setTimeout(() => this.notifySocket(), 500);
		this.clearForm();
		setTimeout(() => this.switchToSearch.emit(), 600);
	}

	editInvoice(x) {
		this.clearForm();
		this.serviceSelected = true;
		this.editing = true;
		const data = JSON.parse(JSON.stringify(x));
		this.Invoice = data;
		this.selectedId = data.id;
		this.Invoice.CalcTax = data.CalcTax;
		// tslint:disable-next-line:radix
		this.Invoice.Total = parseInt(this.Invoice.Total);
		this.setupEdit(data);
	}

	setupEdit(data) {
		console.log('invoice to edit: ', data);
		if (data.Tint !== '') {
			this.windowOptions = JSON.parse(data.Tint);
		}
		if (data.Stripes !== '') {
			this.panelOptions = JSON.parse(data.Stripes);
			let panels = 0;
			for (let i = 0; i < this.panelOptions.length; i++) {
				if (this.panelOptions[i].checked === true) {
					panels++;
					this.panelsStriped = panels;
				}
			}
		}
		if (data.PPF !== '') {
			this.ppfOptions = JSON.parse(data.PPF);
		}
		if (this.Invoice.VIN !== '') {
			this.vins = JSON.parse('[' + data.VIN + ']');
		}
		if (this.Invoice.Stock !== '') {
			this.stocks = JSON.parse('[' + data.Stock + ']');
		}
		if (this.Invoice.RO !== '') {
			this.addRO = true;
		}
		if (this.Invoice.RO !== '') {
			this.addRO = true;
		}
		if (this.Invoice.Description !== '') {
			this.addDescription = true;
		}
		this.customPinstripes = JSON.parse(data.CustomPinstripe);
		this.serviceTypes = JSON.parse(data.OtherServices);
		if (this.customPinstripes.quantity !== 0) { this.customPinstriping = true; }
		this.updateTotal();
	}

	clearForm() {
		if ((<any>window).deviceReady === true) {
			(<any>window).Keyboard.hide();
		}
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
			CustomPinstripes: '',
			RO: '',
			VIN: '',
			Stock: '',
			Description: '',
			CalcTax: false,
			OtherServices: '',
			VehicleDescription: '',
			Comments: '',
			Vehicle: '',
			EditedBy: '',
			FranchiseId: '',
		};
		this.stocks = [];
		this.vins = [];
		this.stockNumber = '';
		this.editing = false;
		this.selectedId = '';
		this.selectFromClients = false;
		this.panelsStriped = '';
		this.newCarRate = 0;
		this.addRO = false;
		this.addStock = false;
		this.addVIN = false;
		this.addDescription = false;
		this.customPinstriping = false;
		this.customPinstripes = { description: 'Custom pinstriping', value: 0, quantity: 0 };
		this.stocks = [];
		this.vins = [];
		this.panelsStriped = '';
		this.newCarRate = 0;
		this.serviceSelected = false;
		this.manualAmountInput = false;
		this.calculateTax = false;
		this.panelOptions = [
			{ id: 1, model: 'First panel', value: 45, error: false },
			{ id: 2, model: 'Second panel', value: 20, error: false },
			{ id: 3, model: 'Third panel', value: 10, error: false },
			{ id: 4, model: 'Fourth panel', value: 10, error: false },
			{ id: 5, model: 'Fifth panel', value: 10, error: false },
			{ id: 6, model: 'Sixth panel', value: 10, error: false },
			{ id: 7, model: 'Seventh panel', value: 10, error: false },
			{ id: 8, model: 'Whole car', value: 95, error: false }
		];
		this.windowOptions = [
			{ id: 1, model: 'Roll up window', quantity: 0, value: 0, selected: false, error: false },
			{ id: 2, model: 'Butterfly window', quantity: 0, value: 0, selected: false, error: false },
			{ id: 3, model: 'Back windshield', quantity: 0, value: 0, selected: false, error: false },
			{ id: 4, model: 'Tint removal', quantity: 0, value: 0, selected: false, error: false },
			{ id: 5, model: 'Whole car', quantity: 0, value: 0, selected: false, error: false },
			{ id: 6, model: 'Other', quantity: 0, value: 0, selected: false, error: false }
		];
		this.ppfOptions = [
			{ id: 1, model: 'Edge guard', value: 0, quantity: 0, selected: false, error: false },
			{ id: 2, model: 'Door cup', value: 0, quantity: 0, selected: false, error: false },
			{ id: 3, model: 'Whole fender', value: 0, quantity: 0, selected: false, error: false },
			{ id: 4, model: 'Partial fender', value: 0, quantity: 0, selected: false, error: false },
			{ id: 5, model: 'Full hood', value: 0, quantity: 0, selected: false, error: false },
			{ id: 6, model: 'Partial hood', value: 0, quantity: 0, selected: false, error: false },
			{ id: 7, model: 'Front bumper', value: 0, quantity: 0, selected: false, error: false },
			{ id: 8, model: 'Rear bumper', value: 0, quantity: 0, selected: false, error: false },
			{ id: 9, model: 'Mirror', value: 0, quantity: 0, selected: false, error: false },
			{ id: 10, model: 'Stone guard', value: 0, quantity: 0, selected: false, error: false },
			{ id: 11, model: 'Other', value: 0, quantity: 0, selected: false, error: false }
		];
		this.serviceTypes = [
			{ id: 0, model: 'Decals', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }], error: false },
			{ id: 1, model: 'New car pinstriping', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }], error: false },
			{ id: 2, model: 'Paint protection', checked: false, array: true, optionsArray: [{ value: 0, quantity: 0 }], error: false },
			{ id: 3, model: 'Pinstripe repair', checked: false, array: true, optionsArray: this.panelOptions, error: false },
			{ id: 4, model: 'Window tint', checked: false, array: true, optionsArray: this.windowOptions, error: false },
			{ id: 5, model: 'Signs', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }], error: false },
			{ id: 6, model: 'Vinyl wrap', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }], error: false },
			{ id: 7, model: 'Other', checked: false, array: false, optionsArray: [{ value: 0, quantity: 0 }], error: false }
		];
	}

	deleteInvoice(id) {
		this.invoiceService.deleteInvoice(id).subscribe(res => {
			console.log(`delete: ${res}`);
			if (res === 1) {
				this.clearForm();
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
