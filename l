sed: -e expression #1, char 1: unknown command: `_'
error: external filter 'sed '_//gitignore$_'d' failed 1
error: external filter 'sed '_//gitignore$_'d' failed
warning: LF will be replaced by CRLF in src/app/app.module.ts.
The file will have its original line endings in your working directory.
sed: -e expression #1, char 1: unknown command: `_'
error: external filter 'sed '_//gitignore$_'d' failed 1
error: external filter 'sed '_//gitignore$_'d' failed
sed: -e expression #1, char 1: unknown command: `_'
error: external filter 'sed '_//gitignore$_'d' failed 1
error: external filter 'sed '_//gitignore$_'d' failed
sed: -e expression #1, char 1: unknown command: `_'
error: external filter 'sed '_//gitignore$_'d' failed 1
error: external filter 'sed '_//gitignore$_'d' failed
[1mdiff --git a/src/app/app.module.ts b/src/app/app.module.ts[m
[1mindex 0831d44..80801a8 100644[m
[1m--- a/src/app/app.module.ts[m
[1m+++ b/src/app/app.module.ts[m
[36m@@ -73,6 +73,8 @@[m [mimport { ParticipantHintActivityComponent } from './pages/participant/lesson/par[m
 // tslint:disable-next-line:max-line-length[m
 import { ParticipantFeedbackActivityComponent } from './pages/participant/lesson/participant-feedback-activity/participant-feedback-activity.component';[m
 import { MainScreenHintActivityComponent } from './pages/main-screen/lesson/main-screen-hint-activity/main-screen-hint-activity.component';[m
[32m+[m[32mimport { MainScreenMcqActivityComponent } from './pages/main-screen/lesson/main-screen-mcq-activity/main-screen-mcq-activity.component';[m
[32m+[m[32mimport { ParticipantMcqActivityComponent } from './pages/participant/lesson/participant-mcq-activity/participant-mcq-activity.component';[m
 [m
 @NgModule({[m
   declarations: [[m
[36m@@ -108,6 +110,8 @@[m [mimport { MainScreenHintActivityComponent } from './pages/main-screen/lesson/main[m
     ParticipantDiscussionActivityComponent,[m
     ParticipantHintActivityComponent,[m
     MainScreenHintActivityComponent,[m
[32m+[m[32m    MainScreenMcqActivityComponent,[m
[32m+[m[32m    ParticipantMcqActivityComponent,[m
 [m
   ],[m
   imports: [[m
[1mdiff --git a/src/app/pages/main-screen/lesson/main-screen-lesson.component.html b/src/app/pages/main-screen/lesson/main-screen-lesson.component.html[m
[1mindex 30f3649..52d3fed 100644[m
[1m--- a/src/app/pages/main-screen/lesson/main-screen-lesson.component.html[m
[1m+++ b/src/app/pages/main-screen/lesson/main-screen-lesson.component.html[m
[36m@@ -13,6 +13,7 @@[m
     <app-main-screen-discussion-activity *ngIf="currentActivity === 'discussionActivity'" [socketData]="socketData"></app-main-screen-discussion-activity>[m
     <app-main-screen-feedback-activity *ngIf="currentActivity === 'feedbackActivity'"></app-main-screen-feedback-activity>[m
     <app-main-screen-hint-activity *ngIf="currentActivity === 'hintWordActivity'" [socketData]="socketData"></app-main-screen-hint-activity>[m
[32m+[m[32m    <app-main-screen-mcq-activity *ngIf="currentActivity === 'mcqActivity'" [socketData]='socketData'></app-main-screen-mcq-activity>[m
 [m
 [m
 [m
