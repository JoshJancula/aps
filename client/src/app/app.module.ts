import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { MatCardModule, MatSlideToggleModule, MatSliderModule, MatRadioModule, MatAutocompleteModule } from '@angular/material';
import { MatSidenavModule, MatButtonModule, MatListModule, MatGridListModule, MatSnackBarModule } from '@angular/material';
import { MatMenuModule, MatToolbarModule, MatPaginatorModule, MatCheckboxModule } from '@angular/material';
import { MatNativeDateModule, MatSortModule, MatSelectModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatDialogModule, MatExpansionModule, MatIconModule, MatChipsModule, MatDatepickerModule } from '@angular/material';
import { MatTabsModule, MatTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { LoginComponent } from './login/login.component';
import { MasterComponent } from './master/master.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ControlUserComponent } from './master/control-user/control-user.component';
import { ControlFranchiseComponent } from './master/control-franchise/control-franchise.component';
import { ControlClientComponent } from './master/control-client/control-client.component';

@NgModule({
	entryComponents: [
		LoginComponent,
		MasterComponent
	],
	declarations: [
		AppComponent,
		LoginComponent,
		MasterComponent,
		ControlUserComponent,
		ControlFranchiseComponent,
		ControlClientComponent
	],
	imports: [
		BrowserModule,
		MatCardModule,
		MatSlideToggleModule,
		MatSliderModule,
		MatRadioModule,
		MatAutocompleteModule,
		MatSidenavModule,
		MatButtonModule,
		MatListModule,
		MatGridListModule,
		MatGridListModule,
		MatSnackBarModule,
		MatMenuModule,
		MatToolbarModule,
		MatPaginatorModule,
		MatCheckboxModule,
		MatNativeDateModule,
		MatSortModule,
		MatSelectModule,
		MatFormFieldModule,
		MatInputModule,
		MatDialogModule,
		MatExpansionModule,
		MatIconModule,
		MatChipsModule,
		MatDatepickerModule,
		MatTabsModule,
		MatTableModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		FormsModule,
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatSlideToggleModule,
		MatSliderModule,
		MatButtonModule,
		MatDialogModule,
		MatExpansionModule,
		MatToolbarModule,
		MatSidenavModule,
		MatSelectModule,
		MatMenuModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatCheckboxModule,
		MatRadioModule,
		MatListModule,
		MatGridListModule,
		MatSnackBarModule,
		MatChipsModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatIconModule,
		MatTabsModule,
		MatAutocompleteModule,
		BrowserAnimationsModule,
		HttpClientModule,
		HttpModule,
		RouterModule.forRoot([
			{ path: '', component: MasterComponent },
			{ path: 'master', component: MasterComponent }
		])
	],
	providers: [
		BluetoothSerial
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
