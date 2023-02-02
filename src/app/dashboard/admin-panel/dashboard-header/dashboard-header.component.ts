import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Intercom } from 'ng-intercom';
import { ContextService } from 'src/app/services';
import { TeamUser, UserSubscription } from 'src/app/services/backend/schema';
import { DOCUMENT } from '@angular/common';
import { LessonGroupService } from 'src/app/services/lesson-group.service';
import { ProPlanDialogComponent, SessionSettingsDialogComponent } from 'src/app/shared';
import { AdminService } from '../services';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'benji-dashboard-header',
  templateUrl: './dashboard-header.component.html',
})
export class DashboardHeaderComponent implements OnInit {
  @Input() lessonRuns: Array<any> = [];
  @Input() selectedFolderId: number;
  @Input() folderName: string;
  @Input() folderLessonsIDs: Array<number> = [];
  @Output() toggleLayout = new EventEmitter<string>();

  adminName = '';
  userId: number;
  userEmail: string;
  userSubscription: UserSubscription;
  ignoreSubscription: boolean;

  constructor(
    public intercom: Intercom,
    private adminService: AdminService,
    private contextService: ContextService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private router: Router,
    private lessonGroupService: LessonGroupService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit() {
    this.adminName = this.contextService.user.first_name;
    this.userId = this.contextService.user.id;
    this.userEmail = this.contextService.user.email;
    this.userSubscription = this.contextService.user.user_subscription;
    this.ignoreSubscription = this.contextService.user.ignore_subscription;
  }

  openProPlanDialog() {
    const dialogRef = this.dialog
      .open(ProPlanDialogComponent, {
        disableClose: true,
        panelClass: 'pro-plan-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.utilsService.goToStripe(this.userEmail, this.userId);
        }
      });
  }

  openCreateSession() {
    if (this.lessonRuns.length >= 3 && !this.userSubscription?.is_active && !this.ignoreSubscription) {
      this.openProPlanDialog();
    } else {
      this.dialog
        .open(SessionSettingsDialogComponent, {
          data: {
            createSession: true,
            title: '',
            description: '',
            lessonImage: '',
            imageUrl: '',
          },
          panelClass: 'session-settings-dialog',
        })
        .afterClosed()
        .subscribe((data) => {
          if (data) {
            this.adminService.createNewBoard(data).subscribe((res: any) => {
              this.adminService
                .addLessonRunImage(
                  res.lessonrun_code,
                  data.selectedImage,
                  data.selectedImageName,
                  data.imageUrl
                )
                .subscribe(
                  (data1) => {
                    console.log(data1);
                  },
                  (error) => console.log(error)
                );
              const folderId = this.selectedFolderId;
              this.folderLessonsIDs.push(res.lesson);
              if (folderId) {
                this.lessonGroupService
                  .updateFolder({ title: this.folderName, lessonsIds: this.folderLessonsIDs, id: folderId })
                  .subscribe(
                    (data2) => {
                      console.log(data2);
                    },
                    (error) => console.log(error)
                  );
              }
              // user object was stored when this user logged in.
              // Now we need to store it as host so other modules know who is host
              // for this particular session
              const user: TeamUser = JSON.parse(localStorage.getItem('user'));
              localStorage.setItem('host_' + res.lessonrun_code, JSON.stringify(user));
              this.router.navigate(['/screen/lesson/' + res.lessonrun_code]);
            });
          }
        });
    }
  }
}
