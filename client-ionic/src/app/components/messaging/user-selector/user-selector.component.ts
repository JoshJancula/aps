import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SubscriptionsService } from '../../../services/subscriptions.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-selector',
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.css']
})
export class UserSelectorComponent implements OnInit {

  @Output() public close = new EventEmitter();
  @Output() userSelected = new EventEmitter();
  public users: User[] = [];
  public subscriptions: Subscription[] = [];

  constructor(private subService: SubscriptionsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers() {
    this.subService.processUsers();
    this.subService.users.subscribe((response: User[]) => {
      const temp = [];
      response.forEach(item => {
        if (item.Username !== this.authService.currentUser.Username) {
          temp.push(item);
        }
      });
      this.sortUsers(temp);
    });
  }

  public sortUsers(arr: User[]): void {
    arr.sort((a, b) => (a.LastName > b.LastName) ? 1 : ((b.LastName > a.LastName) ? -1 : 0));
    this.users = arr;
  }

}
