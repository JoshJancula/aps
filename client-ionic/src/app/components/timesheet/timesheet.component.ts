import { Component, OnInit, ViewChild } from '@angular/core';
import { TimecardService } from '../../services/timecard.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';
import { TimesheetDialogComponent } from '../timesheet-dialog/timesheet-dialog.component';
import * as moment from 'moment';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { Timecard } from 'src/app/models/timecard.model';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  @ViewChild('timesheetCalendar', { read: null, static: null }) timesheetCalendar: any;
  public isClockedIn: boolean = false;
  public todaysActivity: any = null;
  public dayTotal: any = null;
  public dayForTimesheet: string = null;

  constructor(
    public dialog: MatDialog,
    public utilService: UtilService,
    private authService: AuthService,
    private timeCardService: TimecardService) { }

  ngOnInit(): void {
    this.getTodayHours();
  }

  private getTodayHours(): void {
    this.timeCardService.getTodaysTimecards(this.authService.currentUser.id).then(response => {
      if (response) {
        if ((<any>response).length <= 0) {
          this.isClockedIn = false;
        } else {
          (<any>response).forEach(card => {
            if (card.TimeOut === '' || card.TimeOut === null || card.TimeIn === undefined) { this.isClockedIn = true; }
          });
          this.todaysActivity = response;
          this.dayTotal = this.utilService.getTotalTime(response);
        }
      }
    }, error => {
      console.log('error getting timecards: ', error);
    });
  }


  public formatMinutes(a: any): string {
    return moment(a).format('hh:mm');
  }

  public clockIn(): void {
    const data = {
      EmployeeName: this.authService.currentUser.Name,
      EmployeeId: this.authService.currentUser.id,
      FranchiseId: this.authService.currentUser.FranchiseId,
      Date: moment(new Date().toISOString()).format('MM/DD/YYYY'),
      TimeIn: moment(new Date().toISOString())
    };
    this.timeCardService.createTimecard(new Timecard(data)).then(res => {
      this.isClockedIn = true;
      this.getTodayHours();
    }, error => {
      this.utilService.alertError(`error saving timecard: ${error}`);
    });
  }

  public clockOut(): void {
    this.timeCardService.getTodaysTimecards(this.authService.currentUser.id).then((res: Timecard[]) => {
      res.forEach((card: Timecard) => {
        if (card.TimeOut === '' || card.TimeOut === null || card.TimeIn === undefined) {
          const data = {
            TimeIn: card.TimeIn,
            TimeOut: moment(new Date().toISOString()),
            id: card.id
          };
          this.timeCardService.updateTimecard(card.id, data).then(res2 => {
            this.isClockedIn = false;
            this.getTodayHours();
          });
        }
      });
    });
  }

  public openCalendar(event: any): void {
    event.preventDefault();
    this.timesheetCalendar.open();
  }

  public getTimesheet(): void {
    const params = {
      EmployeeId: this.authService.currentUser.id,
      Date: moment(this.dayForTimesheet).format('MM/DD/YYYY')
    };
    this.timeCardService.getRangeTimecards(params).then((events) => {
      if (events.type === HttpEventType.Response) {
        if (events.status === 200 && events.type === 4) {
          const newDialog = this.dialog.open(TimesheetDialogComponent, {
            data: { Cards: events.body, Range: this.utilService.getDateRange(this.dayForTimesheet), Name: this.authService.currentUser.Name },
            panelClass: 'invoicePreview'
          });
        }
      }
    }, error => {
      console.log('error: ', error);
    });
  }

  public getMax(): Date {
    return new Date();
  }

  public delete(id: number): void {
    this.timeCardService.deleteTimeCard(id).then(res => {
      console.log('deleted res: ', res);
      this.getTodayHours();
    });
  }

}
