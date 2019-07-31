import { Component, OnInit } from '@angular/core';
import { BottomPopupComponent } from '../bottom-popup/bottom-popup.component';
import { MatBottomSheet } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  screen: 'screen title';

  constructor(private bottomSheetRef: MatBottomSheet, private router: Router) { }

  ngOnInit() { }

  openPopup() {
    const sheet = this.bottomSheetRef.open(BottomPopupComponent);
    sheet.afterDismissed().subscribe((res) => {
      this.router.navigate([`/${res}`]);
    });
  }

}
