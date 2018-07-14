import {Component, Input, Output, ViewEncapsulation, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-feedback-prompt',
  template:
  '<div class="open-text-form-wrap" *ngIf="prompt.prompt_type === \'text\'">' +
  '  <label for="prompt{{ prompt.id }}" class="form-text">{{ prompt.question }}</label>' +
  '  <textarea id="prompt{{ prompt.id }}" #prompttext name="prompt{{ prompt.id }}" maxlength="5000" data-name="prompt{{ prompt.id }}" class="textarea w-input" (change)="changed_text()" [(ngModel)]="textVal" style="width:100%"></textarea>' +
  '</div>' +
  '<div class="open-text-form-wrap" *ngIf="prompt.prompt_type === \'rating\'">' +
  '  <label class="form-text">{{ prompt.question }}</label>' +
  '  <ons-segment #rating id="rating" style="width: 100%" active-index="2">\n' +
  '    <button (click)="changed_rating(\'Strongly Disagree\')">1</button>\n' +
  '    <button (click)="changed_rating(\'Disagree\')">2</button>\n' +
  '    <button (click)="changed_rating(\'Neutral\')">3</button>\n' +
  '    <button (click)="changed_rating(\'Agree\')">4</button>\n' +
  '    <button (click)="changed_rating(\'Strongly Agree\')">5</button>\n' +
  '  </ons-segment>' +
  '<div>\n' +
  '              <div class="div-block-4" style="margin-top:10px; text-align: center">\n' +
  '                <div class="text-block-4">STRONGLY DISAGREE</div>\n' +
  '                <div class="text-block-4">DISAGREE</div>\n' +
  '                <div class="text-block-4">NEUTRAL</div>\n' +
  '                <div class="text-block-4">AGREE</div>\n' +
  '                <div class="text-block-4">STRONGLY AGREE</div>\n' +
  '              </div>\n' +
  '            </div>' +
  '</div>',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class FeedbackPromptComponent implements OnInit {
  @Input() prompt;
  @Output() value = new EventEmitter();

  textVal;

  constructor() { }

  ngOnInit() {
    this.value.emit('Neutral');
  }

  changed_rating(val) {
    this.value.emit(val);
  }

  changed_text() {
    this.value.emit(this.textVal);
  }
}

