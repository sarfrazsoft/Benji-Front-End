import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'benji-case-study-group',
  templateUrl: './case-study-group.component.html',
  styleUrls: ['./case-study-group.component.scss'],
})
export class CaseStudyGroupComponent implements OnInit {
  @Input() group;

  @Input() collapsed = false;

  constructor() {}

  ngOnInit() {}
  collapseGroup() {
    this.collapsed = !this.collapsed;
  }
}
