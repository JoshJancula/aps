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
import { PhonePipe } from './phone.pipe';
import { ControlUserComponent } from './master/control-user/control-user.component';
import { ControlFranchiseComponent } from './master/control-franchise/control-franchise.component';
import { ControlClientComponent } from './master/control-client/control-client.component';
import { ControlAppointmentComponent } from './master/control-appointment/control-appointment.component';
import { ControlInvoiceComponent } from './master/control-invoice/control-invoice.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AuthService } from './services/auth.service';
import { MatBottomSheetModule } from '@angular/material';
import { BottomPopupComponent } from './bottom-popup/bottom-popup.component';
import { InvoiceSearchComponent } from './master/control-invoice/invoice-search/invoice-search.component';
import { InvoiceFormComponent } from './master/control-invoice/invoice-form/invoice-form.component';
import { InvoicePreviewComponent } from './master/control-invoice/invoice-preview/invoice-preview.component';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { InputEmailDialogComponent } from './input-email-dialog/input-email-dialog.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { SettingsComponent } from './master/settings/settings.component';
import { environment } from '../environments/environment';
import { SignatureDialogComponent } from './signature-dialog/signature-dialog.component';
import { SignaturePadModule } from 'angular2-signaturepad';

const config = {
	apiKey: 'AIzaSyBTiizpyWeqHfXdFDQsd6IoMdNWYvkceS8',
	authDomain: 'amee-store.firebaseapp.com',
	databaseURL: 'https://amee-store.firebaseio.com',
	projectId: 'amee-store',
	storageBucket: 'amee-store.appspot.com',
	messagingSenderId: '457253723299'
};

@NgModule({
	entryComponents: [
		LoginComponent,
		MasterComponent,
		BottomPopupComponent,
		InvoiceSearchComponent,
		InvoicePreviewComponent,
		ErrorDialogComponent,
		InputEmailDialogComponent,
		SignatureDialogComponent
	],
	declarations: [
		AppComponent,
		LoginComponent,
		MasterComponent,
		ControlUserComponent,
		ControlFranchiseComponent,
		ControlClientComponent,
		ControlAppointmentComponent,
		ControlInvoiceComponent,
		BottomPopupComponent,
		PhonePipe,
		BottomPopupComponent,
		InvoiceSearchComponent,
		InvoiceFormComponent,
		InvoicePreviewComponent,
		ErrorDialogComponent,
		InputEmailDialogComponent,
		SettingsComponent,
		SignatureDialogComponent
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
		MatBottomSheetModule,
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
		SignaturePadModule,
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
		AngularFireModule.initializeApp(config),
		AngularFireDatabaseModule,
		NgxMaterialTimepickerModule.forRoot(),
		RouterModule.forRoot([
			{ path: '', component: LoginComponent },
			{ path: 'master', component: MasterComponent },
		], { useHash: true })
	],
	providers: [
		BluetoothSerial,
		LaunchNavigator,
		BarcodeScanner,
		PhonePipe,
		AuthService,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
