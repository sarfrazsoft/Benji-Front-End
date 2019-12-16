import {
  AfterContentInit,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ActivityTypes } from 'src/app/globals';
import { ActivityReport } from 'src/app/services/backend/schema';
import { PastSessionsService } from 'src/app/services/past-sessions.service';
import {
  BuildAPitchComponent,
  FeedbackComponent,
  McqsComponent,
  PitchOMaticComponent
} from './index';

@Component({
  selector: 'benji-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  config: PerfectScrollbarConfigInterface = {};
  @ViewChild('reportEntry', { read: ViewContainerRef }) entry: ViewContainerRef;

  statsData: ActivityReport;

  constructor(
    private pastSessionsService: PastSessionsService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const lesssonrunCode = paramMap.get('lessonrunCode');
      this.getSessionSummary(lesssonrunCode);
    });
  }

  getSessionSummary(lessonrunCode: string) {
    console.log(lessonrunCode);
    this.pastSessionsService
      .getReports(lessonrunCode)
      .subscribe((res: Array<ActivityReport>) => {
        this.statsData = res[0];

        // Iterate over each item in array
        res.forEach((act: ActivityReport) => {
          if (act.activity_type === ActivityTypes.mcq) {
            const mcqComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
              McqsComponent
            );
            const component = this.entry.createComponent(mcqComponentFactory);
            component.instance.data = act;
          } else if (act.activity_type === ActivityTypes.feedback) {
            const feedbackComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
              FeedbackComponent
            );
            const component = this.entry.createComponent(
              feedbackComponentFactory
            );
            component.instance.data = act;
          } else if (act.activity_type === ActivityTypes.pitchoMatic) {
            const pomComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
              PitchOMaticComponent
            );
            const component = this.entry.createComponent(pomComponentFactory);
            component.instance.data = act;
          } else if (act.activity_type === ActivityTypes.buildAPitch) {
            const bapComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
              BuildAPitchComponent
            );
            const component = this.entry.createComponent(bapComponentFactory);
            component.instance.data = act;
          }
        });
      });
  }
}
