import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContextService } from 'src/app/services';
import { CaseStudyActivity, CaseStudyParticipantSet, Group } from 'src/app/services/backend/schema';
import { ParticipantCaseStudyActivityComponent } from '../../participant/case-study-activity/case-study-activity.component';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import { CaseStudyCheckinDialogComponent } from '../../shared/dialogs/case-study-checkin/case-study-checkin.dialog';

@Component({
  selector: 'benji-ms-case-study-activity',
  templateUrl: './case-study-activity.component.html',
})
export class MainScreenCaseStudyActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges, OnDestroy {
  @ViewChild('caseStudyEntry', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;
  componentRef: ComponentRef<ParticipantCaseStudyActivityComponent>;
  currentGroupName: any;

  groups: Array<Group>;
  act: CaseStudyActivity;
  newLayout = true;
  dialogRef;
  groupsX;
  constructor(
    private dialog: MatDialog,
    private contextService: ContextService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super();
  }
  ngOnChanges(): void {
    console.log('hur');
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {}
}
