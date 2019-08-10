import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { FirebaseApp } from '@angular/fire';
import { UserService } from './user.service';
import 'firebase/storage';
import { AuthService } from './auth.service';
import { InvoiceService } from './invoice.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  public uploadTask: any = null;
  public storageRef: any = null;
  private basePath: string = '/uploads';

  constructor(
    private messagingService: MessageService,
    private invoiceService: InvoiceService,
    public app: FirebaseApp,
    private userService: UserService,
    private authService: AuthService) { }

  public pushFileToStorage(file: any, progress: { percentage: number }, action: any) {
    let storageRef;
    let uploadTask;

    if (action === 'avatar') {
      storageRef = firebase.storage().ref('/uploads/' + file.name);
      uploadTask = storageRef.put(file);
    } else {
      const name = `invoiceSignature${action.id}`;
      storageRef = firebase.storage().ref('/uploads/' + name);
      uploadTask = storageRef.put(file);
    }

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
          if (action === 'avatar') {
            this.userService.updateProfileImage(downloadURL).then(res => {
              if (this.authService.currentUser.Avatar !== '' && this.authService.currentUser.Avatar !== null) {
                this.deleteImage(this.authService.currentUser.Avatar);
                this.authService.currentUser.Avatar = downloadURL;
                localStorage.removeItem('currentUser');
                localStorage.setItem('currentUser', JSON.stringify(this.authService.currentUser));
              } else {
                this.authService.currentUser.Avatar = downloadURL;
                localStorage.removeItem('currentUser');
                localStorage.setItem('currentUser', JSON.stringify(this.authService.currentUser));
              }
            }).catch(err => { console.log('err uploading image... ', err); });
          }
          if (action.value === 'signature') {
            this.invoiceService.addInvoiceSignature({ id: action.id, signature: downloadURL }).then(res2 => {
              const data = { MessageType: 'update', Action: 'invoices' };
              this.messagingService.sendUpdate(data);
            });
          }
        });
      }
    );
  }


  deleteImage(url) { // delete old avatar
    console.log('url to delete: ', url);
    return firebase.storage().refFromURL(url).delete();
  }

}
