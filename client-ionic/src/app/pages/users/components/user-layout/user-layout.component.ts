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
import { User } from 'src/app/models/user.model';
import { Franchise } from 'src/app/models/franchise.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
})
export class UserLayoutComponent implements OnInit, OnDestroy {

  @ViewChild('timesheetCalendar', null) timesheetCalendar: any;
  public dayForTimesheet: any = null;
  public searchUsers: boolean = true;
  public addUser: boolean = false;
  public User: User = new User();
  public users: User[] = [];
  public testPassword: string = '';
  public testUsername: string = '';
  public franchises: Franchise[] = [];
  public editing: boolean = false;
  public selectedId: any = null;
  public roles: string[] = ['Owner', 'Manager', 'Tech', 'Print shop', 'Reception'];
  public subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private timeCardService: TimecardService,
    private subService: SubscriptionsService,
    public authService: AuthService,
    private userService: UserService,
    private utilService: UtilService,
    private phonePipe: PhonePipe,
    private messagingService: MessageService) { }

  ngOnInit(): void {
    // if (this.authService.currentUser.Role === 'Super') {
    // 	this.loadFranchises();
    // }
    this.getUsers();
    // console.log('moment.utc(), ', moment().utc());
    // this.submitUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  private getUsers(): void {
    this.subService.processUsers();
    this.subscriptions.push(
    this.subService.users.subscribe((response: User[]) => {
      this.sortUsers(response);
    }));
  }

  public editTimesheet(user: User): void {
    const params = {
      EmployeeId: user.id,
      Date: moment(this.dayForTimesheet).format('MM/DD/YYYY')
    };
    this.timeCardService.getRangeTimecards(params).then((events) => {
      if (events.type === HttpEventType.Response) {
        if (events.status === 200 && events.type === 4) {
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

  private sortUsers(arr: User[]): void {
    arr.sort((a, b) => (a.LastName > b.LastName) ? 1 : ((b.LastName > a.LastName) ? -1 : 0));
    this.users = arr;
  }

  public setView(): void {
    if (this.searchUsers === true) {
      this.searchUsers = false;
      this.addUser = true;
    } else {
      this.searchUsers = true;
      this.addUser = false;
    }
  }

  private notifySocket(): void {
    const data = { Franchise: this.authService.currentUser.FranchiseId, MessageType: 'update', Action: 'users' };
    this.messagingService.sendUpdate(data);
  }

  private loadFranchises(): void {
    this.subService.processFranchises();
    this.subscriptions.push(
    this.subService.franchises.subscribe(response => {
      this.franchises = response;
    }));
  }

  public submitUser(): void {
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

  private submitSuccess(): void {
    setTimeout(() => this.subService.processUsers(), 500);
    setTimeout(() => this.notifySocket(), 500);
    this.clearForm();
    this.setView();
  }

  private testLogin(): void {
    this.userService.loginUser(this.testUsername, this.testPassword).then(res => {
      console.log('login response: ', res);
    }, error => {
      console.log('error: ', error);
    });
  }

  public formatPhone(): void {
    this.User.Phone = this.phonePipe.transform(this.User.Phone);
  }

  public deleteUser(id: number): void {
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

  public editUser(data: User): void {
    this.editing = true;
    this.searchUsers = false;
    this.addUser = true;
    this.User = data;
    this.selectedId = data.id;
  }

  public clearForm(): void {
    this.User = new User();
    this.editing = false;
    this.selectedId = null;
  }

  public formatDate(date: any): string {
    return moment(date).format('MMMM Do YYYY');
  }

  public getMax(): Date {
    return new Date();
  }

  public openCalendar(event: any): void {
    event.preventDefault();
    this.timesheetCalendar.open();
  }

}
