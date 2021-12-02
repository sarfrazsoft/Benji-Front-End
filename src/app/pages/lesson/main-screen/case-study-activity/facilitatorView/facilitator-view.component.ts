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
import {
  CaseStudyActivity,
  CaseStudyParticipantSet,
  Group,
  StartCaseStudyGroupEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
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
  groupingType = 'participants';

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

    this.setGroupingType();

    this.act = this.activityState.casestudyactivity;
    this.initGroupingOnActivity();
  }

  public isEmoji(url: string) {
    if (url) {
      return url.includes('emoji://');
    }
  }

  initGroupingOnActivity() {
    // this.permissionsService.hasPermission('ADMIN').then((val) => {
    //   if (val) {
    // if (this.getEventType() === 'AssignGroupingToActivities') {
    // }
    this.applyGroupingOnActivity(this.activityState);
    //   }
    // });
  }

  applyGroupingOnActivity(state: UpdateMessage) {
    const activityType = state.activity_type.toLowerCase();
    console.log(state[activityType].groups);
    if (state[activityType].groups !== null) {
      // if grouping is already applied return
      return;
    }
    // if grouping is not applied check if grouping tool has
    // information if grouping should be applied on this activity or not
    const sm = state;
    if (sm && sm.running_tools && sm.running_tools.grouping_tool) {
      const gt = sm.running_tools.grouping_tool;
      for (const grouping of gt.groupings) {
        if (grouping.assignedActivities.includes(state[activityType].activity_id)) {
          // const assignedActivities = ['1637726964645'];
          // if (assignedActivities.includes(state[activityType].activity_id)) {
          if (activityType === 'BrainstormActivity') {
            // this.sendMessage.emit(new StartBrainstormGroupEvent(grouping.id));
          } else if (activityType === 'CaseStudyActivity') {
            this.sendMessage.emit(new StartCaseStudyGroupEvent(grouping.id));
          }
          break;
        }
      }
    }
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
    this.applyGroupingOnActivity(this.activityState);
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

  setGroupingType() {
    this.groupsX.forEach((group) => {
      if (group.participants.length > 1) {
        this.groupingType = 'groups';
      }
    });
  }
}
