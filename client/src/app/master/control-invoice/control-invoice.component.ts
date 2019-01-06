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
		ServiceType: '',
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
		FranchiseId: ''
	};
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
	panelsStriped: any;
	customPinstriping = false;
	customPinstripes = { description: '', value: 0 };
	newCarRate = 0;
	prices = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 200];
	paymentMethods = ['Cash', 'PO', 'Check', 'Other', 'None'];
	serviceTypes = ['Pinstripe repair', 'Pinstripe repair & Paint protection', 'New car pinstriping', 'Vinyl wrap', 'Signs', 'Decals', 'Paint protection with install', 'Paint protection no install', 'Window tint', 'Other'];
	stockNumber = '';
	manualAmountInput = false;
	ppfAdded = [];
	panelOptions = [
		{ id: 1, model: 'First panel', value: 0 },
		{ id: 2, model: 'Second panel', value: 0 },
		{ id: 3, model: 'Third panel', value: 0 },
		{ id: 4, model: 'Fourth panel', value: 0 },
		{ id: 5, model: 'Fifth panel', value: 0 },
		{ id: 6, model: 'Sixth panel', value: 0 },
		{ id: 7, model: 'Seventh panel', value: 0 },
		{ id: 8, model: 'Whole car', value: 0 }
	];
	ppfOptions = [
		{ id: 1, model: 'Edge guard', value: 0 },
		{ id: 2, model: 'Door cup', value: 0 },
		{ id: 3, model: 'Whole fender', value: 0 },
		{ id: 4, model: 'Partial fender', value: 0 },
		{ id: 5, model: 'Full hood', value: 0 },
		{ id: 6, model: 'Partial hood', value: 0 },
		{ id: 7, model: 'Front bumper', value: 0 },
		{ id: 8, model: 'Rear bumper', value: 0 },
		{ id: 9, model: 'Mirror', value: 0 },
		{ id: 10, model: 'Stone guard', value: 0 },
		{ id: 11, model: 'Other', value: 0 }
	];
	windowOptions = [
		{ id: 1, model: 'Roll up window', quantity: 0, value: 0 },
		{ id: 2, model: 'Butterfly window', quantity: 0, value: 0 },
		{ id: 3, model: 'Back windshield', quantity: 0, value: 0 },
		{ id: 4, model: 'Tint removal', quantity: 0, value: 0 },
		{ id: 5, model: 'Other', quantity: 0, value: 0 }
	];


	// tslint:disable-next-line:max-line-length
	constructor(private authService: AuthService, private messagingService: MessageService, private invoiceService: InvoiceService, private utilService: UtilService) {
		this.loadInvoices();
		this.loadFranchises();
		this.getClients();
	}

	ngOnInit() {
	}

	clearZeros() {
		this.panelOptions.forEach(opt => {
			if (opt.value === 0) {
				opt.value = null;
			}
		});
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

	addPPF(ppf) {
		const converted = { id: this.ppfAdded.length + 1, model: ppf.model, value: ppf.value };
		this.ppfAdded.push(converted);
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
		Object.keys(this.panelOptions).forEach(key => {
			this.Invoice.Total += this.panelOptions[key].value;
		});
		const newCars = (this.vins.length + this.stocks.length) * this.newCarRate;
		this.Invoice.Total += newCars;
		this.getPPFValues();
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

	removePPF(ppf) {
		this.ppfAdded.splice(this.ppfAdded.indexOf(ppf), 1);
	}

	submitInvoice() {
		if (this.Invoice.PaymentMethod === 'None') {
			this.Invoice.Paid = false;
		}
		this.totalPanels();
		this.Invoice.VIN = this.vins.toString();
		this.Invoice.Stock = this.stocks.toString();
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
			this.invoiceService.updateInvoice(this.selectedId, this.Invoice).subscribe(res => {
				console.log(res);
			});
		}
		console.log('invoice: ', this.Invoice);
		setTimeout(() => this.notifySocket(), 500);
		setTimeout(() => this.utilService.processInvoices(), 500);
		this.clearForm();
	}

	totalPanels() {
		if (this.Invoice.ServiceType === 'New car pinstriping' || this.Invoice.ServiceType === 'Pinstripe repair & Paint protection') {
			switch (this.panelsStriped) {
				case 8: this.Invoice.Description = this.Invoice.Description = `One vehicle pinstriped`; break;
				case 1: this.Invoice.Description = `One panel striped for $$${this.panelOptions[0].value}.`; break;
				case 2: this.Invoice.Description = `Two panels striped at the rate of:\n First Panel: $${this.panelOptions[0].value}\n Second Panel: $${this.panelOptions[1].value}`; break;
				case 3: this.Invoice.Description = `Three panels striped at the rate of:\n First Panel: $${this.panelOptions[0].value}\n Second Panel: $${this.panelOptions[1].value}\n Thrid Panel: $${this.panelOptions[2].value}`; break;
				case 4: this.Invoice.Description = `Four panels striped at the rate of:\n First Panel: $${this.panelOptions[0].value}\n Second Panel: $${this.panelOptions[1].value}\n Thrid Panel: $${this.panelOptions[2].value}\n Fourth Panel: $${this.panelOptions[3].value} `; break;
				case 4: this.Invoice.Description = `Five panels striped at the rate of:\n First Panel: $${this.panelOptions[0].value}\n Second Panel: $${this.panelOptions[1].value}\n Thrid Panel: $${this.panelOptions[2].value}\n Fourth Panel: $${this.panelOptions[3].value}\n Fifth Panel: $${this.panelOptions[4].value} `; break;
				case 6: this.Invoice.Description = `Six panels striped at the rate of:\n First Panel: $${this.panelOptions[0].value}\n Second Panel: $${this.panelOptions[1].value}\n Thrid Panel: $${this.panelOptions[2].value}\n Fourth Panel: $${this.panelOptions[3].value}\n Fifth Panel: $${this.panelOptions[4].value}\n Sixth Panel: $${this.panelOptions[5].value}`; break;
				case 7: this.Invoice.Description = `Seven panels striped at the rate of:\n First Panel: $${this.panelOptions[0].value}\n Second Panel: $${this.panelOptions[1].value}\n Thrid Panel: $${this.panelOptions[2].value}\n Fourth Panel: $${this.panelOptions[3].value}\n Fifth Panel: $${this.panelOptions[4].value}\n Sixth Panel: $${this.panelOptions[5].value}\n Seventh Panel: $${this.panelOptions[6].value}`; break;
			}
		}
	}

	totalNewCars() {
		if (this.Invoice.ServiceType === 'New car pinstriping') {
			const totalCars = this.vins.length + this.stocks.length;
			this.Invoice.Description = this.Invoice.Description = `${totalCars} vehicle(s) pinstriped`;
		}
	}

	editInvoice(id) {
		this.clearForm();
		this.editing = true;
		this.invoiceService.getInvoice(id).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				const data = JSON.parse(JSON.stringify(events.body));
				this.Invoice = data;
				this.selectedId = data.id;
				// tslint:disable-next-line:radix
				this.Invoice.Total = parseInt(this.Invoice.Total);
				if (this.Invoice.VIN !== '') {
					this.vins = JSON.parse('[' + data.VIN + ']');
				}
				if (this.Invoice.Stock !== '') {
					this.stocks = JSON.parse('[' + data.Stock + ']');
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
			{ id: 1, model: 'Roll up window', quantity: 0, value: 0 },
			{ id: 2, model: 'Butterfly window', quantity: 0, value: 0 },
			{ id: 3, model: 'Back windshield', quantity: 0, value: 0 },
			{ id: 4, model: 'Tint removal', quantity: 0, value: 0 },
			{ id: 5, model: 'Other', quantity: 0, value: 0 }
		];
		this.ppfAdded = [];
		this.addRO = false;
		this.addStock = false;
		this.addVIN = false;
		this.addDescription = false;
		this.customPinstriping = false;
		this.customPinstripes = { description: '', value: 0 };
	}

	clearTotals() {
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
		this.Invoice.Total = 0;
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
