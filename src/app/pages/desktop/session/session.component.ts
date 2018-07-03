import { Component, OnInit, ViewEncapsulation, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import { ActivatedRoute } from '@angular/router';

import {interval} from 'rxjs/internal/observable/interval';
import {startWith, switchMap} from 'rxjs/operators';
import {DesktopTitleComponent} from './desktop-title.component';
import {DesktopVideoActivityComponent} from './desktop-video-activity.component';
import {DesktopTPSActivityComponent} from './desktop-tps-activity.component';


@Component({
  selector: 'app-desktop-session',
  templateUrl: './session.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class SessionComponent implements OnInit {
  sessionRunID: string;
  sessionRunDetails;
  activities;
  activityDetails;
  poller;
  @ViewChild('dynamicComponent', { read: ViewContainerRef }) appActivity;
  componentRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private backend: BackendService, route: ActivatedRoute) {
    this.sessionRunID = route.snapshot.params['sessionRunID'];
    this.sessionRunDetails = {'sessionrun_code': 0, 'session': {'session_name': '', 'session_length': 0, 'session_description': ''}};
    this.activityDetails = {'activity': {'id': -1, 'titleactivity': {'timer': 500}}};
  }

  ngOnInit() {
    this.backend.get_sessionrun_details(this.sessionRunID).subscribe(
      resp => this.sessionRunDetails = resp,
      err => console.log(err)
    );

    this.backend.get_all_activities(this.sessionRunID).subscribe(
      resp => this.activities = resp,
      err => console.log(err)
    );

    this.poller = interval(5000).pipe(
      startWith(0),
      switchMap(() => this.backend.get_activity_status(this.sessionRunID))
    ).subscribe(
      resp => this.activityUpdate(resp),
      err => console.log(err)
    );
  }

  activityUpdate(resp) {
    if (!resp.activity || !resp.activityrun) {
      this.backend.get_activity_status(this.sessionRunID).subscribe(
        res => this.activityUpdate(res),
        err => console.log(err)
      );
    }

    if (this.activityDetails.activity.id !== resp.activity.id) {
      const componentFactory = this.getActivityFactory(resp.activity);
      this.appActivity.clear();
      this.componentRef = this.appActivity.createComponent(componentFactory);
      this.componentRef.instance.activityDetails = resp;
      this.componentRef.instance.sessionDetails = this.sessionRunDetails;
      this.componentRef.instance.dataInit();
    }
    this.activityDetails = resp;
    this.componentRef.instance.activityDetails = resp;
    this.componentRef.instance.sessionDetails = this.sessionRunDetails;
  }

  getActivityFactory(activity) {
    if (activity.titleactivity) {
      return this.componentFactoryResolver.resolveComponentFactory(DesktopTitleComponent);
    } else if (activity.videoactivity) {
      return this.componentFactoryResolver.resolveComponentFactory(DesktopVideoActivityComponent);
    } else if (activity.thinkpairshareactivity) {
      return this.componentFactoryResolver.resolveComponentFactory(DesktopTPSActivityComponent);
    } else {
      console.log('Unknown Activity!');
    }
  }

}
