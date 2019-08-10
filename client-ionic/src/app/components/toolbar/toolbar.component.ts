import { Component, OnInit, Output, EventEmitter, Input, ViewChild, OnDestroy } from '@angular/core';
import { BottomPopupComponent } from '../bottom-popup/bottom-popup.component';
import { MatBottomSheet } from '@angular/material';
import { Router } from '@angular/router';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification/ngx';
import { FranchiseService } from 'src/app/services/franchise.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'src/app/services/message.service';
import { MessagingComponent } from '../messaging/messaging.component';
import { HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @ViewChild('messagingComponent', null) messagingComponent: MessagingComponent;
  @ViewChild('appointmentCalendar', null) appointmentCalendar: any;
  public showMessages: boolean = false;
  public screen: string = 'screen title';
  public actionIcons: any = null;
  @Output() public messageClick = new EventEmitter();
  @Output() public actionClick = new EventEmitter();
  @Input() public search: boolean = false;
  @Input() public searchText: string = null;
  @Input() public addText: string = null;
  @Input() public searchIcon: string = null;
  @Input() public addIcon: string = null;
  @Input() public searchDate: string = null;
  private messageConnection: Subscription;
  private updateConnection: Subscription;
  private subscriptions: Subscription[] = [];
  private canSendNotification: boolean = false;
  private pauseTime: any = null;

  constructor(
    private bottomSheetRef: MatBottomSheet,
    private router: Router,
    public subService: SubscriptionsService,
    private backgroundMode: BackgroundMode,
    private localNotification: PhonegapLocalNotification,
    private franchiseService: FranchiseService,
    public authService: AuthService,
    public utilService: UtilService,
    private userService: UserService,
    private messagingService: MessageService
  ) { }

  ngOnInit(): void {
    this.screen = this.router.url.toLocaleUpperCase();
    this.loadFranchiseInfo().then(() => {
      this.messagingService.initSocket();
      this.subscriptions.push(
        this.messagingService.onConnectionMessage().subscribe((response: any) => {
          console.log('all messages response: ', response);
          this.messagingComponent.messages = response.messages;
          if (response.messages.length > 0) { this.messagingComponent.getUsers(); }
        }));
      this.subscribe2OnMessage();
      this.subscribeToUpdates();
      this.enablePushNotification();
      this.sendConnectionMessage();
      this.listenForResume();
    }).catch(e => { if (e.message === 'retry') { this.loadFranchiseInfo(); }});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  public setMessageDisplay(): void {
    this.showMessages = !this.showMessages;
    this.messageClick.emit();
  }

  public openPopup(): void {
    const sheet = this.bottomSheetRef.open(BottomPopupComponent);
    this.subscriptions.push(
      sheet.afterDismissed().subscribe((res) => {
        this.router.navigate([`/${res}`]);
      }));
  }

  public openCalendar(event: any): void {
    event.preventDefault();
    this.appointmentCalendar.open();
  }

  public getMinDate(): Date {
    return new Date();
  }

  private subscribe2OnMessage(): void {
    if (this.messageConnection) { this.messageConnection.unsubscribe(); }
    this.subscriptions.push(
      this.messageConnection = this.messagingService.onMessage().subscribe((response: any) => {
        console.log('socket response: ', response);
        if (response.data.AuthorId === this.authService.currentUser.id || response.data.RecipientId === this.authService.currentUser.id) {
          if (this.messagingComponent.showChat === true) {
            this.messagingComponent.inboxes.forEach(box => {
              if (box.otherUserId === this.messagingComponent.messageChat.otherUserId) {
                box.Messages.push(response.data);
                this.messagingComponent.messageChat.updateRead();
                setTimeout(() => document.getElementById('scrollHere').scrollIntoView(), 30);
              }
            });
          } else {
            this.messagingComponent.messages.push(response.data);
            this.messagingComponent.createInboxes(this.messagingComponent.userStore);
            this.utilService.openSnackBar(`New message from ${response.data.Author}`);
            this.sendPushNotification(response.data);
          }
        }
      }));
  }

  enablePushNotification() {
    if ((<any>window).deviceReady === true) {
      this.localNotification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          this.canSendNotification = true;
        }
      });
    }
  }

  sendPushNotification(data) {
    if (this.canSendNotification === true && this.backgroundMode.isActive() === true) {
      this.localNotification.create('My Title', {
        tag: `New message from ${data.Author}`,
        body: data.Content,
      });
    }
  }

  // test() {
  // 	this.backgroundMode.disableWebViewOptimizations();
  // 	// this.backgroundMode.
  // }

  enableBackground() {
    if ((<any>window).deviceReady === true) {
      this.backgroundMode.enable();
    }
  }

  listenForResume() {
    if ((<any>window).deviceReady === true) {
      document.addEventListener('resume', (e) => {
        this.getUpdates();
      }, false);
      document.addEventListener('pause', (e) => {
        this.pauseTime = moment().add(2, 'hours');
      }, false);
    }
  }

  getUpdates() {
    if (moment(new Date().toISOString()).isBefore(moment(this.pauseTime))) {
      this.messagingService.initSocket();
      this.subscriptions.push(
        this.messagingService.onConnectionMessage().subscribe((response: any) => {
          console.log('all messages response: ', response);
          this.messagingComponent.messages = response.messages;
          if (response.messages.length > 0) { this.messagingComponent.getUsers(); }
        }));
      this.subscribe2OnMessage();
      this.subscribeToUpdates();
      this.sendConnectionMessage();
      this.subService.processClients();
      this.subService.processFranchises();
      this.subService.processUsers();
      this.subService.processInvoices(null);
      this.subService.processAppointments();
      this.processTimeCards();
    } else {
      this.authService.logout();
    }
  }

  private loadFranchiseInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.authService.currentUser.FranchiseId !== '' && this.authService.currentUser.FranchiseId !== null) {
        this.franchiseService.getFranchise(this.authService.currentUser.FranchiseId).then((events) => {
          if ((<any>events).type === HttpEventType.Response) {
            this.authService._franchiseInfo = (<any>events).body;
            resolve();
          }
        }).catch(e => reject());
      } else { reject({message: 'retry'}); }
    });
  }

  private sendConnectionMessage(): void {
    const message = {
      AuthorId: this.authService.currentUser.id,
      MessageType: 'connect',
      FranchiseId: this.authService._franchiseInfo.id
    };
    this.messagingService.sendConnectionInfo(message);
  }

  private subscribeToUpdates(): void {
    this.subscriptions.push(
      this.updateConnection = this.messagingService.onUpdate().subscribe((response: any) => {
        console.log('response: ', response);
        this.processUpdate(response);
      }));
  }

  private processUpdate(data: any): void {
    if (data.Franchise === this.authService.currentUser.FranchiseId) {
      switch (data.Action) {
        case 'updateClients': this.subService.processClients(); break;
        case 'updateFranchises': this.subService.processFranchises(); break;
        case 'updateUsers': this.subService.processUsers(); break;
        case 'updateInvoices': this.subService.processInvoices(null); break; // remember to replace!
        case 'updateAppointments': this.subService.processAppointments(); break;
        case 'updateTimeCards': this.processTimeCards(); break;
      }
    }
  }

  processTimeCards() {
    // if (this.settingsMode === true) {
    // 	if (this.controlSettings.userAction === this.controlSettings.actions[0]) {
    // 		this.controlSettings.timeSheet.getTodayHours();
    // 	}
    // }
  }

  clearStorage() {
    localStorage.removeItem('jwtToken');
  }

}
