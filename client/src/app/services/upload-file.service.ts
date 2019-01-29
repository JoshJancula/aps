import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { FirebaseApp } from '@angular/fire';
import { UserService } from './user.service';
import 'firebase/storage';
import { AuthService } from './auth.service';
import { InvoiceService } from './invoice.service';

@Injectable({
	providedIn: 'root'
})
export class UploadFileService {

	private basePath = '/uploads';

	constructor(private invoiceService: InvoiceService, public app: FirebaseApp, private userService: UserService, private authService: AuthService) { }

	pushFileToStorage(file, progress: { percentage: number }, action) {
		const storageRef = firebase.storage().ref('/uploads/' + file.name);
		const uploadTask = storageRef.put(file);

		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
			(snapshot) => {
				// in progress
				const snap = snapshot as firebase.storage.UploadTaskSnapshot;
				progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
			},
			(error) => {
				// fail
				console.log(error);
			},
			() => {
				// success
				uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
					this.userService.updateProfileImage(downloadURL).subscribe(res => {
						if (action === 'avatar') {
							if (this.authService.currentUser.Avatar !== '') {
								this.deleteImage(this.authService.currentUser.Avatar);
								this.authService.currentUser.Avatar = downloadURL;
								localStorage.removeItem('currentUser');
								localStorage.setItem('currentUser', JSON.stringify(this.authService.currentUser));
							} else {
								// add signature
							}
						}
					});
				});
			}
		);
	}


	deleteImage(url) { // delete old avatar
		console.log('url to delete: ', url);
		return firebase.storage().refFromURL(url).delete();
	}

}
