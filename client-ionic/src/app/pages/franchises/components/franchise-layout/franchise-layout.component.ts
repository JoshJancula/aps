import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { AuthService } from 'src/app/services/auth.service';
import { PhonePipe } from 'src/app/pipes/phone.pipe';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'src/app/services/message.service';
import { FranchiseService } from 'src/app/services/franchise.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';

@Component({
  selector: 'app-franchise-layout',
  templateUrl: './franchise-layout.component.html',
  styleUrls: ['./franchise-layout.component.scss'],
})
export class FranchiseLayoutComponent implements OnInit, OnDestroy {

  Franchise: any = {
    Name: '',
    Phone: '',
    Email: '',
    Address: '',
    TaxRate: '',
    Active: true
  };
  franchises: any;
  editing = false;
  selectedId = '';
  searchFranchises = true;
  addFranchise = false;

  User: any = {
    Username: '',
    FirstName: '',
    LastName: '',
    Role: 'Owner',
    Password: '',
    Email: '',
    Phone: '',
    FranchiseId: '',
    Active: true,
  };

  location: ''; // this is dummy right now;
  private subscriptions = [];

  constructor(
    private subService: SubscriptionsService,
    public authService: AuthService,
    private phonePipe: PhonePipe,
    private userService: UserService,
    private messagingService: MessageService,
    private franchiseService: FranchiseService,
    private utilService: UtilService) { }

  ngOnInit() {
    this.loadFranchises();
  }

  ngOnDestroy(): void {
    console.log('destroy lifecycle called');
    this.subscriptions.forEach(s => s.unsubscribe);
  }


  setView() {
    if (this.searchFranchises === true) {
      this.searchFranchises = false;
      this.addFranchise = true;
    } else {
      this.searchFranchises = true;
      this.addFranchise = false;
    }
  }

  loadFranchises() {
    this.subService.processFranchises();
    this.subscriptions.push(
      this.subService.franchises.subscribe(response => {
        this.franchises = response;
      }));
  }

  notifySocket() {
    const data = { Franchise: this.authService.currentUser.FranchiseId, MessageType: 'update', Action: 'franchises' };
    this.messagingService.sendUpdate(data);
  }

  submitFranchise() {
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

  postSuccess() {
    setTimeout(() => this.subService.processFranchises(), 500);
    setTimeout(() => this.notifySocket(), 500);
    this.setView();
  }

  editFranchise(data) {
    this.searchFranchises = false;
    this.addFranchise = true;
    this.editing = true;
    this.Franchise = data;
    this.selectedId = data.id;
  }

  submitUser() {
    this.userService.createUser(this.User).then(res => {
      console.log('res: ', JSON.stringify(res));
      setTimeout(() => this.subService.processUsers(), 500);
      setTimeout(() => this.notifySocket(), 500);
      setTimeout(() => this.subService.processFranchises(), 600);
      setTimeout(() => this.notifySocket(), 600);
      this.clearForm();
    }).catch(err => { console.log('error creating user... ', err); });
  }

  clearForm() {
    if ((<any>window).deviceReady === true) {
      (<any>window).Keyboard.hide();
    }
    this.Franchise = {
      Name: '',
      Phone: '',
      Email: '',
      Address: '',
      TaxRate: '',
      Active: true
    };
    this.editing = false;
    this.selectedId = '';
    this.location = '';
    this.clearUserForm();
  }

  clearUserForm() {
    this.User = {
      Username: '',
      FirstName: '',
      LastName: '',
      Role: 'Owner',
      Password: '',
      Email: '',
      Phone: '',
      FranchiseId: '',
      Active: true,
    };
  }

  deleteFranchise(id) {
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

  formatDate(date) {
    return moment(date).format('MMMM Do YYYY');
  }

  formatPhone() {
    this.Franchise.Phone = this.phonePipe.transform(this.Franchise.Phone);
  }

  formatUserPhone() {
    this.User.Phone = this.phonePipe.transform(this.User.Phone);
  }

}
