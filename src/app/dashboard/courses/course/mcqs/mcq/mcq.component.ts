import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MCQFeedbackDialogComponent } from 'src/app/shared/dialogs';

@Component({
  selector: 'benji-mcq',
  templateUrl: './mcq.component.html',
  styleUrls: ['./mcq.component.scss'],
})
export class McqComponent implements OnInit {
  @Input() mcq;
  selectedChoice;
  submitted = false;
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}
  submit() {
    console.log('submitted');
    this.submitted = true;
    // if wrong answer
    if (true) {
      this.showFeedback();
    }
  }

  showFeedback() {
    if (this.submitted) {
      this.dialog
        .open(MCQFeedbackDialogComponent, {
          panelClass: 'dashboard-dialog',
          data: {
            explanationMessage: this.mcq.correctExplanation,
          },
        })
        .afterClosed()
        .subscribe((user) => {});
    }
  }

  select(choice) {
    // this.mcqSelected.emit(this.mcq);
    this.selectedChoice = choice.id;
  }
}
