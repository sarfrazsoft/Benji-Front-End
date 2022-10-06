import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TeamUser, Timer } from './backend/schema';
import { Participant } from './backend/schema/course_details';
import { PartnerInfo } from './backend/schema/whitelabel_info';

export type SideNavAction = 'opened' | 'closed';
@Injectable()
export class ContextService {
  constructor(private http: HttpClient, private router: Router) {}

  set user(user: TeamUser) {
    this.user$.next(user);
  }
  get user(): TeamUser {
    return this.user$.getValue();
  }

  set brandingInfo(brandingInfo: any) {
    this.brandingInfo$.next(brandingInfo);
  }
  get brandingInfo(): any {
    return this.brandingInfo$.getValue();
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

  set isLessonUpdated(lessonUpdated: boolean) {
    this.isLessonUpdatedSubject$.next(lessonUpdated);
  }

  get isLessonUpdated(): boolean {
    return this.isLessonUpdatedSubject$.getValue();
  }

  set sideNavAction(v: SideNavAction) {
    this.sideNavAction$.next(v);
  }

  get sideNavAction(): SideNavAction {
    return this.sideNavAction$.getValue();
  }

  public set participant(v: Participant) {
    this.p = v;
  }

  public get particiapnt(): Participant {
    return this.p;
  }

  set folders(folders: any) {
    this.folders$.next(folders);
  }
  get folders(): any {
    return this.folders$.getValue();
  }

  set selectedFolder(folder: any) {
    this.selectedFolder$.next(folder);
  }
  get selectedFolder(): number {
    return this.selectedFolder$.getValue();
  }

  set newFolderAdded(value: boolean) {
    this.newFolderAdded$.next(value);
  }
  get newFolderAdded(): boolean {
    return this.newFolderAdded$.getValue();
  }

  /**
   * Current User
   */
  user$ = new BehaviorSubject<TeamUser>(null);

  /**
   * Branding Info
   */
  brandingInfo$ = new BehaviorSubject<any>(null);

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
   * Lesson is updated
   */
  isLessonUpdatedSubject$ = new BehaviorSubject<boolean>(null);

  /**
   * Activity timer
   */
  sideNavAction$ = new BehaviorSubject<SideNavAction>(null);

  /**
   * participant
   */
  p: Participant;

  /**
   * folders
   */
  folders$ = new BehaviorSubject<any>(null);

  /**
   * Selected Folder
   */
  selectedFolder$ = new BehaviorSubject<any>(null);

  /**
   * Notify if new Folder added
   */
  newFolderAdded$ = new BehaviorSubject<any>(null);

  destroyActivityTimer() {
    this.activityTimer$.next(null);
  }
}
