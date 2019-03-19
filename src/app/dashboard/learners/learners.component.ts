import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'benji-learners',
  templateUrl: './learners.component.html',
  styleUrls: ['./learners.component.scss']
})
export class LearnersComponent implements OnInit {
  constructor(private route: ActivatedRoute) {
    this.route.data.forEach((data: any) => {
      console.log(data);
    });
  }

  ngOnInit() {
    // create observable that emits click events
    const source = fromEvent(window, 'scroll');
    // map to string with given event timestamp
    const example = source.pipe(map(event => `Event time: ${event.timeStamp}`));
    // output (example): 'Event time: 7276.390000000001'
    const subscribe = example.subscribe(val => console.log(val));
  }
}
