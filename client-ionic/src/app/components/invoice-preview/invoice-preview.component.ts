import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { EmailService } from 'src/app/services/email.service';
import { AuthService } from 'src/app/services/auth.service';
import { InputEmailDialogComponent } from '../input-email-dialog/input-email-dialog.component';
import { UtilService } from 'src/app/services/util.service';
import { SignatureDialogComponent } from '../signature-dialog/signature-dialog.component';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/models/client.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.css']
})
export class InvoicePreviewComponent implements OnInit, OnDestroy {

  public showTint: boolean = false;
  public serviceDisplay: any[] = [];
  public displayedColumns: string[] = ['name', 'quantity', 'pricePer', 'total'];
  private progress: { percentage: number } = { percentage: 0 };
  public dataSource = new MatTableDataSource<any>([]);
  public vins: string[] = [];
  public stocks: string[] = [];
  public RO: string = null;
  public PO: string = null;
  public Description: string = null;
  public Client: string = null;
  public invoiceNumber: number = 0;
  public tax: number = 0;
  public total: number = 0;
  public grandTotal: number = 0;
  public calcTax: boolean = false;
  public printing: boolean = false;
  public clients: Client[] = [];
  // tslint:disable-next-line:variable-name
  private _printIframe: any;
  public signature: string = null;
  public isCordova: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private subService: SubscriptionsService,
    public uploadService: UploadFileService,
    private utilService: UtilService,
    private dialog: MatDialog,
    public authService: AuthService,
    private emailService: EmailService,
    public dialogRef: MatDialogRef<InvoicePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.setServices(this.data.content);
    setTimeout(() => this.performAction(), 500);
    this.getClients();
    if ((<any>window).deviceReady === true) {
      this.isCordova = true;
    }
    console.log('data passed to invoice: ', this.data.content);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  public performAction(): void {
    switch (this.data.action) {
      case 'print': this.getPDF('print'); break;
      case 'email': this.emailInvoice(); break;
      case 'download': this.getPDF('download'); break;
      case 'open': break;
    }
  }

  private getPDF(action: string): void {
    const div = document.querySelector('#previewContent');
    const message = `Invoice # ${this.invoiceNumber}, ${this.formatDatePDF(this.data.content.createdAt)}`;
    this.utilService.generatePDF(action, div, message);
  }

  public formatDate(date: any): string {
    return moment(date).format('MMMM Do YYYY');
  }

  public formatDatePDF(date: any): string {
    return moment(date).format('MM/DD/YYYY');
  }

  private getClients(): void {
    this.subService.processClients();
    this.subscriptions.push(
    this.subService.clients.subscribe((response: Client[]) => {
      this.clients = response;
    }));
  }

  public emailInvoice(): void {
    let email = '';
    this.clients.forEach(client => {
      if (client.Name === this.data.content.Client) {
        email = client.Email;
      }
    });
    const dialogRef = this.dialog.open(InputEmailDialogComponent, {
      width: '300px',
      data: { clientEmail: email }
    });
    dialogRef.beforeClose().subscribe(result => {
      const sendTo = dialogRef.componentInstance.sendTo;
      // check for email
      if (sendTo !== '' && sendTo !== undefined && sendTo !== null) {
        console.log('should be sending email to: ', sendTo);
        const div: HTMLDivElement = document.querySelector('#hiddenContent');
        this.emailService.sendInvoice(div.innerHTML).then(response => { });
        this.dialogRef.close();
      } else {
        this.dialogRef.close();
        return;
      }
    });
  }

