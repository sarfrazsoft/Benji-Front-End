import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContextService } from 'src/app/services';
import { CaseStudyActivity, CaseStudyParticipantSet, Group } from 'src/app/services/backend/schema';
import { ParticipantCaseStudyActivityComponent } from '../../../participant/case-study-activity/case-study-activity.component';
import { BaseActivityComponent } from '../../../shared/base-activity.component';
import { CaseStudyCheckinDialogComponent } from '../../../shared/dialogs/case-study-checkin/case-study-checkin.dialog';

@Component({
  selector: 'benji-case-study-facilitator-view',
  templateUrl: './facilitator-view.component.html',
})
export class CaseStudyFacilitatorViewComponent implements OnInit, OnChanges {
  @Input() activityState;
  @Output() sendMessage = new EventEmitter<any>();
  @ViewChild('caseStudyEntry', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;
  componentRef: ComponentRef<ParticipantCaseStudyActivityComponent>;
  currentGroupName: any;

  groups: Array<Group>;
  act: CaseStudyActivity;
  newLayout = true;
  dialogRef;
  groupsX;
  groupingType ="participants";

  constructor(
    private dialog: MatDialog,
    private contextService: ContextService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.act = this.activityState.casestudyactivity;
    this.groupsX = this.act.groups;
    const group = this.groupsX[0];

    this.createComponent(group);

    this.componentRef.instance.sendMessage.subscribe((v) => {
      this.sendMessage.emit(v);
    });

    this.setGroupingType ()
  }

  createComponent(group: Group) {
    const b = this.componentFactoryResolver.resolveComponentFactory(ParticipantCaseStudyActivityComponent);
    this.componentRef = this.entry.createComponent(b);
    this.componentRef.instance.activityState = this.activityState;
    this.componentRef.instance.facilitatorSelectedGroup = group;
    this.componentRef.instance.showingToFacilitator = true;
  }

  getGroupParticipants(act: CaseStudyActivity, group: Group) {
    const participants = [];
    const participantSet = this.activityState.lesson_run.participant_set;
    for (let i = 0; i < group.participants.length; i++) {
      const participantCode = group.participants[i];
      for (let j = 0; j < participantSet.length; j++) {
        const p = participantSet[j];
        if (p.participant_code === participantCode) {
          participants.push({ name: p.display_name, code: participantCode });
        }
      }
    }
    return participants;
  }

  ngOnChanges() {
    this.act = this.activityState.casestudyactivity;
    this.groups = this.act.groups;
  }

  getMyNoteTaker(userId: number): CaseStudyParticipantSet {
    const myGroupFellows = this.getPeopleFromMyGroup(userId);
    for (let i = 0; i < this.act.casestudyparticipant_set.length; i++) {
      const casestudyuser = this.act.casestudyparticipant_set[i];
      if (
        myGroupFellows.includes(casestudyuser.participant.participant_code) &&
        casestudyuser.role === 'Note Taker'
      ) {
        return casestudyuser;
      }
    }
  }

  getPeopleFromMyGroup(userId): Array<number> {
    for (let i = 0; i < this.act.groups.length; i++) {
      const group = this.act.groups[i];
      for (let j = 0; j < group.participants.length; j++) {
        const participantCode = group.participants[j];
        if (participantCode === userId) {
          return group.participants;
        }
      }
    }
  }

  openCheckInModal() {
    this.dialogRef = this.dialog
      .open(CaseStudyCheckinDialogComponent, {
        data: {
          // userId: this.user.id,
        },
        disableClose: true,
        panelClass: ['dashboard-dialog', 'add-learner-dialog'],
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          console.log(res);
        }
      });
  }

  addLearners() {}

  selectGroup(group: Group) {
    this.update(group);
  }

  update(group) {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    this.createComponent(group);
  }

  setGroupingType () {
    this.groupsX.forEach(group => {
      if (group.participants.length > 1) {
        this.groupingType = "groups";
      }
    });
  }

  getInitials(nameString: string) {
    const fullName = nameString.split(' ');
    let inits = '';
    fullName.forEach((name) => {
      inits = inits + name.charAt(0);
    });
    return inits.toUpperCase();
  }
  
  getRemainder (num) {
    return num % 10;
  }
}
