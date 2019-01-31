import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'benji-single-stat',
  templateUrl: './single-stat.component.html',
  styleUrls: ['./single-stat.component.scss']
})
export class SingleStatComponent implements OnInit {
  @Input() value: string;
  @Input() label: string;

  constructor() {}

  ngOnInit() {}
}
