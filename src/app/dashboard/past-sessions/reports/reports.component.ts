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
  FeedbackTagsComponent,
  GenericRoleplayComponent,
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
            const mcqCF = this.componentFactoryResolver.resolveComponentFactory(
              McqsComponent
            );
            const component = this.entry.createComponent(mcqCF);
            component.instance.data = act;

            // commented out tags feedback report
            // const FTagsCF = this.componentFactoryResolver.resolveComponentFactory(
            //   FeedbackTagsComponent
            // );
            // const component = this.entry.createComponent(FTagsCF);
            // component.instance.data = [
            //   {
            //     question: 'how do evaluate the pitch',
            //     tagScores: [
            //       { name: 'Nice', score: 6 },
            //       { name: 'Cool', score: 4 },
            //       { name: 'Bad', score: 2 },
            //       { name: 'The worse', score: 2 }
            //     ]
            //   },
            //   {
            //     question: 'how to chase a laser beam',
            //     tagScores: [
            //       { name: 'fast', score: 7 },
            //       { name: 'Nyoom', score: 5 },
            //       { name: 'slow', score: 2 },
            //       { name: 'creeping', score: 4 }
            //     ]
            //   }
            // ];
          } else if (act.activity_type === ActivityTypes.feedback) {
            const feedbackCF = this.componentFactoryResolver.resolveComponentFactory(
              FeedbackComponent
            );
            const component = this.entry.createComponent(feedbackCF);
            component.instance.data = act;
          } else if (act.activity_type === ActivityTypes.pitchoMatic) {
            const pomCF = this.componentFactoryResolver.resolveComponentFactory(
              PitchOMaticComponent
            );
            const component = this.entry.createComponent(pomCF);
            component.instance.data = act;
          } else if (act.activity_type === ActivityTypes.buildAPitch) {
            const bapCF = this.componentFactoryResolver.resolveComponentFactory(
              BuildAPitchComponent
            );
            const component = this.entry.createComponent(bapCF);
            component.instance.data = act;
          } else if (act.activity_type === ActivityTypes.genericRoleplay) {
            // const grplayCF = this.componentFactoryResolver.resolveComponentFactory(
            //   GenericRoleplayComponent
            // );
            // const component = this.entry.createComponent(grplayCF);
            // component.instance.data = act;
          }
        });
      });
  }
}
