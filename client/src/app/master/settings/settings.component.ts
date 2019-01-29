import { Component, OnInit } from '@angular/core';
import { UploadFileService } from '../../services/upload-file.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	targetFile: any;
	progress: { percentage: number } = { percentage: 0 };
	actions = ['Change password', 'Edit my info', 'Set background'];
	userAction = '';

	constructor(public uploadService: UploadFileService, public authService: AuthService) { }

	ngOnInit() {
	}

	uploadImage($event) {
		if ($event.target.files.length > 0) {
			let reader = new FileReader();
			reader.onload = () => { this.submitImage(); };
			reader.onerror = (error) => { };
			this.targetFile = $event.target.files[0];
		}
	}

	submitImage() {
		this.uploadService.pushFileToStorage(this.targetFile, this.progress, 'avatar');
	}

}
