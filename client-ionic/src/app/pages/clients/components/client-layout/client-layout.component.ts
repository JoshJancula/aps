import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { ClientService } from 'src/app/services/client.service';
import { UtilService } from 'src/app/services/util.service';
import { PhonePipe } from 'src/app/pipes/phone.pipe';

@Component({
  selector: 'app-client-layout',
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.scss'],
})
export class ClientLayoutComponent implements OnInit, OnDestroy {

  public Client: any = {
    Name: '',
    Address: '',
    Phone: '',
    Email: '',
    ContactPerson: '',
    Description: '',
    FranchiseId: this.authService.currentUser.FranchiseId
  };

  public clients = [];
  public franchises: any;
  public editing = false;
  public selectedId = '';
  public addClient = false;
  public searchClients = true;

  public subscriptions = [];

  constructor(
    private subService: SubscriptionsService,
    private authService: AuthService,
    private messagingService: MessageService,
    private clientService: ClientService,
    private utilService: UtilService,
    private phonePipe: PhonePipe) { }

  ngOnInit(): void {
    this.getClients();
  }

  ngOnDestroy(): void {
    console.log('destroy lifecycle called');
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  public setView() {
    if (this.searchClients === true) {
      this.searchClients = false;
      this.addClient = true;
    } else {
      this.searchClients = true;
      this.addClient = false;
    }
  }

  private notifySocket() {
    const data = { Franchise: this.authService.currentUser.FranchiseId, MessageType: 'update', Action: 'clients' };
    this.messagingService.sendUpdate(data);
  }

  private getClients() {
    this.subService.processClients();
    this.subscriptions.push(
      this.subService.clients.subscribe(response => {
        this.sortClients(response);
      }));
  }

  private sortClients(obj) {
    obj.sort((a, b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0));
    this.clients = obj;
  }

  public submitClient() {
    // if ((<any>window).deviceReady === true) {
    //   (<any>window).Keyboard.hide();
    // }
    if (this.editing === false) {
      this.clientService.createClient(this.Client).then(res => {
        this.resetScreen();
        console.log('response: ', res);
      }, error => {
        console.log('error: ', error);
      }).catch(e => { console.log('error creating... ', e); });
    } else {
      this.clientService.updateClient(this.selectedId, this.Client).then(response => {
        this.resetScreen();
        console.log('respnse: ', response);
      }).catch(err => { console.log('error updating client... ', err); });
    }
  }

  private resetScreen() {
    setTimeout(() => this.subService.processClients(), 500);
    setTimeout(() => this.notifySocket(), 500);
    this.clearForm();
    this.setView();
  }

  public editClient(data) {
    this.editing = true;
    this.addClient = true;
    this.searchClients = false;
    this.Client = data;
    this.selectedId = data.id;
  }

  public clearForm() {
    // if ((<any>window).deviceReady === true) {
    //   (<any>window).Keyboard.hide();
    // }
    this.Client = {
      Name: '',
      Address: '',
      Phone: '',
      Email: '',
      ContactPerson: '',
      Description: '',
      FranchiseId: this.authService.currentUser.FranchiseId
    };
    this.editing = false;
    this.selectedId = '';
  }

  public deleteClient(id) {
    this.clientService.deleteClient(id).then(res => {
      console.log(`delete: ${res}`);
      if (res === 1) {
        this.clearForm();
        this.subService.processClients();
        this.notifySocket();
      } else {
        console.log('error deleting');
      }
    }).catch(e => {
      console.log('e deleting client... ', e);
    });
  }

  public formatPhone() {
    this.Client.Phone = this.phonePipe.transform(this.Client.Phone);
  }

}
