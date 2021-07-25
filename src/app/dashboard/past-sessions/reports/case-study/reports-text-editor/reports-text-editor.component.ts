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
  @Input() questionId;
  jsonDoc;
  constructor(private pastSessionService: PastSessionsService) {}
  ngOnInit() {
    if (this.group && this.group.answer[this.questionId]) {
      this.jsonDoc = this.group.answer[this.questionId];
    }
  }

  ngOnChanges() {
    this.update();
  }

  update() {}
}
