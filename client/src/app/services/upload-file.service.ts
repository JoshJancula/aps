import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
// import { FileUpload } from './fileupload';
import { AngularFireStorage } from 'firebase/storage';

@Injectable({
	providedIn: 'root'
})
export class UploadFileService {

	private basePath = '/uploads';
	private progress: { percentage: number } = { percentage: 0 };

	constructor(private storage: AngularFireStorage) { }

	pushFileToStorage(name, file, progress: { percentage: number }) {
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
				});
			}
		);
	}


	delete(downloadUrl) { // delete old avatar
		return this.storage.storage.refFromURL(downloadUrl).delete();
	  }

}
