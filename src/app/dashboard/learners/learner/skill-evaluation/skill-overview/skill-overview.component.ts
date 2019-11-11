import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'benji-skill-overview',
  templateUrl: './skill-overview.component.html',
  styleUrls: ['./skill-overview.component.scss']
})
export class SkillOverviewComponent implements OnInit {
  donutData = {
    title: 'Pitch Skill',
    data: 70,
    color: '#0a4cef'
  };
  constructor() {}

  ngOnInit() {}
}
