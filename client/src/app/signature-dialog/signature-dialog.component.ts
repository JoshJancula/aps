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

	signatureURL = '';
	signaturePadOptions: Object = {
		'minWidth': 5,
		'canvasWidth': 800,
		'canvasHeight': 500
	  };

	  @ViewChild(SignaturePad) signaturePad: SignaturePad;

	constructor(public dialogRef: MatDialogRef<SignatureDialogComponent>) { }

	ngOnInit() {
	}

	drawComplete() {
		// console.log(this.signaturePad.toDataURL());
	  }

	  drawStart() {
		console.log('begin drawing');
	  }

	  clearPad() {
		this.signaturePad.clear();
	  }

	  finishSigning() {
		this.signatureURL = this.signaturePad.toDataURL();
		this.clearPad();
		this.dialogRef.close();
	  }

}
