import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  // tslint:disable-next-line:variable-name
  _printIframe: any;

  constructor(public dialog: MatDialog, private router: Router, public snackBar: MatSnackBar, private authService: AuthService, private http: HttpClient) { }

  alertError(message) {
    const newDialog = this.dialog.open(ErrorDialogComponent, {
      data: message,
      panelClass: 'errorAlert'
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
      verticalPosition: 'bottom',
      panelClass: 'bottomSnackbar',
    });
  }

  getDiff(a, b, total) {
    let diff;
    if (b !== null && b !== '' && b !== undefined) {
      const x = moment(a);
      const y = moment(b);
      diff = moment.duration(x.diff(y));
    } else {
      const x = moment(a);
      const y = moment(new Date());
      diff = moment.duration(x.diff(y));
    }
    if (total) {
      return diff._milliseconds.toString().replace('-', '');
    } else {
      const tempTime = moment.duration(diff._milliseconds);
      if (tempTime.hours() < 0) {
        return `${tempTime.hours().toString().replace('-', '')} hr ${tempTime.minutes().toString().replace('-', '')} minutes`;
      } else {
        return `${tempTime.minutes().toString().replace('-', '')} minutes`;
      }
    }
  }

  getTotalTime(activity) {
    let total = 0;
    activity.forEach(card => {
      // tslint:disable-next-line:radix
      total += parseInt(this.getDiff(card.TimeIn, card.TimeOut, true));
    });
    const tempTime = moment.duration(total);
    if (tempTime.hours() > 0) {
      return `${tempTime.hours().toString().replace('-', '')}  hr ${tempTime.minutes().toString().replace('-', '')} minutes`;
    } else {
      return `${tempTime.minutes().toString().replace('-', '')} minutes`;
    }
  }

  sortDates(data) {
    const obj = {
      Monday: { data: [], model: 'Monday' },
      Tuesday: { data: [], model: 'Tuesday' },
      Wednesday: { data: [], model: 'Wednesday' },
      Thursday: { data: [], model: 'Thursday' },
      Friday: { data: [], model: 'Friday' },
      Saturday: { data: [], model: 'Saturday' },
      Sunday: { data: [], model: 'Sunday' }
    };
    data.forEach(a => {
      switch (moment(a.createdAt).format('dddd')) {
        case 'Monday': obj.Monday.data.push(a); break;
        case 'Tuesday': obj.Tuesday.data.push(a); break;
        case 'Wednesday': obj.Wednesday.data.push(a); break;
        case 'Thursday': obj.Thursday.data.push(a); break;
        case 'Friday': obj.Friday.data.push(a); break;
        case 'Saturday': obj.Saturday.data.push(a); break;
        case 'Sunday': obj.Sunday.data.push(a); break;
      }
    });
    return obj;
  }

  getDateRange(date) {
    const start = moment(date).startOf('isoWeek');
    const end = moment(date).endOf('isoWeek');
    const range = { Start: moment(start).format('dddd, MMMM Do YYYY'), End: moment(end).format('dddd, MMMM Do YYYY') };
    return range;
  }

  generatePDF(action, div, message) {
    html2canvas(div).then(canvas => {
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      if (action === 'download') {
        setTimeout(() => { pdf.save(message); }, 1000); // Generated PDF
      } else {
        const blob = pdf.output('blob');
        this.print(blob);
        this.dialog.closeAll();
      }
    });
  }

  print(blob) {
    const fileUrl = URL.createObjectURL(blob);
    let iframe = this._printIframe;
    if (!this._printIframe) {
      iframe = this._printIframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      iframe.style.display = 'none';
      iframe.onload =  () => {
        setTimeout(() => {
          iframe.focus();
          iframe.contentWindow.print();
        }, 100);
      };
    }
    iframe.src = fileUrl;
  }


}
