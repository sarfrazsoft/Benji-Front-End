import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'benji-session-end',
  templateUrl: './session-end.component.html',
  styleUrls: ['./session-end.component.scss'],
})
export class SessionEndComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit(): void {}
}
