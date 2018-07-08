import { Component, OnInit, ViewEncapsulation, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import { ActivatedRoute } from '@angular/router';

import {CurrentActivityStatus, Activity} from '../../../models/benji_models';

import {MobileTitleComponent} from './mobile-title.component';
import {MobileVideoActivityComponent} from './mobile-video-activity.component';
import {MobileTPSActivityComponent} from './mobile-tps-activity.component';
import {WebsocketService} from '../../../services/socket.service';


@Component({
  selector: 'app-mobile-session',
  templateUrl: './mobile-session.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileSessionComponent implements OnInit {
  sessionRunID: string;
  sessionRunDetails;
  activityStatus: CurrentActivityStatus;

  @ViewChild('dynamicComponent', { read: ViewContainerRef }) appActivity;
  componentRef;
  sessionSocket;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private backend: BackendService, route: ActivatedRoute, private ws: WebsocketService) {
    this.sessionRunID = route.snapshot.params['sessionRunID'];
    this.sessionRunDetails = {'sessionrun_code': 0, 'session': {'session_name': '', 'session_length': 0, 'session_description': ''}};
    // this.activityDetails = {'activity': {'id': -1, 'titleactivity': {'timer': 500}}};
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
    if (!this.activityStatus || this.activityStatus.current_activity.id !== resp.current_activity.id) {
      const componentFactory = this.getActivityFactory(resp.current_activity);
      this.appActivity.clear();
      this.componentRef = this.appActivity.createComponent(componentFactory);
      this.componentRef.instance.activityDetails = resp;
      this.componentRef.instance.sessionDetails = this.sessionRunDetails;
      this.componentRef.instance.dataInit();
      this.backend.join_activity(resp.current_activityrun.id).subscribe();
    }
    this.activityStatus = resp;
    this.componentRef.instance.activityDetails = resp;
    this.componentRef.instance.sessionDetails = this.sessionRunDetails;
  }

  getActivityFactory(activity: Activity) {
    if (activity.titleactivity) {
      return this.componentFactoryResolver.resolveComponentFactory(MobileTitleComponent);
    } else if (activity.videoactivity) {
      return this.componentFactoryResolver.resolveComponentFactory(MobileVideoActivityComponent);
    } else if (activity.thinkpairshareactivity) {
      return this.componentFactoryResolver.resolveComponentFactory(MobileTPSActivityComponent);
    } else {
      console.log('Unknown Activity!');
    }
  }

}
