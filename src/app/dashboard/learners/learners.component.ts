import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  ngOnInit() {}
}
