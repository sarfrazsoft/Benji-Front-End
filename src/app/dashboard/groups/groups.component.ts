import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import {
  debounceTime,
  distinct,
  filter,
  flatMap,
  map,
  tap
} from 'rxjs/operators';

@Component({
  selector: 'benji-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
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

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.data.forEach((data: any) => {
      console.log(data);
    });
  }

  ngOnInit() {
    // // create observable that emits click events
    // const source = fromEvent(window, 'scroll');
    // // map to string with given event timestamp
    // const example = source.pipe(map(event => `Event time: ${event.timeStamp}`));
    // // output (example): 'Event time: 7276.390000000001'
    // const subscribe = example.subscribe(val => console.log(val));
  }

  addLearners() {
    this.router.navigate(['/dashboard/learners/add']);
  }
}
