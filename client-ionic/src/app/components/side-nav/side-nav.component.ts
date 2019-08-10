import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {}

  public routeUser(screen: string): void {
    console.log('screnn...', screen);
    this.router.navigate([`${screen}`]);
    event.preventDefault();
  }

  public isActiveScreen(screen: string): boolean {
    let valid = false;
    if (this.router.url.indexOf(screen) > -1) { valid = true; }
    return valid;
  }

}
