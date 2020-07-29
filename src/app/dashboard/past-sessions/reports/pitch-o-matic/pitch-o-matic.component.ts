import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { PastSessionsService } from 'src/app/services';
import { ActivityReport } from 'src/app/services/backend/schema';
import { PitchOMaticComponent as LearnerPitchOMaticComponent } from './single-pitch-o-matic/pitch-o-matic.component';

@Component({
  selector: 'benji-pitch-o-matic',
  templateUrl: './pitch-o-matic.component.html',
  styleUrls: ['./pitch-o-matic.component.scss']
})
export class PitchOMaticComponent implements OnInit, OnChanges {
  @Input() data: ActivityReport;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild('reportEntry', { read: ViewContainerRef }) entry: ViewContainerRef;
  singleUserPOMcomponent: ComponentRef<LearnerPitchOMaticComponent>;

  constructor(
    private pastSessionService: PastSessionsService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  displayedColumns: string[] = ['question', 'average'];
  tableData = [];

  getTotalAverage() {
    return 4;
  }

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe(updatedUserFilter => {
      if (this.singleUserPOMcomponent) {
        this.singleUserPOMcomponent.destroy();
      }
      this.updatePOMReport();
    });
    this.updatePOMReport();
  }

  updatePOMReport() {
    if (this.isSingleUser()) {
      // create single user data here
      this.updateSingleUserReport();
    } else {
      this.updateMultiUserReport();
    }
  }

  updateSingleUserReport() {
    if (this.singleUserPOMcomponent) {
      this.singleUserPOMcomponent.destroy();
    }
    // create single user data here
    const pomComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
      LearnerPitchOMaticComponent
    );
    this.singleUserPOMcomponent = this.entry.createComponent(
      pomComponentFactory
    );
    this.singleUserPOMcomponent.instance.data = this.data;
  }

  updateMultiUserReport() {
    if (this.singleUserPOMcomponent) {
      this.singleUserPOMcomponent.destroy();
    }
    if (this.data && this.data.pom) {
      const pomData = this.data.pom;
      this.tableData = [];

      pomData.feedbackquestion_set.forEach(question => {
        let sum = 0;
        pomData.pitchomaticgroupmembers.forEach(member => {
          const rating = member.pitchomaticfeedback_set.find(
            fb => fb.feedbackquestion === question.id
          );
          if (rating) {
            sum = sum + rating.rating_answer;
          }
        });
        let avg = sum / this.data.joined_users.length;
        avg = Math.round(avg * 10) / 10;

        this.tableData.push({
          question: question.question_text,
          questionId: question.id,
          average: avg
        });
      });
    }
  }

  isSingleUser() {
    return this.pastSessionService.filteredInUsers.length === 1;
  }

  ngOnChanges() {}
}
