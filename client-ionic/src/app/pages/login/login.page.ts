import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public username: string = '';
  public password: string = '';

  constructor(
    private platform: Platform,
    private utilSerivce: UtilService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    document.body.style.backgroundImage = 'url("assets/logo5.png")';
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
  }

  private navigate(role: string): void {
    switch (role) {
      case 'Super': this.router.navigate([`/home`], {}); break;
      case 'Tech': this.router.navigate([`/home`], {}); break;
      case 'Owner': this.router.navigate([`/home`], {}); break;
      case 'Manager': this.router.navigate([`/home`], {}); break;
      case 'Reception': this.router.navigate([`/home`], {}); break;
      case 'Shop hand': this.router.navigate([`/home`], {}); break;
    }
  }

  checkCordova() {
    this.login();
  }

  public login(): void {
    this.authService.loginUser(this.username, this.password).then(res => {
      console.log('login response: ', res);
      // tslint:disable-next-line:no-angle-bracket-type-assertion
      localStorage.setItem('jwtToken', (<any>res).token);
      localStorage.removeItem('currentUser');
      this.authService.currentUser.Name = (<any>res).user.FirstName + ' ' + (<any>res).user.LastName;
      this.authService.currentUser.Role = (<any>res).user.Role;
      this.authService.currentUser.Email = (<any>res).user.Email;
      this.authService.currentUser.Username = (<any>res).user.Username;
      this.authService.currentUser.Phone = (<any>res).user.Phone;
      this.authService.currentUser.id = (<any>res).user.id;
      this.authService.currentUser.Avatar = (<any>res).user.Avatar;
      this.authService.currentUser.FranchiseId = (<any>res).user.FranchiseId;
      this.authService.currentUser.Initials = `${(<any>res).user.FirstName.substr(0, 1)}${(<any>res).user.LastName.substr(0, 1)}`;
      localStorage.setItem('currentUser', JSON.stringify(this.authService.currentUser));
      this.router.navigate(['/home']);
    }).catch(error => {
      console.log('error: ', error);
      if (error.status === 403) {
        this.utilSerivce.alertError(`Your account has been deactivated. Please consult your supervisor if you feel you received this message in error.`);
      } else if (error.status === 401) {
        this.utilSerivce.alertError(`Invalid username or password.`);
      }
    });
  }

  submitPasswordChange() {
    this.userService.updatePassword('test').then(response => {
      console.log('response updating password', response);
    });
  }

}
