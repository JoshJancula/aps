import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { AuthService } from 'src/app/services/auth.service';
import { PhonePipe } from 'src/app/pipes/phone.pipe';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'src/app/services/message.service';
import { FranchiseService } from 'src/app/services/franchise.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { Franchise } from 'src/app/models/franchise.model';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-franchise-layout',
  templateUrl: './franchise-layout.component.html',
  styleUrls: ['./franchise-layout.component.scss'],
})
export class FranchiseLayoutComponent implements OnInit, OnDestroy {

  public Franchise: Franchise = new Franchise();
  public franchises: Franchise[];
  public editing: boolean = false;
  public selectedId: any = null;
  public searchFranchises: boolean = true;
  public addFranchise: boolean = false;
  public User: User = new User();

  public location: string = null; // this is dummy right now;
  private subscriptions: Subscription[] = [];

  constructor(
    private subService: SubscriptionsService,
    public authService: AuthService,
    private phonePipe: PhonePipe,
    private userService: UserService,
    private messagingService: MessageService,
    private franchiseService: FranchiseService,
    private utilService: UtilService) { }

  ngOnInit(): void {
    this.loadFranchises();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe);
  }


  public setView(): void {
    if (this.searchFranchises === true) {
      this.searchFranchises = false;
      this.addFranchise = true;
    } else {
      this.searchFranchises = true;
      this.addFranchise = false;
    }
  }

  private loadFranchises(): void {
    this.subService.processFranchises();
    this.subscriptions.push(
      this.subService.franchises.subscribe(response => {
        this.franchises = response;
      }));
  }

  private notifySocket(): void {
    const data = { Franchise: this.authService.currentUser.FranchiseId, MessageType: 'update', Action: 'franchises' };
    this.messagingService.sendUpdate(data);
  }

  public submitFranchise(): void {
    if (this.editing === false) {
      this.franchiseService.createFranchise(this.Franchise).then(res => {
        const data = JSON.parse(JSON.stringify(res));
        this.User.FranchiseId = data.id;
        this.submitUser();
        this.postSuccess();
      }).catch(error => {
        console.log('error: ', error);
      });
    } else {
      this.franchiseService.updateFranchise(this.selectedId, this.Franchise).then(res => {
        console.log(res);
        this.postSuccess();
      }).catch(error => {
        console.log('error: ', error);
      });
    }
  }

  private postSuccess(): void {
    setTimeout(() => this.subService.processFranchises(), 500);
    setTimeout(() => this.notifySocket(), 500);
    this.setView();
  }

  public editFranchise(data: Franchise): void {
    this.searchFranchises = false;
    this.addFranchise = true;
    this.editing = true;
    this.Franchise = new Franchise(data);
    this.selectedId = data.id;
  }

  public submitUser(): void {
    this.userService.createUser(this.User).then(res => {
      setTimeout(() => this.subService.processUsers(), 500);
      setTimeout(() => this.notifySocket(), 500);
      setTimeout(() => this.subService.processFranchises(), 600);
      setTimeout(() => this.notifySocket(), 600);
      this.clearForm();
    }).catch(err => { console.log('error creating user... ', err); });
  }

  public clearForm(): void {
    this.Franchise = new Franchise();
    this.editing = false;
    this.selectedId = null;
    this.location = null;
    this.clearUserForm();
  }

  public clearUserForm(): void {
    this.User = new User();
  }

  public deleteFranchise(id: number): void {
    this.franchiseService.deleteFranchise(id).then(res => {
      console.log(`delete: ${res}`);
      if (res === 1) {
        this.clearForm();
        this.subService.processFranchises();
        this.notifySocket();
      } else {
        console.log('error deleting');
      }
    }).catch(error => {
      console.log('error: ', error);
    });
  }

  public formatDate(date: string): string {
    return moment(date).format('MMMM Do YYYY');
  }

  public formatPhone(): void {
    this.Franchise.Phone = this.phonePipe.transform(this.Franchise.Phone);
  }

  public formatUserPhone(): void {
    this.User.Phone = this.phonePipe.transform(this.User.Phone);
  }

}
