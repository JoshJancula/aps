import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { InvoiceSearchComponent } from './components/invoice-search/invoice-search.component';
import { InvoiceFormComponent } from './components/invoice-form/invoice-form.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
})
export class InvoicesPage implements OnInit, OnDestroy {

  @ViewChild('invoiceSearch', null) invoiceSearch: InvoiceSearchComponent;
  @ViewChild('invoiceForm', null) invoiceForm: InvoiceFormComponent;
  public searchInvoices: boolean = true;
  public addInvoice: boolean = false;
  public showMessages: boolean = false;

  constructor() {
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  public setView(): void {
    if (this.searchInvoices === true) {
      this.searchInvoices = false;
      this.addInvoice = true;
      console.log('switching to add view');
    } else if (this.searchInvoices === false) {
      this.searchInvoices = true;
      this.addInvoice = false;
      console.log('switching to search view');
    }
  }

}
