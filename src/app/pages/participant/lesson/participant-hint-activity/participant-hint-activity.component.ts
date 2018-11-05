import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WebSocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-participant-hint-activity',
  templateUrl: './participant-hint-activity.component.html',
  styleUrls: ['./participant-hint-activity.component.scss']
})
export class ParticipantHintActivityComponent implements OnInit {

  constructor(private socket: WebSocketService) { }

  @Input() set socketData(data) {
    const activity = data.message.activity_status;

    if (activity.submission_complete && !activity.voting_complete) {
      this.activityState = 'vote';
      this.hintWordList = activity.submitted_words;
    } else if (activity.submission_complete && activity.voting_complete) {
      this.winningWord = activity.voted_word;
      this.activityState = 'complete';
    }

  }


  @Output() socketMessage = new EventEmitter<any>();
  public inputCharsRemaining: string;
  public hintWord = new FormControl(null, Validators.required);
  public activityState = 'input';
  public hintWordList;
  public hintWordSubmitted: boolean;
  public selectedWord: string;
  public voteSubmitted: boolean;
  public winningWord: string;

  ngOnInit() {
  }

  public submitHintWord() {
    if (!this.hintWordSubmitted && this.hintWord.value !== undefined) {
      console.log('submitting word');
      this.socketMessage.emit(
        {
          'event': 'submit_word',
          'word': this.hintWord.value
        }
      );
      this.hintWordSubmitted = true;

    }
  }

  public selectWord(word) {
    this.selectedWord = word;
  }

  public confirmVote() {
    if(!this.voteSubmitted) {
      this.socketMessage.emit({
        'event': 'submit_vote',
        'word': this.selectedWord
      });
      this.voteSubmitted = true;
      this.hintWordList = [this.selectedWord];
    }
  }

}
