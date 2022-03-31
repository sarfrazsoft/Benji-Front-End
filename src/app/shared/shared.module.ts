import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatCommonModule, MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormlyModule } from '@ngx-formly/core';
import { Components, EntryComponents } from './index';
import { EntryComponents as RegistrationEntryComponents } from 'src/app/pages';

import { NgxEditorModule } from 'ngx-editor';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxMasonryModule } from 'ngx-masonry';

import nodeViews from './ngx-editor/nodeviews';
import plugins from './ngx-editor/plugins';
import schema from './ngx-editor/schema';

const SHARED_MODULES = [
  PickerModule,
  EmojiModule,
  DragDropModule,
  FlexLayoutModule,
  FormsModule,
  ReactiveFormsModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatCommonModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  NgSelectModule,
  MatButtonToggleModule,
  FormlyModule,
  NgxPermissionsModule,
  NgxMasonryModule,
];
import {
  UppyAngularDashboardModalModule,
  UppyAngularDashboardModule,
  UppyAngularDragDropModule,
  UppyAngularProgressBarModule,
  UppyAngularStatusBarModule,
} from '@uppy/angular';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  imports: [
    NgxEditorModule,
    CommonModule,
    RouterModule,
    NgxExtendedPdfViewerModule,
    PdfJsViewerModule,
    ...SHARED_MODULES,
    NgxPermissionsModule.forRoot(),
    PdfViewerModule,
    UppyAngularDashboardModule,
    UppyAngularStatusBarModule,
    UppyAngularDragDropModule,
    UppyAngularProgressBarModule,
    UppyAngularDashboardModalModule,
  ],
  declarations: [...Components, ...RegistrationEntryComponents],
  entryComponents: [...EntryComponents],
  exports: [...Components, ...SHARED_MODULES],
})
export class SharedModule {}
