import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'benji-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {
  group = groupx;
  groups = [
    {
      name: 'Sales',
      members: 39,
      completedPercent: 100
    },
    {
      name: 'Finance',
      members: 11,
      completedPercent: 69
    },
    {
      name: 'Marketing',
      members: 20,
      completedPercent: 96
    },
    {
      name: 'Operations',
      members: 33,
      completedPercent: 30
    },
    {
      name: 'Human Resources',
      members: 5,
      completedPercent: 35
    }
  ];

  constructor() {}

  ngOnInit() {}
}

export const groupx = {
  name: 'Group One',
  description:
    'Description for Group One Group' +
    ' OneGroup OneGroup OneGroup OneGroup OneGroup One'
};
