import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Timer } from './backend/schema';
import { Participant } from './backend/schema/course_details';
import { PartnerInfo } from './backend/schema/whitelabel_info';

@Injectable()
export class ContextService {
  constructor(private http: HttpClient, private router: Router) {}

  set user(user: any) {
    this.user$.next(user);
  }
  get user(): any {
    return this.user$.getValue();
  }

  set lessons(lessons: any) {
    this.lessons$.next(lessons);
  }
  get lessons(): any {
    return this.lessons$.getValue();
  }

  set lesson(lesson: any) {
    this.lesson$.next(lesson);
  }
  get lesson(): any {
    return this.lesson$.getValue();
  }

  set partnerInfo(partnerInfo: PartnerInfo) {
    this.partnerInfo$.next(partnerInfo);
  }
  get partnerInfo(): PartnerInfo {
    return this.partnerInfo$.getValue();
  }

  set activityTimer(activityTimer: Timer) {
    this.activityTimer$.next(activityTimer);
  }
  get activityTimer(): Timer {
    return this.activityTimer$.getValue();
  }

  set showTimerSubject(activityTimer: boolean) {
    this.showTimerSubject$.next(activityTimer);
  }
  get showTimerSubject(): boolean {
    return this.showTimerSubject$.getValue();
  }
  public set participant(v: Participant) {
    this.p = v;
  }
  public get particiapnt(): Participant {
    return this.p;
  }

  /**
   * Current User
   */
  user$ = new BehaviorSubject<any>(null);

  /**
   * Courses
   */
  lessons$ = new BehaviorSubject<any>(null);

  /**
   * Course
   */
  lesson$ = new BehaviorSubject<any>(null);

  /**
   * Current partner details
   */
  partnerInfo$ = new BehaviorSubject<PartnerInfo>(null);

  /**
   * Activity timer
   */
  activityTimer$ = new BehaviorSubject<Timer>(null);

  /**
   * Activity timer
   */
  showTimerSubject$ = new BehaviorSubject<boolean>(null);

  /**
   * participant
   */
  p: Participant;

  destroyActivityTimer() {
    this.activityTimer$.next(null);
  }
}
