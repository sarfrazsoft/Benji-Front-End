import {
  AfterContentInit,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ActivityTypes as Acts } from 'src/app/globals';
import { PastSessionsService } from 'src/app/services';
import { ActivityReport } from 'src/app/services/backend/schema';
import { CaseStudyComponent } from './case-study/case-study.component';
import {
  BrainStormComponent,
  BuildAPitchComponent,
  FeedbackComponent,
  FeedbackTagsComponent,
  GenericRoleplayComponent,
  McqsComponent,
  PitchOMaticComponent,
} from './index';

@Component({
  selector: 'benji-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  config: PerfectScrollbarConfigInterface = {};
  @ViewChild('reportEntry', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;

  statsData: ActivityReport;

  constructor(
    private pastSessionsService: PastSessionsService,
    private cfr: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const lesssonrunCode = paramMap.get('lessonrunCode');
      this.pastSessionsService.resetFilter();
      this.getSessionSummary(lesssonrunCode);
    });
  }

  getSessionSummary(lessonrunCode: string) {
    this.pastSessionsService.getReports(lessonrunCode).subscribe((res: Array<ActivityReport>) => {
      this.statsData = res[0];
      // Iterate over each item in array
      res.forEach((act: ActivityReport) => {
        if (act.activity_type === Acts.mcq) {
          const mcqCF = this.cfr.resolveComponentFactory(McqsComponent);
          const component = this.entry.createComponent(mcqCF);
          component.instance.data = act;

          // commented out tags feedback report
          // const FTagsCF = this.cfr.resolveComponentFactory(
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
        } else if (act.activity_type === Acts.feedback) {
          const f = this.cfr.resolveComponentFactory(FeedbackComponent);
          const component = this.entry.createComponent(f);
          component.instance.data = act;
        } else if (act.activity_type === Acts.pitchoMatic) {
          const p = this.cfr.resolveComponentFactory(PitchOMaticComponent);
          const component = this.entry.createComponent(p);
          component.instance.data = act;
        } else if (act.activity_type === Acts.buildAPitch) {
          const b = this.cfr.resolveComponentFactory(BuildAPitchComponent);
          const component = this.entry.createComponent(b);
          component.instance.data = act;
        } else if (act.activity_type === Acts.genericRoleplay) {
          const g = this.cfr.resolveComponentFactory(GenericRoleplayComponent);
          const component = this.entry.createComponent(g);
          component.instance.data = act;
        } else if (act.activity_type === Acts.brainStorm) {
          const b = this.cfr.resolveComponentFactory(BrainStormComponent);
          const component = this.entry.createComponent(b);
          component.instance.data = act;
        } else if (act.activity_type === Acts.caseStudy) {
          const c = this.cfr.resolveComponentFactory(CaseStudyComponent);
          const component = this.entry.createComponent(c);
          component.instance.data = act;
        }
      });
    });
  }
}
