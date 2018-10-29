import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as ons from 'onsenui';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { WebSocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-participant-join',
  templateUrl: './participant-join.component.html',
  styleUrls: ['./participant-join.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParticipantJoinComponent implements OnInit {
  public isRoomCodeValid: boolean;
  public userName: string;

  public roomCode = new FormControl(null, [
    Validators.required,
    Validators.min(4)
  ]);

  constructor(
    private router: Router,
    private backend: BackendService
  ) {}

  ngOnInit() {
    if (!this.userName) {
      this.backend.get_own_identity().subscribe((res) => {
        this.userName = res.first_name;
      });
    }
  }

  public validateRoomCode() {
    if (
      this.roomCode.valid &&
      this.roomCode.value === '73103' &&
      !this.isRoomCodeValid
    ) {
      this.isRoomCodeValid = true;
    } else {
      this.isRoomCodeValid = false;
    }
  }

  formSubmit() {
    this.router.navigate([`/participant/lesson/${this.roomCode.value}`]);
  }


}



