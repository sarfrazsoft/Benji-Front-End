import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AdminService } from 'src/app/dashboard';
import * as global from 'src/app/globals';
import { BackendRestService, ContextService } from 'src/app/services';

@Component({
  selector: 'benji-launch-session-dialog',
  templateUrl: 'launch-session.dialog.html',
})
export class LaunchSessionDialogComponent implements OnInit {
  lessons = [];
  constructor(
    private dialogRef: MatDialogRef<LaunchSessionDialogComponent>,
    private contextService: ContextService,
    private restService: BackendRestService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.lessons = this.contextService.lessons;
  }
  selectedSession;

  ngOnInit() {}

  public selectDefault() {}

  // duplicate code in courses.componnt.ts
  public launchSession(): void {
    this.restService.start_lesson(this.selectedSession.id).subscribe(
      (lessonRun) => {
        this.dialogRef.close({});

        if (this.selectedSession.single_user_lesson) {
          setTimeout(() => {
            this.router.navigate(['/user/lesson/' + lessonRun.lessonrun_code]);
          }, 1500);
        } else {
          this.router.navigate([]).then((result) => {
            window.open('/screen/lesson/' + lessonRun.lessonrun_code, '_blank');
          });
        }
      },
      (err) => console.log(err)
    );
  }
}
