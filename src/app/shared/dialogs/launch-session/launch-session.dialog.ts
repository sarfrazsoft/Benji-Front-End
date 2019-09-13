import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AdminService } from 'src/app/dashboard';
import * as global from 'src/app/globals';
import { BackendRestService, ContextService } from 'src/app/services';

@Component({
  selector: 'benji-launch-session-dialog',
  templateUrl: 'launch-session.dialog.html'
})
export class LaunchSessionDialogComponent implements OnInit {
  courses = [{ id: 1, name: 'Active Listening' }];
  constructor(
    private dialogRef: MatDialogRef<LaunchSessionDialogComponent>,
    private contextService: ContextService,
    private restService: BackendRestService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.courses = this.contextService.courses;
  }
  selectedSession;

  ngOnInit() {}

  public selectDefault() {}

  // duplicate code in courses.componnt.ts
  public launchSession(): void {
    console.log(this.selectedSession);
    // this.dialogRef.close(course);
    this.getCourseDetails(this.selectedSession.id).subscribe(res => {
      this.restService.start_lesson(res[0].id).subscribe(
        lessonRun => {
          this.dialogRef.close({});
          this.router.navigate([]).then(result => {
            window.open('/screen/lesson/' + lessonRun.lessonrun_code, '_blank');
          });
        },
        err => console.log(err)
      );
    });
  }

  getCourseDetails(courseID: string): Observable<any> {
    return this.http
      .get(global.apiRoot + '/course_details/course/' + courseID + '/lessons/')
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
