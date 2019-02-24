import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

const LOCAL_URL = 'http://localhost:8080';
const SERVER_URL  = `https://aps-josh.herokuapp.com`;

@Injectable({
	providedIn: 'root'
})
export class MessageService {

	private socket;

	constructor() { }

	 initSocket(): void {
		if (window.location.host === 'localhost:4200') {
		this.socket = socketIo(LOCAL_URL);
		} else {
			this.socket = socketIo(SERVER_URL);
		}
	}

	 sendConnectionInfo(message: any): void {
		if (this.socket === undefined) {
			this.initSocket();
		}
		this.socket.emit('connectionInfo', message);
	}

	 sendMessage(message: any): void {
		if (this.socket === undefined) {
			this.initSocket();
		}
		this.socket.emit('message', message);
	}

	 updateMessageStatus(message: any) {
		if (this.socket === undefined) {
			this.initSocket();
		}
		this.socket.emit('read', message);
	}

	 sendUpdate(message: any) {
		if (this.socket === undefined) {
			this.initSocket();
		}
		this.socket.emit('update', message);
	}

	 onUpdate(): Observable<any> {
		return new Observable<any>(observer => {
			this.socket.on('update', (data: any) => { observer.next(data); });
		});
	}

	 onMessage(): Observable<any> {
		return new Observable<any>(observer => {
			this.socket.on('message', (data: any) => { observer.next(data); });
		});
	}

	onConnectionMessage(): Observable<any> {
		return new Observable<any>(observer => {
			this.socket.on('allMessages', (data: any) => { observer.next(data); });
		});
	}

	 onEvent(event: Event): Observable<any> {
		return new Observable<Event>(observer => {
			this.socket.on(event, () => observer.next());
		});
	}

}
