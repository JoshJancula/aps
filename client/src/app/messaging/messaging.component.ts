import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
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

	@Output() public close = new EventEmitter();
	@ViewChild('userSelector') userSelector: UserSelectorComponent;
	@ViewChild('messageChat') messageChat: MessageChatComponent;
	showUserSelector = false;
	showChat = false;
	inboxes = [];
	messages: any;
	totalUnread = 0;
	userStore = [];

	constructor(private subService: SubscriptionsService, public authService: AuthService) { }

	ngOnInit() {
	}

	processUserSelect(user) {
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

	getUsers() {
		this.subService.users.subscribe(response => {
			response.forEach(item => {
				if (item.Username !== this.authService.currentUser.Username) {
					this.userStore.push(item);
				}
			});
			this.createInboxes(this.userStore);
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
		this.inboxes = [];
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
				box.Messages = this.sortMessages(box.Messages);
			});
			this.inboxes = inboxes;
			this.setTotalUnread();
			console.log('inboxes: ', this.inboxes);
			console.log('totalUnread: ', this.totalUnread);
		}
	}

	setTotalUnread() {
		this.totalUnread = 0;
		this.messages.forEach(message => {
			// tslint:disable-next-line:radix
			if (message.Read === false && parseInt(message.RecipientId) === this.authService.currentUser.id) {
				this.totalUnread++;
			}
		});
	}

	openChat(box) {
		this.messageChat.loadChat(box);
		this.showChat = true;
	}

	sortMessages(obj) {
		obj.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
		return obj;
	}

}
