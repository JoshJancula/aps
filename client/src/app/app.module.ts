import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { MatCardModule, MatSlideToggleModule, MatSliderModule, MatRadioModule, MatAutocompleteModule } from '@angular/material';
import { MatSidenavModule, MatButtonModule, MatListModule, MatGridListModule, MatSnackBarModule } from '@angular/material';
import { MatMenuModule, MatToolbarModule, MatPaginatorModule, MatPaginatorIntl, MatCheckboxModule } from '@angular/material';
import { MatNativeDateModule, MatSortModule, MatSelectModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatDialogModule, MatExpansionModule, MatIconModule, MatChipsModule, MatDatepickerModule } from '@angular/material';
import { MatTabsModule, MatTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { LoginComponent } from './login/login.component';
import { MasterComponent } from './master/master.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MasterComponent
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
    MatPaginatorIntl,
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
    RouterModule.forRoot([
      { path: '', component: MasterComponent },
      { path: '/master', component: MasterComponent }
    ])
  ],
  providers: [
    BluetoothSerial
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
