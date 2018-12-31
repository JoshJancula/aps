import { Component, OnInit } from '@angular/core';
import { FranchiseService } from '../../services/franchise.service';
import { NgModel } from '../../../../node_modules/@angular/forms';
import { HttpEventType } from '@angular/common/http';


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
	showMore = false;

	constructor(private franchiseService: FranchiseService) { }

	ngOnInit() {
		 this.getFranchises();
	}

	getFranchises() {
		this.franchiseService.getFranchises().subscribe((events) => {
			if (events.type === HttpEventType.Response) {
			this.franchises = events.body;
			}
		});
	}

	submitFranchise() {
		this.franchiseService.createFranchise(this.Franchise).subscribe(res => {
			console.log('response: ', res);
		}, error => {
			console.log('error: ', error);
		});
	}

	getFranchiseInfo(id) {
		this.franchiseService.getFranchise(id).subscribe((events) => {
			if (events.type === HttpEventType.Response) {
			const data = events.body;
			this.Franchise.Name = (<any>data).Name;
			this.Franchise.Active = (<any>data).Active;
			this.showMore = true;
			}
		});
	}

	hideMore() {
		this.showMore = false;
	}

	deleteFranchise(id) {
		this.franchiseService.deleteFranchise(id).subscribe(res => {
			console.log(`delete: ${res}`);
			if (res === 1) {
				this.getFranchises();
			} else {
				console.log('error deleting');
			}
		});
	}

}
