import { Component, OnInit } from '@angular/core';
import { UploadFileService } from '../../services/upload-file.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	targetFile: any;
	private progress: { percentage: number } = { percentage: 0 };
	constructor(public uploadService: UploadFileService) { }

	ngOnInit() {
	}

	uploadImage($event) {
		if ($event.target.files.length > 0) {
			let reader = new FileReader();
				reader.onload = () => {  };
				reader.onerror = (error) => {  };
				this.targetFile = $event.target.files[0];
		}
	}

	submitImage() {
		this.uploadService.pushFileToStorage( 'Test image', this.targetFile, this.progress);
	}

}
