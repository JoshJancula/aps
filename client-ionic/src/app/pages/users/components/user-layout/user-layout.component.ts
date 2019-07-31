import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TimecardService } from 'src/app/services/timecard.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { PhonePipe } from 'src/app/pipes/phone.pipe';
import { MessageService } from 'src/app/services/message.service';
import * as moment from 'moment';
import { HttpEventType } from '@angular/common/http';
import { TimesheetDialogComponent } from 'src/app/components/timesheet-dialog/timesheet-dialog.component';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
})
export class UserLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('timesheetCalendar', null) timesheetCalendar: any;
  dayForTimesheet: any;
  searchUsers = true;
  addUser = false;
  User: any = {
    Username: '',
    FirstName: '',
    LastName: '',
    Role: '',
    Password: '',
    Email: '',
    Phone: '',
    Avatar: '',
    FranchiseId: '',
    Active: true,
    RequireTimesheet: false
  };
  users = [];
  testPassword = '';
  testUsername = '';
  franchises: any;
  editing = false;
  selectedId = '';
  roles = ['Owner', 'Manager', 'Tech', 'Print shop', 'Reception'];

  public subscriptions = [];

  // tslint:disable-next-line:max-line-length
  constructor(
    public dialog: MatDialog,
    private timeCardService: TimecardService,
    private subService: SubscriptionsService,
    public authService: AuthService,
    private userService: UserService,
    private utilService: UtilService,
    private phonePipe: PhonePipe,
    private messagingService: MessageService) { }

  ngOnInit() {
    // if (this.authService.currentUser.Role === 'Super') {
    // 	this.loadFranchises();
    // }
    this.getUsers();
    // console.log('moment.utc(), ', moment().utc());
    // this.submitUser();
  }

  ngOnDestroy(): void {
    console.log('destroy lifecycle called');
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  getUsers() {
    this.subService.processUsers();
    this.subscriptions.push(
    this.subService.users.subscribe(response => {
      this.sortUsers(response);
    }));
  }

  editTimesheet(user) {
    console.log('user: ', user);
    const params = {
      EmployeeId: user.id,
      Date: moment(this.dayForTimesheet).format('MM/DD/YYYY')
    };
    this.timeCardService.getRangeTimecards(params).subscribe((events) => {
      if (events.type === HttpEventType.Response) {
        if (events.status === 200 && events.type === 4) {
          console.log('user is... ', user);
          const newDialog = this.dialog.open(TimesheetDialogComponent, {
            data: { Cards: events.body, Range: this.utilService.getDateRange(this.dayForTimesheet), Name: `${user.FirstName} ${user.LastName}` },
            panelClass: 'invoicePreview'
          });
        }
      }
    }, error => {
      console.log('error: ', error);
    });
  }

  sortUsers(obj) {
    obj.sort((a, b) => (a.LastName > b.LastName) ? 1 : ((b.LastName > a.LastName) ? -1 : 0));
    this.users = obj;
  }

  setView() {
    if (this.searchUsers === true) {
      this.searchUsers = false;
      this.addUser = true;
    } else {
      this.searchUsers = true;
      this.addUser = false;
    }
  }

  notifySocket() {
    const data = { Franchise: this.authService.currentUser.FranchiseId, MessageType: 'update', Action: 'users' };
    this.messagingService.sendUpdate(data);
  }

  loadFranchises() {
    this.subService.processFranchises();
    this.subscriptions.push(
    this.subService.franchises.subscribe(response => {
      this.franchises = response;
    }));
  }

  submitUser() {
    if (this.editing === false) {
      this.userService.createUser(this.User).then(res => {
        console.log('res: ', JSON.stringify(res));
      }).catch(error => {
        console.log('error submitting user... ', error);
        this.submitSuccess();
      });
    } else {
      console.log('updating user info: ', this.User);
      this.userService.updateUser(this.selectedId, this.User).then(res => {
        console.log('res: ', res);
        this.submitSuccess();
      }).catch(error => {
        console.log('error submitting user... ', error);
      });
    }
  }

  submitSuccess() {
    setTimeout(() => this.subService.processUsers(), 500);
    setTimeout(() => this.notifySocket(), 500);
    this.clearForm();
    this.setView();
  }

  testLogin() {
    this.userService.loginUser(this.testUsername, this.testPassword).then(res => {
      console.log('login response: ', res);
    }, error => {
      console.log('error: ', error);
    });
  }

  formatPhone() {
    this.User.Phone = this.phonePipe.transform(this.User.Phone);
  }

  deleteUser(id) {
    this.userService.deleteUser(id).then(res => {
      console.log(`delete: ${res}`);
      if (res === 1) {
        this.clearForm();
        this.notifySocket();
        this.subService.processUsers();
      } else {
        console.log('error deleting');
      }
    }).catch(err => { console.log('error deleting user... ', err); });
  }

  editUser(data) {
    console.log('user to edit: ', data);
    this.editing = true;
    this.searchUsers = false;
    this.addUser = true;
    this.User = data;
    this.selectedId = data.id;
    console.log('selectedId: ', data.id);
  }

  clearForm() {
    this.User = {
      Username: '',
      FirstName: '',
      LastName: '',
      Role: '',
      Password: '',
      Email: '',
      Phone: '',
      FranchiseId: '',
      Active: true,
      RequireTimesheet: true
    };
    this.editing = false;
    this.selectedId = '';
  }

  formatDate(date) {
    return moment(date).format('MMMM Do YYYY');
  }

  getMax() {
    return new Date();
  }

  openCalendar(event) {
    event.preventDefault();
    this.timesheetCalendar.open();
  }

}
