import { Component, ComponentFactoryResolver, OnChanges, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContextService } from 'src/app/services';
import { CaseStudyActivity, CaseStudyParticipantSet, Group } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import { CaseStudyCheckinDialogComponent } from '../../shared/dialogs/case-study-checkin/case-study-checkin.dialog';
import { ParticipantCaseStudyActivityComponent } from '../../participant/case-study-activity/case-study-activity.component';

@Component({
  selector: 'benji-ms-case-study-activity',
  templateUrl: './case-study-activity.component.html',
})
export class MainScreenCaseStudyActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges, OnDestroy {
  
  @ViewChild('caseStudyEntry', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;
  component: any;
  currentGroupName: any;

  groups: Array<Group>;
  act: CaseStudyActivity;
  newLayout = true;
  dialogRef;
  groupsX = [
    {
      name: 'Group 1',
      participants: ['Matthew Parson', 'Sarah Blakey'],
    },
    {
      name: 'Group 2',
      participants: ['Matthew Parson 2', 'Sarah Blakey'],
    },
    {
      name: 'Group 3',
      participants: ['Matthew Parson 2', 'Sarah Blakey', 'Matthew Parson', 'Sarah Blakey'],
    },
    {
      name: 'Group 4',
      participants: [
        'Matthew Parson 2',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
      ],
    },
    {
      name: 'Group 5',
      participants: [
        'Matthew Parson 2',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
      ],
    },
    {
      name: 'Group 6',
      participants: [
        'Matthew Parson 2',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
        'Matthew Parson',
        'Sarah Blakey',
      ],
    },
  ];
  constructor(
    private dialog: MatDialog, 
    private contextService: ContextService,
    private cfr: ComponentFactoryResolver) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.act = this.activityState.casestudyactivity;
    this.groupsX = this.formGroups(this.activityState.casestudyactivity);
    // console.log(this.act)
    // this.contextService.activityTimer = this.activityState.casestudyactivity.activity_countdown_timer;
    const b = this.cfr.resolveComponentFactory(ParticipantCaseStudyActivityComponent);
    this.component = this.entry.createComponent(b);
    this.component.instance.activityState = this.activityState;
    this.component.instance.currentGroup = this.currentGroupName;
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
    // this.loadVariables(this.act);
  }

  // loadVariables(act: TitleActivity) {
  //   this.mainTitle = act.main_title ? act.main_title : '';
  //   this.titleText = act.title_text ? act.title_text : '';
  //   this.layout = act.layout ?  act.layout : '';
  //   this.title_emoji = act.title_emoji ? act.title_emoji : '';
  //   this.title_image = act.title_image ? act.title_image : '';
  // }

  getGroupText(userGroup: Group): string {
    return userGroup.participants.map((u) => this.getParticipantName(u)).join(' + ');
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

  ngOnDestroy() {}

  selectGroup(name) {
    //console.log(name);
    this.currentGroupName = name;
    this.update();
  }

  update() {
    this.component.instance.currentGroup = this.currentGroupName;
    //this.component.instance.update();
  }

}