  public setServices(data: any): void {
    this.processOthers(data);
    if (data.Tint !== '' && data.Tint !== null) {
      this.processTint(data);
    }
    if (data.Stripes !== '' && data.Stripes !== null) {
      this.processStripes(data);
    }
    if (data.PPF !== '' && data.PPF !== null) {
      this.processPPF(data);
    }
    if (data.VIN !== '' && data.VIN !== null) {
      this.vins = JSON.parse('[' + data.VIN + ']');
    }
    if (data.Stock !== '' && data.Stock !== null) {
      this.stocks = JSON.parse('[' + data.Stock + ']');
    }
    if (data.RO !== '' && data.RO !== null) {
      this.RO = data.RO;
    }
    if (data.PO !== '' && data.PO !== null) {
      this.PO = data.PO;
    }
    this.calcTax = data.CalcTax;
    this.invoiceNumber = data.id;
    this.Description = data.Description;
    this.Client = data.Client;
    this.dataSource = new MatTableDataSource<any>(this.serviceDisplay);
    this.signature = data.VehicleDescription;
    this.processCustom(data);
    this.getTotal();
  }

  private getTotal(): void {
    let newTotal = 0;
    this.serviceDisplay.forEach(item => {
      newTotal += item.totalPrice;
    });
    this.total = newTotal;
    if (this.calcTax === true) {
      const calc = newTotal * this.authService._franchiseInfo.TaxRate;
      const tax = Math.ceil(calc * 100) / 100;
      this.tax = tax;
      this.grandTotal = tax + newTotal;
    } else {
      this.grandTotal = newTotal;
    }
  }

  private processStripes(data: any) {
    const panelOpts = JSON.parse(data.Stripes);
    let panels = 0;
    const rates = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < panelOpts.length; i++) {
      if (panelOpts[i].checked === true) {
        // tslint:disable-next-line:radix
        rates.push(parseInt(panelOpts[i].value));
        panels++;
      }
    }
    let r2 = '';
    let total = 0;
    rates.forEach(r => { if (rates[0] === r) { r2 += `${r} `; } else { r2 += `, ${r} `; } total += r; });
    const service = { name: 'Pinstriping repair', quantity: `${panels} panels striped`, pricePer: r2, totalPrice: total };
    this.serviceDisplay.push(service);
  }

  private processPPF(data: any): void {
    const options = JSON.parse(data.PPF);
    options.forEach(item => {
      if (item.selected === true) {
        const service = { name: `${item.model} paint protection`, quantity: item.quantity, pricePer: item.value, totalPrice: (item.value * item.quantity) };
        this.serviceDisplay.push(service);
      }
    });
  }

  private processTint(data: any): void {
    const tints = JSON.parse(data.Tint);
    tints.forEach(item => {
      if (item.selected === true) {
        const service = { name: `${item.model} window tint`, quantity: item.quantity, pricePer: item.value, totalPrice: (item.value * item.quantity) };
        this.serviceDisplay.push(service);
      }
    });
  }

  private processOthers(data: any): void {
    const parsed = JSON.parse(data.OtherServices);
    parsed.forEach(item => {
      if (item.id !== 2 && item.id !== 3 && item.id !== 4) {
        if (item.checked === true) {
          const service = { name: item.model, quantity: item.optionsArray[0].quantity, pricePer: item.optionsArray[0].value, totalPrice: (item.optionsArray[0].value * item.optionsArray[0].quantity) };
          this.serviceDisplay.push(service);
        }
      }
    });
  }

  private processCustom(data: any): void {
    const parsed = JSON.parse(data.CustomPinstripe);
    if (parsed.quantity > 0) {
      const service = { name: parsed.description, quantity: parsed.quantity, pricePer: parsed.value, totalPrice: (parsed.value * parsed.quantity) };
      this.serviceDisplay.push(service);
    }
  }

  private convertToBlob(): void {
    const url = this.signature;
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        this.uploadService.pushFileToStorage(blob, this.progress, { value: 'signature', id: this.data.content.id });
      });
  }

  public openSignaturePad(): void {
    const newDialog = this.dialog.open(SignatureDialogComponent, {
      data: '',
      panelClass: 'signaturePad'
    });
    newDialog.beforeClose().subscribe(result => {
      this.signature = newDialog.componentInstance.signatureURL;
      if (this.signature !== '' && this.signature !== null) {
        this.convertToBlob();
      }
    });
  }

}
