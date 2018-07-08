import { Component, OnInit, ViewEncapsulation, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {WebsocketService} from '../../../services/socket.service';
import { ActivatedRoute } from '@angular/router';

import {DesktopTitleComponent} from './desktop-title.component';
import {DesktopVideoActivityComponent} from './desktop-video-activity.component';
import {DesktopTPSActivityComponent} from './desktop-tps-activity.component';
import {CurrentActivityStatus, Activity} from '../../../models/benji_models';


@Component({
  selector: 'app-desktop-session',
  templateUrl: './session.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class SessionComponent implements OnInit {
  sessionRunID: string;
  sessionRunDetails;
  activityStatus: CurrentActivityStatus;

  sessionSocket;
  @ViewChild('dynamicComponent', { read: ViewContainerRef }) appActivity;
  componentRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private backend: BackendService, route: ActivatedRoute, private ws: WebsocketService) {
    this.sessionRunID = route.snapshot.params['sessionRunID'];
    this.sessionRunDetails = {'sessionrun_code': 0, 'session': {'session_name': '', 'session_length': 0, 'session_description': ''}};
    // this.activityStatus = {'current_activity': {'id': -1, 'titleactivity': {'timer': 500}}, 'current_activityrun': null};
  }

  ngOnInit() {
    this.backend.get_sessionrun_details(this.sessionRunID).subscribe(
      resp => this.sessionRunDetails = resp,
      err => console.log(err)
    );

    this.sessionSocket = this.ws.getSessionSocket(this.sessionRunID)
      .subscribe((message: CurrentActivityStatus) => {
        this.activityUpdate(message);
      });
  }

  activityUpdate(resp: CurrentActivityStatus) {
    console.log(resp);
    if (!this.activityStatus || this.activityStatus.current_activity.id !== resp.current_activity.id) {
      const componentFactory = this.getActivityFactory(resp.current_activity);
      this.appActivity.clear();
      this.componentRef = this.appActivity.createComponent(componentFactory);
      this.componentRef.instance.activityDetails = resp;
      this.componentRef.instance.sessionDetails = this.sessionRunDetails;
      this.componentRef.instance.dataInit();
    }
    this.activityStatus = resp;
    this.componentRef.instance.activityDetails = resp;
    this.componentRef.instance.sessionDetails = this.sessionRunDetails;
  }

  getActivityFactory(activity: Activity) {
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
