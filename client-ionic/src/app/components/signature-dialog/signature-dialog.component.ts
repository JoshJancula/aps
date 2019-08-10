import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { MatDialogRef } from '@angular/material';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-signature-dialog',
  templateUrl: './signature-dialog.component.html',
  styleUrls: ['./signature-dialog.component.css']
})
export class SignatureDialogComponent implements OnInit {

  @ViewChild(SignaturePad, null) signaturePad: SignaturePad;
  public signatureURL: string = '';
  public signaturePadOptions: any = {
    minWidth: 5,
    canvasWidth: 800,
    canvasHeight: 500
  };

  constructor(public dialogRef: MatDialogRef<SignatureDialogComponent>) { }

  ngOnInit(): void {}

  public clearPad(): void {
    this.signaturePad.clear();
  }

  public finishSigning(): void {
    this.signatureURL = this.signaturePad.toDataURL();
    this.clearPad();
    this.dialogRef.close();
  }

}
