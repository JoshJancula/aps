import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  private backgroundImage = '';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    if (localStorage.getItem('background')) {
      this.backgroundImage = localStorage.getItem('background');
      document.body.style.backgroundImage = `url(${this.backgroundImage})`;
    } else {
      this.backgroundImage = 'assets/logo.jpeg';
      document.body.style.backgroundImage = `url(${this.backgroundImage})`;
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
