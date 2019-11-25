import { Component, Input, OnInit } from '@angular/core';
import { ActivityReport } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-peer-feedback',
  templateUrl: './peer-feedback.component.html',
  styleUrls: ['./peer-feedback.component.scss']
})
export class PeerFeedbackComponent implements OnInit {
  @Input() pomData: ActivityReport;
  constructor() {}

  ngOnInit() {}
}
