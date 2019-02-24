import { Component, OnInit, ViewChild } from '@angular/core';
import { UserSelectorComponent } from './user-selector/user-selector.component';
import { MessageChatComponent } from './message-chat/message-chat.component';
import { SubscriptionsService } from '../services/subscriptions.service';
import { AuthService } from '../services/auth.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-messaging',
	templateUrl: './messaging.component.html',
	styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

	@ViewChild('userSelector') userSelector: UserSelectorComponent;
	@ViewChild('messageChat') messageChat: MessageChatComponent;
	showUserSelector = false;
	showChat = false;
	inboxes = [];
	messages: any;

	constructor(private subService: SubscriptionsService, private authService: AuthService) { }

	ngOnInit() {
	}

	processUserSelect(user) {
		if (this.messages !== undefined && this.messages !== []) {
			this.inboxes.forEach(box => {
				if (box.otherUserId === user.id) {
					this.openChat(box);
					this.showUserSelector = false;
					this.showChat = true;
				}
			});
		} else {
			this.messageChat.newChat(user);
		}
	}

	getUsers() {
		this.subService.users.subscribe(response => {
			let temp = [];
			response.forEach(item => {
				if (item.Username !== this.authService.currentUser.Username) {
					temp.push(item);
				}
			});
			this.createInboxes(temp);
		});
	}

	createInboxes(data) {
		let inboxes = [];
		data.forEach(user => {
			inboxes.push({ User: `${user.FirstName} ${user.LastName}`, otherUserId: user.id, Messages: [] });
		});
		this.loadInboxes(inboxes);
	}

	loadInboxes(inboxes) {
		if (this.messages !== undefined && this.messages !== []) {
			inboxes.forEach(box => {
				this.messages.forEach(message => {
					// tslint:disable-next-line:radix
					if ((parseInt(message.AuthorId) === this.authService.currentUser.id && parseInt(message.RecipientId) === parseInt(box.otherUserId)) || (parseInt(message.RecipientId) === parseInt(this.authService.currentUser.id) && parseInt(message.AuthorId) === parseInt(box.otherUserId))) {
						box.Messages.push(message);
					}
				});
			});
			inboxes.forEach(box => {
				this.sortMessages(box.Messages);
			});
		}
		this.inboxes = inboxes;
		console.log('inboxes: ', this.inboxes);
	}

	openChat(box) {
		this.messageChat.loadChat(box);
		this.showChat = true;
	}

	sortMessages(obj) {
		obj.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
		this.messages = obj;
	}

}
