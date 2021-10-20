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

  constructor(
    private dialog: MatDialog,
    private contextService: ContextService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.act = this.activityState.casestudyactivity;
    this.groupsX = this.formGroups(this.activityState.casestudyactivity);

    const participantCode = this.groupsX[0].participants[0].code;

    this.createComponent(participantCode);

    this.componentRef.instance.sendMessage.subscribe((v) => {
      this.sendMessage.emit(v);
    });
  }

  createComponent(participantCode) {
    const b = this.componentFactoryResolver.resolveComponentFactory(ParticipantCaseStudyActivityComponent);
    this.componentRef = this.entry.createComponent(b);
    this.componentRef.instance.activityState = this.activityState;
    this.componentRef.instance.participantCode = participantCode;
    this.componentRef.instance.showingToFacilitator = true;
  }

  formGroups(act: CaseStudyActivity): any {
    // {
    //   name: 'Group 1',
    //   participants: ['Matthew Parson', 'Sarah Blakey'],
    // }
    const groups = [];
    // iterate over all groups
    for (let i = 0; i < act.groups.length; i++) {
      const elem = act.groups[i];
      const participants = this.getGroupParticipants(act, elem);
      groups.push({ name: elem.title, participants: participants });
    }
    return groups;
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

  // getGroupText(userGroup: Group): string {
  //   return userGroup.participants.map((u) => this.getParticipantName(u)).join(' + ');
  // }

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
    this.update(group.participants[0]);
  }

  update(participant) {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    this.createComponent(participant.code);
  }
}
