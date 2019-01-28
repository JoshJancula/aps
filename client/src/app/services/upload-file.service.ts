import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { FirebaseApp } from '@angular/fire';
import { UserService } from './user.service';

import 'firebase/storage';

@Injectable({
	providedIn: 'root'
})
export class UploadFileService {

	private basePath = '/uploads';

	constructor(public app: FirebaseApp, private userService: UserService) { }

	pushFileToStorage(name, file, progress: { percentage: number }) {
		console.log('name: ', name, 'file: ', file);
		const storageRef = firebase.storage().ref();
		const uploadTask = storageRef.child(`${this.basePath}/${name}`).put(file);

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
					console.log('File available at', downloadURL); // this will be avatar
					setTimeout(() => this.userService.updateProfileImage(downloadURL), 500);
				});
			}
		);
	}


	delete(downloadUrl) { // delete old avatar
		return firebase.storage().refFromURL(downloadUrl).delete();
	  }

}
