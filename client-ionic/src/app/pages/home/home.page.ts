import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

    public backgroundImage: string = '';

    constructor() { }

    ngOnInit(): void {
        if (localStorage.getItem('background')) {
            this.backgroundImage = localStorage.getItem('background');
        } else {
            this.backgroundImage = 'assets/logo.jpeg';
        }
    }

    ngOnDestroy(): void {}

}
