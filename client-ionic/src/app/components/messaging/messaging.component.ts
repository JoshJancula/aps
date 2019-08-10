import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { UserSelectorComponent } from './user-selector/user-selector.component';
import { MessageChatComponent } from './message-chat/message-chat.component';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { AuthService } from '../../services/auth.service';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

  @Output() public close = new EventEmitter();
  @ViewChild('userSelector', null) userSelector: UserSelectorComponent;
  @ViewChild('messageChat', null) messageChat: MessageChatComponent;
  public showUserSelector: boolean = false;
  public showChat: boolean = false;
  public inboxes: any[] = [];
  public messages: Message[];
  public totalUnread: number = 0;
  public userStore: User[] = [];
  public showMessages: boolean = false;

  constructor(private subService: SubscriptionsService, public authService: AuthService) { }

  ngOnInit(): void {}

  public processUserSelect(user: User): void {
    if (this.messages !== undefined && this.messages !== [] && this.inboxes !== [] && this.messages.length > 0) {
      this.inboxes.forEach(box => {
        if (box.otherUserId === user.id) {
          this.openChat(box);
          this.showUserSelector = false;
          this.showChat = true;
        }
      });
    } else {
      this.messageChat.newChat(user);
      this.showUserSelector = false;
      this.showChat = true;
    }
  }

  public getUsers(): void {
    this.userStore = [];
    this.inboxes = [];
    this.subService.users.subscribe(response => {
      response.forEach(item => {
        if (item.Username !== this.authService.currentUser.Username) {
          this.userStore.push(item);
        }
      });
      this.createInboxes(this.userStore);
    });
  }

  public createInboxes(data: User[]): void {
    const inboxes = [];
    data.forEach(user => {
      if (!inboxes.find(row => row.otherUserId === user.id)) {
      inboxes.push({ User: `${user.FirstName} ${user.LastName}`, otherUserId: user.id, Messages: [] });
      }
    });
    this.loadInboxes(inboxes);
  }

  public loadInboxes(inboxes: any): void {
    this.inboxes = [];
    if (this.messages !== undefined && this.messages !== []) {
      inboxes.forEach((box: any) => {
        this.messages.forEach((message: Message) => {
          // tslint:disable-next-line:radix
          if ((parseInt((<any>message).AuthorId) === this.authService.currentUser.id && parseInt((<any>message).RecipientId) === parseInt(box.otherUserId)) || (parseInt((<any>message).RecipientId) === parseInt(this.authService.currentUser.id) && parseInt((<any>message).AuthorId) === parseInt(box.otherUserId))) {
            box.Messages.push(message);
          }
        });
      });
      inboxes.forEach((box: any) => {
        box.Messages = this.sortMessages(box.Messages);
      });
      this.inboxes = inboxes;
      this.setTotalUnread();
    }
  }

  public setTotalUnread(): void {
    this.totalUnread = 0;
    this.messages.forEach((message: Message) => {
      // tslint:disable-next-line:radix
      if (message.Read === false && parseInt(<any>(message).RecipientId) === this.authService.currentUser.id) {
        this.totalUnread++;
      }
    });
  }

  public openChat(box: any): void {
    this.messageChat.loadChat(box);
    this.showChat = true;
  }

  private sortMessages(arr: Message[]): Message[] {
    arr.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
    return arr;
  }

}
