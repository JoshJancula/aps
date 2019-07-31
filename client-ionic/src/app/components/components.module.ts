import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatSlideToggleModule, MatSliderModule, MatRadioModule, MatAutocompleteModule } from '@angular/material';
import { MatSidenavModule, MatButtonModule, MatListModule, MatGridListModule, MatSnackBarModule } from '@angular/material';
import { MatMenuModule, MatToolbarModule, MatPaginatorModule, MatCheckboxModule } from '@angular/material';
import { MatNativeDateModule, MatSortModule, MatSelectModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatDialogModule, MatExpansionModule, MatIconModule, MatChipsModule, MatDatepickerModule } from '@angular/material';
import { MatTabsModule, MatTableModule } from '@angular/material';
import { MatBottomSheetModule } from '@angular/material';
import { BottomPopupComponent } from './bottom-popup/bottom-popup.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { TimesheetDialogComponent } from './timesheet-dialog/timesheet-dialog.component';
import { TimeChangeDialogComponent } from './time-change-dialog/time-change-dialog.component';
import { SignatureDialogComponent } from './signature-dialog/signature-dialog.component';
import { MessagingComponent } from './messaging/messaging.component';
import { MessageChatComponent } from './messaging/message-chat/message-chat.component';
import { UserSelectorComponent } from './messaging/user-selector/user-selector.component';
import { InputEmailDialogComponent } from './input-email-dialog/input-email-dialog.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [TimesheetComponent, ToolbarComponent, SideNavComponent, SignatureDialogComponent, InputEmailDialogComponent, UserSelectorComponent, MessageChatComponent, BottomPopupComponent, ErrorDialogComponent, TimesheetDialogComponent, TimeChangeDialogComponent, MessagingComponent],
  entryComponents: [SignatureDialogComponent, InputEmailDialogComponent, BottomPopupComponent, ErrorDialogComponent, TimesheetDialogComponent, TimeChangeDialogComponent, MessagingComponent],
  imports: [
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
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
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
    NgxMaterialTimepickerModule
  ],
  exports: [
    SignatureDialogComponent, ToolbarComponent, SideNavComponent,  TimesheetComponent, InputEmailDialogComponent, UserSelectorComponent, MessageChatComponent, BottomPopupComponent, ErrorDialogComponent, TimesheetDialogComponent, TimeChangeDialogComponent, MessagingComponent
  ]
})
export class ComponentsModule {}
