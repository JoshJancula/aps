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

  public timeIn: any;
  public timeOut: any;
  public ogIn: any;
  public ogOut: any;
  public ogMinIn: any;
  public ogMinOut: any;
  public saveData = false;
  public diffIn: any;
  public diffOut: any;
  public addIn = false;
  public addOut = false;

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<TimeChangeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log('date is: ', new Date());
    this.timeIn = moment(this.data.timeIn).format('HH:mm');
    this.timeOut = moment(this.data.timeOut).format('HH:mm');
    // this.timeIn = moment(this.data.timeIn).format('HH:mm');
    // this.timeOut = moment(this.data.timeOut).format('HH:mm');
    this.ogMinIn = moment(this.data.timeIn).format('HH:mm');
    this.ogMinOut = moment(this.data.timeOut).format('HH:mm');
  }

  findDiff() {
    // console.log
    const tempDate = new Date();
    const tempMIN = moment(tempDate).format('HH:mm');
    const tempIn = tempDate.toString().replace(tempMIN, this.ogMinIn);
    console.log('tempIn: ', tempIn);
    const tempIn2 = tempDate.toString().replace(tempMIN, this.timeIn);
    console.log('tempIn2: ', tempIn2);
    const inDiff = moment(tempIn).diff(tempIn2);
    const tempOut = tempDate.toString().replace(tempMIN, this.ogMinOut);
    console.log('tempOut: ', tempOut);
    const tempOut2 = tempDate.toString().replace(tempMIN, this.timeOut);
    console.log('tempOut2: ', tempOut2);
    const outDiff = moment(tempOut).diff(tempOut2);
    console.log('inDiff: ', inDiff);
    console.log('outDiff: ', outDiff);
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

  save(action) {
    this.findDiff();
    // console.log('timeIn', this.timeIn);
    // console.log('formatted timeIn', moment(this.timeIn).format('MM/DD/YYYY HH:mm'));
    if (action === true) {
      this.saveData = true;
      this.dialogRef.close();
    } else {
      this.saveData = false;
      this.dialogRef.close();
    }
  }



}
