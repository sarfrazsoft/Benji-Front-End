import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'benji-skill-detail',
  templateUrl: './skill-detail.component.html',
  styleUrls: ['./skill-detail.component.scss']
})
export class SkillDetailComponent implements OnInit {
  donutData1 = {
    title: 'Pitch Skill',
    data: 70,
    color: '#000000'
  };
  donutData2 = {
    title: 'Concise Skill',
    data: 80,
    color: '#36A2EB'
  };

  donutData3 = {
    title: 'Adaptive skill',
    data: 80,
    color: '#58ee1a'
  };

  donutData4 = {
    title: 'CCC skill',
    data: 80,
    color: '#0a000'
  };
  donutData5 = {
    title: 'CCC skill',
    data: 90,
    color: '#000cef'
  };
  constructor() {}

  ngOnInit() {}
}
