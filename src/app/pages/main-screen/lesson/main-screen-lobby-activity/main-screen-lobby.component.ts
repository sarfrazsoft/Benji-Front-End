import {Component, Input, Output, OnInit, OnDestroy, ViewEncapsulation, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { WebSocketService } from '../../../../services/socket.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mainscreen-lobby',
  templateUrl: './main-screen-lobby.component.html',
  styleUrls: ['./main-screen-lobby.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MainScreenLobbyComponent implements OnInit, OnDestroy {
  // @Input() joinedUsers;
  @Output() activityComplete = new EventEmitter();
  public lessonTitle: string;
  public lessonDescription: string;
  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;
  @Input() roomCode: string;
  @Input() set joinedUsers(data) {
    if(data.length > 0 && !this.gameStarted) {
      this.playSfx();
    }

    this._joinedUsers = data;
  }
  public socketData$: Observable<any>;
  public socketSubscription;
  public lessonId;
  public _joinedUsers = [];
  public gameStarted;



  constructor(private socket: WebSocketService, private route: ActivatedRoute) {

    // this.socket.createSocketConnection('1', 'screen').then((sd: any) => {
    //   sd.subscribe((data) => {
    //     console.log(data);
    //     const _participants = [];
    //     data.message.participants.forEach((participant) => {
    //       _participants.push(participant.first_name);
    //     });
    //     this.joinedUsers = _participants;

    //     this.roomCode = data.message.lesson_run.lessonrun_code;






    //   });
    // });
  }

  ngOnInit() {
    // this.lessonId = this.route.snapshot.paramMap.get('lessonId');
    // this.socketSubscription = this.socketData$.pipe(
    //   tap((data: any) => {
    //     const _participants = [];
    //     data.message.participants.forEach((participant) => {
    //       _participants.push(participant.first_name);
    //     });
    //     this.joinedUsers = _participants;
    //     console.log(this.joinedUsers);
    //   })
    // ).subscribe((data: any) => {
    //   // this.lessonTitle = data.message.lesson_title;
    //   // this.lessonDescription = data.message.lesson_description;
    //   console.log(data);
    //   this.roomCode = data.message.lesson_run.lessonrun_code;
    // });
  }

  ngOnDestroy() {
  }


  kickOffLesson() {
    this.activityComplete.emit(true);
    this.gameStarted = true;
    this.socket.sendSocketEventMessage('end');
    console.log('Kick off sent from main');
  }

  private playSfx () {
    console.log('condition met, playing...');
    this.sfxPlayer.nativeElement.play();
  }
}
