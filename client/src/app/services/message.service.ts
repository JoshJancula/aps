import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

const LOCAL_URL = 'http://localhost:8080';
const SERVER_URL  = `https://aps-josh.herokuapp.com/8080`;

@Injectable({
	providedIn: 'root'
})
export class MessageService {

	private socket;

	constructor() { }

	public initSocket(): void {
		if (window.location.host === 'localhost:4200') {
		this.socket = socketIo(LOCAL_URL);
		} else {
			this.socket = socketIo(SERVER_URL);
		}
	}

	public sendConnectionInfo(message: any): void {
		if (this.socket === undefined) {
			this.initSocket();
		}
		this.socket.emit('connectionInfo', message);
	}

	public sendMessage(message: any): void {
		if (this.socket === undefined) {
			this.initSocket();
		}
		this.socket.emit('message', message);
	}

	public updateMessageStatus(message: any) {
		if (this.socket === undefined) {
			this.initSocket();
		}
		this.socket.emit('read', message);
	}

	public sendUpdate(message: any) {
		if (this.socket === undefined) {
			this.initSocket();
		}
		this.socket.emit('update', message);
	}

	public onUpdate(): Observable<any> {
		return new Observable<any>(observer => {
			this.socket.on('update', (data: any) => { observer.next(data); });
		});
	}

	public onMessage(): Observable<any> {
		return new Observable<any>(observer => {
			this.socket.on('message', (data: any) => { observer.next(data); });
		});
	}

	public onEvent(event: Event): Observable<any> {
		return new Observable<Event>(observer => {
			this.socket.on(event, () => observer.next());
		});
	}

}
