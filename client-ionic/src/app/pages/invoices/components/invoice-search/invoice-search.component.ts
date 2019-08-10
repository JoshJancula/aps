import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as jsPDF from 'jspdf';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { InvoicePreviewComponent } from 'src/app/components/invoice-preview/invoice-preview.component';
import { InvoiceService } from 'src/app/services/invoice.service';
import { Client } from 'src/app/models/client.model';
import { Invoice } from 'src/app/models/invoice.model';
import { Franchise } from 'src/app/models/franchise.model';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-invoice-search',
  templateUrl: './invoice-search.component.html',
  styleUrls: ['./invoice-search.component.css']
})
export class InvoiceSearchComponent implements OnInit, OnDestroy {

  @ViewChild('calendar', null) calendar: any;
  @ViewChild('calendar2', null) calendar2: any;
  @ViewChild('searchPanel', null) searchPanel: any;
  @Output() editThis = new EventEmitter();
  @Output() newInvoice = new EventEmitter();
  public clients: Client[];
  public invoices: Invoice[] = [];
  public franchises: Franchise[] = [];
  public invoiceNumber: any = null;
  public franchise: Franchise = null;
  public isCordova: boolean = false;
  public searchBy: string = '';
  public slideDrawer: boolean = false;
  public filter: any = {
    dateFrom: new Date().toISOString(),
    dateTo: new Date().toISOString(),
    employee: '',
    invoiceNumber: '',
    franchise: this.authService.currentUser.FranchiseId,
    client: '',
    payment: '',
  };
  public controlArray: any = [];
  public payments: string[] = ['Paid', 'Unpaid'];
  public searchOptions: string[] = ['Invoice number', 'Employee', 'Client', 'Payment'];
  public display: string = '';
  // tslint:disable-next-line:variable-name
  private _printIframe: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private subService: SubscriptionsService,
    private router: Router,
    private dialog: MatDialog,
    private invoiceService: InvoiceService,
    public authService: AuthService,
    public utilService: UtilService) { }

  ngOnInit(): void {
    this.loadInvoices();
    this.loadFranchises();
    this.getClients();
    setTimeout(() => this.checkCordova(), 500);
    this.searchPanel.open();
  }

  ngOnDestroy(): void {
    console.log('destroy lifecycle called');
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  public checkCordova(): void {
    if ((<any>window).deviceReady === true) {
      this.isCordova = true;
    }
  }

  public openDrawer(): void {
    if (window.outerWidth < 769) {
      if (this.slideDrawer === false) {
        this.slideDrawer = true;
      } else {
        this.slideDrawer = false;
      }
    }
  }

  public getClients(): void { // need this so I can filter on clients
    this.subService.processClients();
    this.subscriptions.push(
      this.subService.clients.subscribe((response: Client[]) => {
        this.clients = response;
      }));
  }

  public setDisplay(): void {
    const temp = new Date();
    const newTemp = moment(temp).format('MM/DD/YYYY');
    if (moment(newTemp).isSame(moment(this.filter.dateFrom).format('MM/DD/YYYY'))) {
      this.display = `Today's invoices`;
    } else {
      this.display = `${this.formatDateDisplay(this.filter.dateFrom)} - ${this.formatDateDisplay(this.filter.dateTo)}`;
    }
  }

  public loadInvoices(): void {
    this.subService.processInvoices(this.filter);
    this.subscriptions.push(
      this.subService.invoices.subscribe((response: Invoice[]) => {
        console.log('res status: ', response);
        if ((<any>response).status === 401) {
          this.router.navigate([`/`], {});
        }
        if ((<any>response).status === 200 && (<any>response).type === 4) {
          this.applyFilter((<any>response).body);
          this.setDisplay();
        }
      }, error => {
        console.log('error trying to get invoices: ', error);
        if (error.status === 401) { this.authService.logout(); }
      }));
  }

  public processSearch(): void {
    if (this.searchBy === 'Invoice number') {
      // get invoice by ID
      this.getInvoiceByNumber();
    } else {
      this.loadInvoices();
    }
  }

  public getInvoiceByNumber(): void {
    this.invoiceService.getInvoice(this.filter.invoiceNumber).then((inv: Invoice) => {
        this.invoices = [];
        this.invoices.push(inv);
    });
  }

  private applyFilter(data: Invoice[]): void {
    const returnThis = [];
    const temp = new Date();
    const newTemp = moment(temp).format('MM/DD/YYYY');
    data.forEach((invoice: Invoice) => {
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

  public clearSearch(): void {
    this.filter = {
      dateFrom: new Date().toISOString(),
      dateTo: new Date().toISOString(),
      employee: '',
      invoiceNumber: '',
      franchise: this.authService.currentUser.FranchiseId,
      client: '',
      payment: ''
    };
    this.searchBy = '';
    this.loadInvoices();
  }

  private loadFranchises(): void { // for master mode
    if (this.authService.currentUser.Role.toLowerCase().search('super|honcho') >= 0) {
      this.subService.processFranchises();
      this.subscriptions.push(
        this.subService.franchises.subscribe((response: Franchise[]) => {
          this.franchises = response;
        }));
    }
  }

  public formatDate(date: Date): string {
    return moment(date).format('MMMM Do YYYY');
  }

  public formatDateDisplay(date: any): string {
    return moment(date).format('MM/DD/YYYY');
  }

  public openCalendar(event: any): void {
    event.preventDefault();
    this.calendar.open();
  }

  public openCalendar2(event: any): void {
    event.preventDefault();
    this.calendar2.open();
  }

  public getMinDate(): Date {
    return this.filter.dateFrom;
  }

  public getMaxDate(): Date {
    return new Date();
  }

  public openPreview(invoice: Invoice): void {
    const newDialog = this.dialog.open(InvoicePreviewComponent, {
      data: { content: invoice, action: 'open' },
      panelClass: 'invoicePreview'
    });
    this.subscriptions.push(
      newDialog.beforeClose().subscribe(result => {
        setTimeout(() => this.loadInvoices(), 2000);
      }));
  }

  public printInvoice(invoice: Invoice): void {
    const newDialog = this.dialog.open(InvoicePreviewComponent, {
      data: { content: invoice, action: 'print' },
      panelClass: 'invoicePreview'
    });
  }

  public emailInvoice(invoice: Invoice): void {
    const newDialog = this.dialog.open(InvoicePreviewComponent, {
      data: { content: invoice, action: 'email' },
      panelClass: 'invoicePreview'
    });
  }

  public downloadPDF(invoice: Invoice): void {
    const newDialog = this.dialog.open(InvoicePreviewComponent, {
      data: { content: invoice, action: 'download' },
      panelClass: 'invoicePreview'
    });
  }

}
