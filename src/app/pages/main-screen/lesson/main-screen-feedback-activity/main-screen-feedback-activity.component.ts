import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-screen-feedback-activity',
  templateUrl: './main-screen-feedback-activity.component.html',
  styleUrls: ['./main-screen-feedback-activity.component.scss']
})
export class MainScreenFeedbackActivityComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public backToStart() {
    this.router.navigate(['/landing']);
  }

}
