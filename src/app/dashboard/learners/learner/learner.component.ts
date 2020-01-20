import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User, Users } from 'src/app/services/backend/schema';
import { LearnerService } from '../services/learner.service';

@Component({
  selector: 'benji-learner',
  templateUrl: './learner.component.html',
  styleUrls: ['./learner.component.scss']
})
export class LearnerComponent implements OnInit {
  learner: User;
  constructor(
    private learnerService: LearnerService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const learnerID = paramMap.get('learnerID');
      this.getLearnerData(learnerID);
    });
  }

  getLearnerData(learnerID: string) {
    this.learnerService.getUserDetails(learnerID).subscribe((res: Users) => {
      const arr = res.results.filter(
        (user: User) => user.id + '' === learnerID
      );
      if (arr.length) {
        this.learner = arr[0];
      }
    });
  }

  ngOnInit() {}
}
