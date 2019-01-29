import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-bottom-popup',
	templateUrl: './bottom-popup.component.html',
	styleUrls: ['./bottom-popup.component.css']
})
export class BottomPopupComponent implements OnInit {

	constructor(private bottomSheetRef: MatBottomSheetRef<BottomPopupComponent>) { }

	ngOnInit() {
	}

	openUsers() {
		this.bottomSheetRef.dismiss('users');
		event.preventDefault();
	}

	openFranchises() {
		this.bottomSheetRef.dismiss('franchises');
		event.preventDefault();
	}

	openClients() {
		this.bottomSheetRef.dismiss('clients');
		event.preventDefault();
	}

	openAppointments() {
		this.bottomSheetRef.dismiss('appointments');
		event.preventDefault();
	}

	openInvoices() {
		this.bottomSheetRef.dismiss('invoices');
		event.preventDefault();
	}

	openSettings() {
		this.bottomSheetRef.dismiss('settings');
		event.preventDefault();
	}

}
