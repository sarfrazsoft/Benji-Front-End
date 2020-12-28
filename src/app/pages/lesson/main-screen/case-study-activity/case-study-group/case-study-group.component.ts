import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'benji-case-study-group',
  templateUrl: './case-study-group.component.html',
  styleUrls: ['./case-study-group.component.scss'],
})
export class CaseStudyGroupComponent implements OnInit {
  @Input() group;
  collapsed = true;
  constructor() {}

  ngOnInit() {}
  collapseGroup() {
    this.collapsed = !this.collapsed;
    console.log(this.group);
  }
}
