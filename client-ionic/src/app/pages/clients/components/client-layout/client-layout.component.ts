import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { ClientService } from 'src/app/services/client.service';
import { UtilService } from 'src/app/services/util.service';
import { PhonePipe } from 'src/app/pipes/phone.pipe';
import { Client } from 'src/app/models/client.model';
import { Subscription } from 'rxjs';
import { Franchise } from 'src/app/models/franchise.model';

@Component({
  selector: 'app-client-layout',
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.scss'],
})
export class ClientLayoutComponent implements OnInit, OnDestroy {

  public Client: Client = new Client();
  public clients: Client[] = [];
  public franchises: Franchise[] = [];
  public editing = false;
  public selectedId = null;
  public addClient = false;
  public searchClients = true;
  private subscriptions: Subscription[] = [];

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
    console.log('on destroy lifecycle called');
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  public setView(): void {
    if (this.searchClients === true) {
      this.searchClients = false;
      this.addClient = true;
    } else {
      this.searchClients = true;
      this.addClient = false;
    }
  }

  private notifySocket(): void {
    const data = { Franchise: this.authService.currentUser.FranchiseId, MessageType: 'update', Action: 'clients' };
    this.messagingService.sendUpdate(data);
  }

  private getClients(): void {
    this.subService.processClients();
    this.subscriptions.push(
      this.subService.clients.subscribe((response: Client[]) => {
        this.sortClients(response);
      }));
  }

  private sortClients(arr: Client[]): void {
    arr.sort((a, b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0));
    this.clients = arr;
  }

  public submitClient(): void {
    if (this.editing === false) {
      this.Client.FranchiseId = this.authService._franchiseInfo.id;
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

  private resetScreen(): void {
    setTimeout(() => this.subService.processClients(), 500);
    setTimeout(() => this.notifySocket(), 500);
    this.clearForm();
    this.setView();
  }

  public editClient(data: Client): void {
    this.editing = true;
    this.addClient = true;
    this.searchClients = false;
    this.selectedId = data.id;
    this.Client = new Client(data);
  }

  public clearForm(): void {
    this.Client = new Client();
    this.editing = false;
    this.selectedId = null;
  }

  public deleteClient(id: number): void {
    this.clientService.deleteClient(id).then(res => {
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

  public formatPhone(): void {
    this.Client.Phone = this.phonePipe.transform(this.Client.Phone);
  }

}
