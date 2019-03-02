import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-message-chat',
	templateUrl: './message-chat.component.html',
	styleUrls: ['./message-chat.component.css']
})
export class MessageChatComponent implements OnInit {

	@Output() public close = new EventEmitter();
	@Output() public emitRead = new EventEmitter();
	public otherUser = '';
	public newMessage = '';
	public otherUserId = '';
	public messages = [];
	public currentUserId: any;
	public drawerOpen = false;
	constructor(public authService: AuthService, private messageService: MessageService) { }

	ngOnInit() {
	}

	submitMessage() {
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
		this.messageService.sendMessage(message);
		this.newMessage = '';
	}

	newChat(data) {
		this.drawerOpen = true;
		this.messages = [];
		this.otherUser = `${data.FirstName} ${data.LastName}`;
		this.otherUserId = data.id;
		this.currentUserId = this.authService.currentUser.id.toString();
		setTimeout(() => document.getElementById('scrollHere').scrollIntoView(), 30);
	}

	loadChat(box) {
		this.drawerOpen = true;
		this.messages = [];
		this.messages = box.Messages;
		this.otherUser = box.User;
		this.otherUserId = box.otherUserId;
		this.currentUserId = this.authService.currentUser.id.toString();
		setTimeout(() => document.getElementById('scrollHere').scrollIntoView(), 30);
		this.updateRead();
	}

	updateRead() {
		this.messages.forEach(message => {
			// tslint:disable-next-line:radix
			if (message.Read === false && parseInt(message.RecipientId) === this.authService.currentUser.id) {
				const unread = { Read: true, id: message.id };
				message.Read = true;
				this.messageService.updateMessageStatus(unread);
			}
		});
		this.emitRead.emit();
	}

}
