import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService, ContextService } from 'src/app/services';
import { Branding, UserSubscription } from 'src/app/services/backend/schema';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { FolderInfo, LessonGroupService } from 'src/app/services/lesson-group.service';
import { environment } from 'src/environments/environment';
import {
  ConfirmationDialogComponent,
  JoinSessionDialogComponent,
  LaunchSessionDialogComponent,
  NewFolderDialogComponent,
} from '../../shared';
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
  // folders: Array<Folder>;
  folders: any = [];
  selectedFolder: any;
  folderLessonsIDs: Array<number> = [];
  imgSrc: string;
  userId: number;
  userEmail: string;
  userSubscription: UserSubscription;

  dashboard = {
    section: 1,
    items: [
      {
        navName: 'Home',
        navRoute: './',
        permission: '',
        icon: '/assets/img/dashboard/home.svg',
        hoverIcon: '/assets/img/dashboard/home-hover.svg',
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
        hoverIcon: '/assets/img/dashboard/notifications-hover.svg',
      },
    ],
  };

  templatesSection = {
    section: 3,
    items: [
      {
        navName: 'Templates',
        navRoute: 'https://www.mybenji.com/templates',
        icon: '/assets/img/dashboard/templates.svg',
        hoverIcon: '/assets/img/dashboard/templates-hover.svg',
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
        hoverIcon: '/assets/img/dashboard/help-hover.svg',
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
        hoverIcon: '/assets/img/dashboard/settings-hover.svg',
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
        hoverIcon: '/assets/img/dashboard/log-out-hover.svg',
      },
    ],
  };

  billingSection = {
    navName: 'Billing',
    link: 'billing',
    icon: '/assets/img/dashboard/billing.svg',
    hoverIcon: '/assets/img/dashboard/billing-hover.svg',
  };

  upgradeSection = {
    navName: 'Upgrade to Pro',
    link: 'upgrade',
    icon: '/assets/img/dashboard/upgrade.svg',
    hoverIcon: '/assets/img/dashboard/upgrade-hover.svg',
  };

  proplanSection;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private contextService: ContextService,
    private lessonGroupService: LessonGroupService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.contextService.user?.id;
    this.userEmail = this.contextService.user?.email;
    this.userSubscription = this.contextService.user?.user_subscription;
    this.proplanSection = this.userSubscription?.is_active ? this.billingSection : this.upgradeSection;
    this.imgSrc = this.proplanSection.icon;

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

      this.sidenavBottomSections = [
        this.templatesSection,
        this.accountSection,
        this.helpCenter,
        this.authSection,
      ];
    });
  }

  getAllFolders() {
    this.lessonGroupService.getAllFolders().subscribe(
      (data) => {
        this.folders = data;
      },
      (error) => console.log(error)
    );
  }

  createOrUpdateFolder($event) {
    if ($event.folderId) {
      this.setFolderLessonsIDs($event.folderId);
    }
    const folder = this.folders.filter((x) => x.id === $event.folderId);
    this.dialog
      .open(NewFolderDialogComponent, {
        data: {
          newFolder: $event.isNew,
          title: folder[0]?.name,
        },
        panelClass: 'new-folder-dialog',
      })
      .afterClosed()
      .subscribe((folderInfo: FolderInfo) => {
        if (folderInfo) {
          const request = $event.isNew
            ? this.lessonGroupService.createNewFolder(folderInfo)
            : this.lessonGroupService.updateFolder({
                title: folderInfo.title,
                id: $event.folderId,
                lessonsIds: this.folderLessonsIDs,
              });
          request.subscribe(
            (data) => {
              this.getAllFolders();
              // console.log(data);
            },
            (error) => console.log(error)
          );
        }
      });
  }

  deleteFolder($event) {
    const msg = 'Are you sure you want to delete ' + $event.folderName + '?';
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
          this.lessonGroupService.deleteFolder($event.folderId).subscribe(
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
    const url = this.router.routerState.snapshot.url;
    const command = url.includes('account') || url.includes('notifications') ? ['/dashboard'] : [];
    this.router.navigate(command, {
      relativeTo: null,
      queryParams: { folder: id },
      queryParamsHandling: 'merge',
    });
  }

  selectFolder($event: number) {
    this.selectedFolder = $event;
    this.folderChangingQueryParams($event);
    this.contextService.selectedFolder = $event;
  }

  setFolderLessonsIDs(folderId: number) {
    this.folderLessonsIDs = [];
    this.lessonGroupService.getFolderDetails(folderId).subscribe((folder) => {
      const lessons = folder.lesson;
      this.folderLessonsIDs = [];
      lessons.forEach((lesson) => {
        this.folderLessonsIDs.push(lesson.id);
      });
    });
  }

  goProplan(link: string) {
    window.location.href =
      link === 'billing'
        ? 'https://billing.stripe.com/p/login/28o00P72N4P0clqcMM'
        : environment.stripe + '?prefilled_email=' + this.userEmail + '&client_reference_id=' + this.userId;
  }
}
