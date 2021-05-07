import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PastSessionsService } from 'src/app/services';
import { ActivityReport } from 'src/app/services/backend/schema';
import { Group } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-reports-text-editor',
  templateUrl: './reports-text-editor.component.html',
})
export class ReportsTextEditorComponent implements OnInit, OnChanges {
  @Input() group;
  jsonDoc;
  constructor(private pastSessionService: PastSessionsService) {}
  ngOnInit() {
    // if (group.id === this.currentSpeaker.id) {
    // this.showEditor = false;
    // setTimeout(() => {
    // this.showEditor = true;

    // });
    if (this.group && this.group.answer && this.group.answer.doc) {
      this.jsonDoc = this.group.answer.doc;
    }
    // }
  }

  ngOnChanges() {
    this.update();
    // this.activityState.casestudyactivity.groups.forEach((group) => {

    // });
  }

  update() {}
}
