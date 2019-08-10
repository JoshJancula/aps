import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-input-email-dialog',
  templateUrl: './input-email-dialog.component.html',
  styleUrls: ['./input-email-dialog.component.css']
})
export class InputEmailDialogComponent implements OnInit {

  public sendTo: string = null;

  constructor(
    public dialogRef: MatDialogRef<InputEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {}

  public setClientEmail(): void {
    if (this.sendTo !== null) {
      this.sendTo = null;
    } else {
      this.sendTo = this.data.clientEmail;
    }
  }

}
