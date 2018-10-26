import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WebSocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-participant-hint-activity',
  templateUrl: './participant-hint-activity.component.html',
  styleUrls: ['./participant-hint-activity.component.scss']
})
export class ParticipantHintActivityComponent implements OnInit {

  constructor(private socket: WebSocketService) { }

  public inputCharsRemaining: string;
  public hintWord = new FormControl(null, Validators.required);
  public activityState: string;
  public hintWordList = [
    'onion',
    'vigorous',
    'symbol',
    'policy',
    'gregarious',
    'voice',
    'course',
    'cottage',
    'routine',
    'divorce',
    'animal',
    'abridge',
    'hear',
    'lifestyle',
    'restrict',
    'sensitive',
    'young',
    'advance',
    'shaft',
    'eat'
  ];
  public hintWordSubmitted: boolean;
  public selectedWord: string;
  public winningWord: string;

  ngOnInit() {
    this.activityState = 'input';
  }

  public submitHintWord() {
    // const message = {
    //   'event': 'submit_word',
    //   'word': this.hintWord.value
    // };
    // this.socket.sendSocketFullMessage(message);
    this.hintWordSubmitted = true;
    setTimeout(() => {
      this.activityState = 'vote';
    }, 3000);
  }

  public selectWord(word) {
    this.selectedWord = word;
  }

  public confirmVote() {
    this.hintWordList = [this.selectedWord];
    this.winningWord = this.selectedWord;
    setTimeout(() => {
      this.activityState = 'complete';
    }, 5000);
  }

}
