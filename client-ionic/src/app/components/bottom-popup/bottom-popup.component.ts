import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-popup',
  templateUrl: './bottom-popup.component.html',
  styleUrls: ['./bottom-popup.component.css']
})
export class BottomPopupComponent implements OnInit {

  constructor(
    private router: Router,
    public authService: AuthService,
    private bottomSheetRef: MatBottomSheetRef<BottomPopupComponent>) { }

  ngOnInit(): void {}

  public routeUser(screen: string): void {
    this.bottomSheetRef.dismiss(screen);
    event.preventDefault();
  }

  public isActiveScreen(screen: string): boolean {
    let valid = false;
    if (this.router.url.indexOf(screen) > -1) { valid = true; }
    return valid;
  }

}
