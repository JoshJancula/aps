import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';
import * as moment from 'moment';
import { UtilService } from '../../services/util.service';
import { TimeChangeDialogComponent } from '../time-change-dialog/time-change-dialog.component';
import { TimecardService } from '../../services/timecard.service';
import { Timecard } from 'src/app/models/timecard.model';

@Component({
  selector: 'app-timesheet-dialog',
  templateUrl: './timesheet-dialog.component.html',
  styleUrls: ['./timesheet-dialog.component.css']
})
export class TimesheetDialogComponent implements OnInit {

  public dates: any[] = [];
  public weekTotal: any = null;
  public employeeName: string = '';
  public tempDates: any = null;

  constructor(
    private timeCardService: TimecardService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public authService: AuthService,
    private emailService: EmailService,
    public dialogRef: MatDialogRef<TimesheetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    const temp = this.utilService.sortDates(this.data.Cards);
    const tempDates = [];
    Object.keys(temp).forEach(key => { temp[key].data.forEach(k => { tempDates.push(k); }); this.dates.push(temp[key]); });
    this.weekTotal = this.utilService.getTotalTime(tempDates);
    this.tempDates = tempDates;
    this.employeeName = this.data.Name;
  }

  public formatMinutes(a: any): string {
    return moment(a).format('hh:mm');
  }

  public editTimecard(card: Timecard): void {
    const newDialog = this.dialog.open(TimeChangeDialogComponent, {
      data: { timeIn: card.TimeIn, timeOut: card.TimeOut },
      disableClose: true
    });
    newDialog.beforeClose().subscribe(result => {
      const toSave = (<any>newDialog).componentInstance.saveData;
      const diffIn = (<any>newDialog).componentInstance.diffIn;
      const diffOut = (<any>newDialog).componentInstance.diffOut;
      const addIn = (<any>newDialog).componentInstance.addIn;
      const addOut = (<any>newDialog).componentInstance.addOut;
      if (toSave === true) {
        const data = {
          TimeIn: undefined,
          TimeOut: undefined,
          id: card.id
        };
        if (addIn === true) { data.TimeIn = moment(card.TimeIn).add(diffIn, 'milliseconds'); }
        if (addOut === true) { data.TimeOut = moment(card.TimeOut).add(diffOut, 'milliseconds'); }
        if (addIn === false) { data.TimeIn = moment(card.TimeIn).subtract(diffIn, 'milliseconds'); }
        if (addOut === false) { data.TimeOut = moment(card.TimeOut).subtract(diffOut, 'milliseconds'); }
        this.timeCardService.updateTimecard(card.id, data).then(res2 => {
          card.TimeIn = data.TimeIn;
          card.TimeOut = data.TimeOut;
          this.weekTotal = this.utilService.getTotalTime(this.tempDates);
          // need to put a notify socket here
        }, error => { console.log('error updating timecard'); });
      }
    });
  }

  public clockUserOut(card: Timecard): void {
    const data = {
      TimeIn: card.TimeIn,
      TimeOut: moment(new Date().toISOString()),
      id: card.id
    };
    this.timeCardService.updateTimecard(card.id, data).then(res2 => {
      card.TimeOut = (<any>data).TimeOut;
      this.weekTotal = this.utilService.getTotalTime(this.tempDates);
    }, error => {
      console.log('error clocking user out: ', error);
    });
  }

  public getPDF(action: string): void {
    const div = document.querySelector('#mainContent');
    const message = `${this.employeeName}, ${this.data.Range.Start} ${this.data.Range.End} `;
    this.utilService.generatePDF(action, div, message);
  }


}
