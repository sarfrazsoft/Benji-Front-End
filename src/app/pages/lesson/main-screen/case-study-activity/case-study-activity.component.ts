import { Component, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContextService } from 'src/app/services';
import { CaseStudyActivity, CaseStudyParticipantSet, Group } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import { CaseStudyCheckinDialogComponent } from '../../shared/dialogs/case-study-checkin/case-study-checkin.dialog';

@Component({
  selector: 'benji-ms-case-study-activity',
  templateUrl: './case-study-activity.component.html',
})
export class MainScreenCaseStudyActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {
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
  constructor(private dialog: MatDialog, private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.act = this.activityState.casestudyactivity;
    this.groupsX = this.formGroups(this.activityState.casestudyactivity);
    // this.contextService.activityTimer = this.activityState.casestudyactivity.activity_countdown_timer;
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
}
