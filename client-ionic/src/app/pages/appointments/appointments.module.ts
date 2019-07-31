import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppointmentsPage } from './appointments.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatSlideToggleModule, MatSliderModule, MatRadioModule, MatAutocompleteModule } from '@angular/material';
import { MatSidenavModule, MatButtonModule, MatListModule, MatGridListModule, MatSnackBarModule } from '@angular/material';
import { MatMenuModule, MatToolbarModule, MatPaginatorModule, MatCheckboxModule } from '@angular/material';
import { MatNativeDateModule, MatSortModule, MatSelectModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatDialogModule, MatExpansionModule, MatIconModule, MatChipsModule, MatDatepickerModule } from '@angular/material';
import { MatTabsModule, MatTableModule } from '@angular/material';
import { MatBottomSheetModule } from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ComponentsModule } from '../.././components/components.module';
import { PhonePipe } from '../../pipes/phone.pipe';
import { AppointmentLayoutComponent } from './components/appointment-layout/appointment-layout.component';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

const routes: Routes = [
  {
    path: '',
    component: AppointmentsPage
  }
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
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
    ReactiveFormsModule,
    FormsModule,
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
    NgxMaterialTimepickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AppointmentsPage, AppointmentLayoutComponent],
  providers: [
    PhonePipe,
    LaunchNavigator
  ]
})
export class AppointmentsPageModule {}
