import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-message-chat',
  templateUrl: './message-chat.component.html',
  styleUrls: ['./message-chat.component.css']
})
export class MessageChatComponent implements OnInit {

  @Output() public close = new EventEmitter();
  @Output() public emitRead = new EventEmitter();
  public otherUser: string = '';
  public newMessage: string = '';
  public otherUserId: any = null;
  public messages: Message[] = [];
  public currentUserId: any = null;
  public drawerOpen: boolean = false;
  constructor(public authService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {}

  public submitMessage(): void {
    const message = {
      Author: this.authService.currentUser.Name,
      AuthorId: this.authService.currentUser.id,
      Recipient: this.otherUser,
      RecipientId: this.otherUserId,
      RecipientDelete: false,
      AuthorDelete: false,
      Content: this.newMessage,
      MessageType: 'private',
      Read: false
    };
    this.messageService.sendMessage(new Message(message));
    this.newMessage = '';
  }

  public newChat(data: any): any {
    this.drawerOpen = true;
    this.messages = [];
    this.otherUser = `${data.FirstName} ${data.LastName}`;
    this.otherUserId = data.id;
    this.currentUserId = this.authService.currentUser.id.toString();
    setTimeout(() => document.getElementById('scrollHere').scrollIntoView(), 30);
  }

  public loadChat(box: any): void {
    this.drawerOpen = true;
    this.messages = [];
    this.messages = box.Messages;
    this.otherUser = box.User;
    this.otherUserId = box.otherUserId;
    this.currentUserId = this.authService.currentUser.id.toString();
    setTimeout(() => document.getElementById('scrollHere').scrollIntoView(), 30);
    this.updateRead();
  }

  public updateRead(): void {
    this.messages.forEach(message => {
      if (message.Read === false && message.RecipientId === this.authService.currentUser.id) {
        const unread = { Read: true, id: message.id };
        message.Read = true;
        this.messageService.updateMessageStatus(unread);
      }
    });
    this.emitRead.emit();
  }

}
