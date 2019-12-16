import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'benji-skill-overview',
  templateUrl: './skill-overview.component.html',
  styleUrls: ['./skill-overview.component.scss']
})
export class SkillOverviewComponent implements OnInit {
  @Input() overviewData;
  constructor() {}

  ngOnInit() {}
}
