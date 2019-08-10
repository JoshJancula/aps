import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-time-change-dialog',
  templateUrl: './time-change-dialog.component.html',
  styleUrls: ['./time-change-dialog.component.css']
})
export class TimeChangeDialogComponent implements OnInit {

  public timeIn: any = null;
  public timeOut: any = null;
  public ogIn: any = null;
  public ogOut: any = null;
  public ogMinIn: any = null;
  public ogMinOut: any = null;
  public saveData: boolean = false;
  public diffIn: any = null;
  public diffOut: any = null;
  public addIn: boolean = false;
  public addOut: boolean = false;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TimeChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.timeIn = moment(this.data.timeIn).format('HH:mm');
    this.timeOut = moment(this.data.timeOut).format('HH:mm');
    this.ogMinIn = moment(this.data.timeIn).format('HH:mm');
    this.ogMinOut = moment(this.data.timeOut).format('HH:mm');
  }

  private findDiff(): void {
    const tempDate = new Date().toISOString();
    const tempMIN = moment(tempDate).format('HH:mm');
    const tempIn = tempDate.toString().replace(tempMIN, this.ogMinIn);
    const tempIn2 = tempDate.toString().replace(tempMIN, this.timeIn);
    const inDiff = moment(tempIn).diff(tempIn2);
    const tempOut = tempDate.toString().replace(tempMIN, this.ogMinOut);
    const tempOut2 = tempDate.toString().replace(tempMIN, this.timeOut);
    const outDiff = moment(tempOut).diff(tempOut2);
    if (inDiff.toString().indexOf('-') > -1) {
      this.addIn = true;
      this.diffIn = inDiff.toString().replace('-', '');
    } else {
      this.diffIn = inDiff.toString();
      this.addIn = false;
    }
    if (outDiff.toString().indexOf('-') > -1) {
      this.addOut = true;
      this.diffOut = outDiff.toString().replace('-', '');
    } else {
      this.diffOut = outDiff.toString();
      this.addOut = false;
    }
  }

  public save(action: boolean): void {
    this.findDiff();
    if (action === true) {
      this.saveData = true;
      this.dialogRef.close();
    } else {
      this.saveData = false;
      this.dialogRef.close();
    }
  }



}
