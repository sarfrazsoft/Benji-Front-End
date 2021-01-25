import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivityTypes } from 'src/app/globals';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs';

@Component({
  selector: 'benji-activity-settings',
  templateUrl: './activity-settings.component.html',
  styleUrls: [],
})
export class ActivitySettingsComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  at: typeof ActivityTypes = ActivityTypes;
  settings;
  dialogRef;
  constructor(private dialog: MatDialog) {}
  selectedCardSize;
  cardSizes = [
    { id: 1, name: 'small' },
    { id: 2, name: 'medium' },
    { id: 3, name: 'large' },
  ];
  @Output() controlClicked = new EventEmitter<any>();

  ngOnInit(): void {
    this.selectedCardSize = this.cardSizes[0].id;
  }

  ngOnChanges() {
    const as = this.activityState;
    if (as) {
      if (as.activity_type === this.at.brainStorm) {
        this.settings = SETTINGS['brainstorm'];
      }
    }
  }

  controlClick(eventType) {
    const msg = 'Are you sure you want to reset this activity?';
    this.dialogRef = this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: msg,
          actionButton: 'Reset',
        },
        disableClose: true,
        panelClass: 'dashboard-dialog',
      })
      .afterClosed()
      .subscribe((res) => {});
    this.controlClicked.emit(eventType);
  }

  toggleChange($event, controlName: string) {
    console.log($event.currentTarget.checked, controlName);
  }

  selectChange($event, controlName: string) {
    console.log($event, controlName);
  }
}

export const SETTINGS = {
  brainstorm: [
    { type: 'toggle', name: 'showUserName', label: 'Show user name' },
    { type: 'toggle', name: 'cardSize', label: 'Case Size' },
    {
      type: 'select',
      label: 'Card Size',
      name: 'cardSize',
      options: [
        { id: 1, name: 'small' },
        { id: 2, name: 'medium' },
        { id: 3, name: 'large' },
      ],
    },
    { type: 'toggle', label: 'Show vote tally' },
  ],
};
