import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService, ContextService } from 'src/app/services';
import { Branding } from 'src/app/services/backend/schema';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { FolderInfo, LessonGroupService } from 'src/app/services/lesson-group.service';
import { ConfirmationDialogComponent, JoinSessionDialogComponent, LaunchSessionDialogComponent, NewFolderDialogComponent } from '../../shared';
import { SidenavItem } from './sidenav-item/sidenav-item.component';
export interface SidenavSection {
  section: number;
  items: Array<SidenavItem>;
}
export interface Folder {
  id: number;
  lessons: Array<any>;
  name: string;
}
@Component({
  selector: 'benji-menu',
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent implements OnInit {
  sidenavTopSections: Array<SidenavSection> = [];
  sidenavBottomSections: Array<SidenavSection> = [];
  courses;
  launchArrow = '';
  logo = '';
  //folders: Array<Folder>;
  folders: any = [];
  selectedFolder: any;
  folderLessonsIDs: Array<number> = [];

  dashboard = {
    section: 1,
    items: [
      {
        navName: 'Home',
        navRoute: './',
        permission: '',
        icon: '/assets/img/dashboard/home.svg',
      },
    ],
  };

  notifications = {
    section: 2,
    items: [
      {
        navName: 'Notifications',
        navRoute: 'notifications',
        icon: '/assets/img/dashboard/notifications.svg',
      },
    ],
  };

  templatesSection = {
    section: 3,
    items: [
      {
        navName: 'Templates',
        navRoute: './templates',
        icon: '/assets/img/dashboard/templates.svg',
      },
    ],
  };

  helpCenter = {
    section: 9,
    items: [
      {
        navName: 'Help Center',
        navRoute: 'https://guides.mybenji.com/',
        icon: '/assets/img/dashboard/help.svg',
      },
    ],
  };

  accountSection = {
    section: 5,
    items: [
      {
        navName: 'Settings',
        navRoute: 'account',
        icon: '/assets/img/dashboard/settings.svg',
      },
    ],
  };

  authSection = {
    section: 7,
    items: [
      {
        navName: 'Logout',
        navRoute: 'logout',
        icon: '/assets/img/dashboard/log-out.svg',
      },
    ],
  };

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private contextService: ContextService,
    private lessonGroupService: LessonGroupService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initNavigation();
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.launchArrow = info.parameters.joinArrow;
      }
    });

    this.contextService.brandingInfo$.subscribe((info: Branding) => {
      if (info) {
        this.logo = info.logo ? info.logo.toString() : '/assets/img/Benji_logo.svg';
      }
    });

    this.contextService.selectedFolder$.subscribe((folder) => {
      this.selectedFolder = folder;
    });

    this.contextService.newFolderAdded$.subscribe((value) => {
      if (value) {
        this.getAllFolders();
      }
    });

    this.getAllFolders();

  }

  launchSession(): void {
    this.dialog
      .open(LaunchSessionDialogComponent, {
        panelClass: 'dashboard-dialog',
      })
      .afterClosed()
      .subscribe((user) => {});
  }

  joinSession(): void {
    this.dialog
      .open(JoinSessionDialogComponent, {
        panelClass: 'dashboard-dialog',
      })
      .afterClosed()
      .subscribe((user) => {});
  }

  logout() {
    this.authService.signOut();
  }

  initNavigation() {
    this.contextService.user$.subscribe((user) => {
      this.sidenavTopSections = [this.dashboard, this.notifications];

      this.sidenavBottomSections = [this.accountSection, this.helpCenter, this.authSection];
    });
  }

  getAllFolders() {
    this.lessonGroupService.getAllFolders()
      .subscribe(
        (data) => {
          this.folders = data;
        },
        (error) => console.log(error)
      );
  }

  createOrUpdateFolder(isNew: boolean, folderId?: number) {
    if (folderId) {
      this.setFolderLessonsIDs(folderId);
    }
    const folder = this.folders.filter(x => x.id === folderId);
    this.dialog
      .open(NewFolderDialogComponent, {
        data: {
          newFolder: isNew,
          title: folder[0]?.name,
        },
        panelClass: 'new-folder-dialog',
      })
      .afterClosed()
      .subscribe((folderInfo: FolderInfo) => {
        if (folderInfo) {
          let request = isNew ?
            this.lessonGroupService.createNewFolder(folderInfo) :
            this.lessonGroupService.updateFolder({ title: folderInfo.title, id: folderId, lessonsIds: this.folderLessonsIDs });
          request.subscribe(
            (data) => {
              this.getAllFolders();
              //console.log(data);
            },
            (error) => console.log(error)
          );
        }
      });
  }

  deleteFolder(id: number, name: string) {
    const msg = 'Are you sure you want to delete ' + name + '?';
    const dialogRef = this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: msg,
        },
        disableClose: true,
        panelClass: 'confirmation-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.lessonGroupService.deleteFolder(id)
            .subscribe(
              (data) => {
                this.getAllFolders();
                this.removePostQueryParam();
              },
              (error) => console.log(error)
            );
        }
      });
  }

  removePostQueryParam() {
    this.contextService.selectedFolder = null;
    this.router.navigate(['/dashboard'], {
      queryParams: {
        folder: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  public folderChangingQueryParams(id: number) {
    const url = this.router.routerState.snapshot.url
    const command = url.includes('account') || url.includes('notifications') ? ['/dashboard'] : [];
    this.router.navigate(command, {
      relativeTo: null,
      queryParams: { folder: id },
      queryParamsHandling: 'merge',
    });
  }

  selectFolder(id: number) {
    this.selectedFolder = id;
    this.folderChangingQueryParams(id);
    this.contextService.selectedFolder = id;
  }

  setFolderLessonsIDs(folderId: number) {
    this.folderLessonsIDs = [];
    this.lessonGroupService.getFolderDetails(folderId)
      .subscribe(
        (folder) => {
          const lessons = folder.lesson;
          this.folderLessonsIDs = [];
          lessons.forEach((lesson) => {
            this.folderLessonsIDs.push(lesson.id);
          });
        }
      );
  }

}
