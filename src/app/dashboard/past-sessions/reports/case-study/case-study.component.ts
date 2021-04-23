import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PastSessionsService } from 'src/app/services';
import { ActivityReport } from 'src/app/services/backend/schema';

export interface CaseStudyGroup {
  participants: string;
  notes: Array<{
    question_text: string;
    answer: string;
    caseStudyQuestion: number;
  }>;
}
@Component({
  selector: 'benji-case-study',
  templateUrl: './case-study.component.html',
  styleUrls: ['./case-study.component.scss'],
})
export class CaseStudyComponent implements OnInit, OnChanges {
  constructor(private pastSessionService: PastSessionsService) {}

  @Input() data: ActivityReport;
  casestudy: ActivityReport['casestudy'];
  groups: Array<CaseStudyGroup> = [];
  questions: Array<{ id: number; question_text: string }> = [];
  ngOnInit() {
    this.update();
    this.pastSessionService.filteredInUsers$.subscribe((updatedUserFilter) => {
      this.update();
    });
  }

  ngOnChanges() {
    this.update();
  }

  update() {
    this.casestudy = this.data.casestudy;
    this.questions = this.casestudy.casestudyquestion_set;

    this.getGroupAndTheirAnswers();
  }

  getGroupAndTheirAnswers() {
    this.groups = [];
    for (let g = 0; g < this.data.casestudy.groups.length; g++) {
      const group = this.data.casestudy.groups[g];
      const filteredInUsers = this.pastSessionService.filteredInUsers;
      // all the people in group should be in filteredInUsers
      let allPeoplePresent = true;
      for (let u = 0; u < group.participants.length; u++) {
        const participantCode = group.participants[u];
        if (filteredInUsers.find((fiu) => fiu === participantCode)) {
          // user present
        } else {
          allPeoplePresent = false;
        }
      }
      if (allPeoplePresent) {
        const usersNnotes = group.participants.map((u) => {
          const caseStudyUser = this.data.casestudy.casestudyparticipant_set.find(
            (x) => u === x.participant.participant_code
          );

          return {
            user: this.pastSessionService.getParticipantName(u),
            answers: caseStudyUser.casestudyanswer_set,
          };
        });
        const names = usersNnotes.map((u) => u.user).join(', ');
        let answers = [];
        for (let i = 0; i < usersNnotes.length; i++) {
          const el = usersNnotes[i];
          answers = [...answers, ...el.answers];
        }

        for (let i = 0; i < answers.length; i++) {
          const el = answers[i];
          const question = this.data.casestudy.casestudyquestion_set.find(
            (q) => q.id === el.casestudyquestion
          );
          answers[i].question_text = question.question_text;
        }
        this.groups.push({
          participants: names,
          notes: answers as CaseStudyGroup['notes'],
        });
      } else {
      }
    }
  }

  getGroupAnswer(group, qid) {
    let notes = false;
    for (let i = 0; i < group.notes.length; i++) {
      const el = group.notes[i];
      if (el.casestudyquestion === qid) {
        notes = true;
        return el.answer;
      }
    }
    if (!notes) {
      return '-';
    }
  }
}
