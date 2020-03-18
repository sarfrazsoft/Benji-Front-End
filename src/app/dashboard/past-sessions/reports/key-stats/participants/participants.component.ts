import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ContextService } from 'src/app/services';
import { PastSessionsService } from 'src/app/services/past-sessions.service';
import { ErrorMessageDialogComponent } from 'src/app/shared';

@Component({
  selector: 'benji-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit, OnChanges {
  @Input() data: any = { joined_users: [] };
  allowAllSelection;
  selected = [];
  participants = [];
  dialogRef;
  constructor(
    private pastSessionService: PastSessionsService,
    private contextService: ContextService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe(list => {
      this.selected = list;
    });
    this.contextService.user$.subscribe(user => {
      if (user.local_admin_permission) {
        this.allowAllSelection = true;
      }
    });
  }

  isSelected(participant) {
    return this.selected.find(x => x === participant.id);
  }

  ngOnChanges() {
    if (this.data) {
      this.participants = this.data.joined_users;
    }
  }

  participantClicked(event, participant) {
    // if (this.allowAllSelection) {
    this.pastSessionService.addToFilteredInList(participant.id);
    // } else {
    //   const msg =
    //     'You do not have permission to view these reports' +
    //     '\nContact your manager';
    //   this.dialogRef = this.dialog
    //     .open(ErrorMessageDialogComponent, {
    //       data: {
    //         confirmationMessage: msg
    //       },
    //       disableClose: true,
    //       panelClass: 'dashboard-dialog'
    //     })
    //     .afterClosed()
    //     .subscribe(res => {
    //       if (res) {
    //         console.log('br');
    //       }
    //     });
    //   // you don't have admin permissions
    //   // contact your manager or benji
    // }
  }

  showOnly(participant) {
    if (this.allowAllSelection) {
      this.pastSessionService.removeAllBut(participant.id);
    } else {
      const msg =
        'You do not have permission to view these reports' +
        '\nContact your manager.';
      this.dialogRef = this.dialog
        .open(ErrorMessageDialogComponent, {
          data: {
            errorMessage: msg
          },
          disableClose: true,
          panelClass: 'dashboard-dialog'
        })
        .afterClosed()
        .subscribe(res => {
          if (res) {
            console.log('br');
          }
        });
    }
  }
}
