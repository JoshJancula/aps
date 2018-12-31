import { Component, OnInit } from '@angular/core';
import { FranchiseService } from '../../services/franchise.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';


@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-control-franchise',
	templateUrl: './control-franchise.component.html',
	styleUrls: ['./control-franchise.component.css']
})
export class ControlFranchiseComponent implements OnInit {

	Franchise: any = {
		Name: '',
		Active: true
	};
	franchises: any;
	editing = false;
	selectedId = '';

	constructor(private franchiseService: FranchiseService, private utilService: UtilService) {
		this.loadFranchises();
	 }

	ngOnInit() {
	}

	loadFranchises() {
		this.utilService.processFranchises();
		this.utilService.franchises.subscribe(response => {
			this.franchises = response;
		});
	}

	submitFranchise() {
		if (this.editing === false) {
			this.franchiseService.createFranchise(this.Franchise).subscribe(res => {
				console.log('response: ', res);
			}, error => {
				console.log('error: ', error);
			});
		} else {
			this.franchiseService.updateFranchise(this.selectedId, this.Franchise).subscribe(res => {
				console.log(res);
			});
		}
		this.utilService.processFranchises();
		this.clearForm();
	}

	editFranchise(id) {
		this.editing = true;
		this.franchiseService.getFranchise(id).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
				const data = JSON.parse(JSON.stringify(events.body));
				this.Franchise = data;
				this.selectedId = data.id;
			}
		});
	}

	clearForm() {
		this.Franchise = {
			Name: '',
			Active: true
		};
		this.editing = false;
		this.selectedId = '';
	}

	deleteFranchise(id) {
		this.franchiseService.deleteFranchise(id).subscribe(res => {
			console.log(`delete: ${res}`);
			if (res === 1) {
				this.utilService.processFranchises();
			} else {
				console.log('error deleting');
			}
		});
	}

}
