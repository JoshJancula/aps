import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { AuthService } from '../../services/auth.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-bottom-popup',
  templateUrl: './bottom-popup.component.html',
  styleUrls: ['./bottom-popup.component.css']
})
export class BottomPopupComponent implements OnInit {

  constructor(public authService: AuthService, private bottomSheetRef: MatBottomSheetRef<BottomPopupComponent>) { }

  ngOnInit() {
  }

  openUsers() {
    this.bottomSheetRef.dismiss('staff');
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
    this.bottomSheetRef.dismiss('home');
    event.preventDefault();
  }

}
