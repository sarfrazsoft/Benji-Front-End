import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PastSessionsService } from 'src/app/services';
import { ActivityReport } from 'src/app/services/backend/schema';
import { Group } from 'src/app/services/backend/schema';

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
})
export class CaseStudyComponent implements OnInit, OnChanges {
  constructor(private pastSessionService: PastSessionsService) {}

  @Input() data: ActivityReport;
  casestudy: ActivityReport['casestudy'];
  // groups: Array<CaseStudyGroup> = [];
  questions: Array<{ id: number; question_text: string }> = [];
  groups: Array<Group> = [];
  caseStudyTitle = '';
  ngOnInit() {
    this.caseStudyTitle = this.data.casestudy.activity_title;
    this.update();
    this.pastSessionService.filteredInUsers$.subscribe((updatedUserFilter) => {
      this.update();
    });
  }

  ngOnChanges() {
    this.update();
  }

  update() {
    console.log(this.data.casestudy);
    // this.groups = this.data.casestudy.groups;
    this.groups = Groups;
    this.casestudy = this.data.casestudy;
    this.questions = this.casestudy.casestudyquestion_set;

    this.getGroupAndTheirAnswers();
  }

  getGroupAndTheirAnswers() {
    // this.groups = [];
    // for (let g = 0; g < this.data.casestudy.groups.length; g++) {
    //   const group = this.data.casestudy.groups[g];
    //   const filteredInUsers = this.pastSessionService.filteredInUsers;
    //   // all the people in group should be in filteredInUsers
    //   let allPeoplePresent = true;
    //   for (let u = 0; u < group.participants.length; u++) {
    //     const participantCode = group.participants[u];
    //     if (filteredInUsers.find((fiu) => fiu === participantCode)) {
    //       // user present
    //     } else {
    //       allPeoplePresent = false;
    //     }
    //   }
    //   if (allPeoplePresent) {
    //     const usersNnotes = group.participants.map((u) => {
    //       const caseStudyUser = this.data.casestudy.casestudyparticipant_set.find(
    //         (x) => u === x.participant.participant_code
    //       );
    //       return {
    //         user: this.pastSessionService.getParticipantName(u),
    //         answers: caseStudyUser.casestudyanswer_set,
    //       };
    //     });
    //     const names = usersNnotes.map((u) => u.user).join(', ');
    //     let answers = [];
    //     for (let i = 0; i < usersNnotes.length; i++) {
    //       const el = usersNnotes[i];
    //       answers = [...answers, ...el.answers];
    //     }
    //     for (let i = 0; i < answers.length; i++) {
    //       const el = answers[i];
    //       const question = this.data.casestudy.casestudyquestion_set.find(
    //         (q) => q.id === el.casestudyquestion
    //       );
    //       answers[i].question_text = question.question_text;
    //     }
    //     this.groups.push({
    //       participants: names,
    //       notes: answers as CaseStudyGroup['notes'],
    //     });
    //   } else {
    //   }
    // }
  }

  getGroupWorksheet(group: Group) {
    const doc = JSON.parse(group.answer);
    if (doc && doc.doc) {
      return doc.doc;
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
export const x = `{"doc":{"type":"doc","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"user A created this worksheet "}]},{"type":"paragraph","attrs":{"align":null},"content":[{"type":"image","attrs":{"src":"http://localhost/media/881d457a9fd275b352fd495d6e75464d_dSYaYIu.jpg","alt":null,"title":null,"width":null}}]}]},"selection":{"type":"all"}}`;
export const y = `{"doc":{"type":"doc","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"user b decided to add some long text and some headingsuser b decided to add some long text and some headingsuser b decided to add some long text and some headingsuser b decided to add some long text and some headingsuser b decided to add some long text and some headings"}]},{"type":"paragraph","attrs":{"align":null}},{"type":"ordered_list","attrs":{"order":1},"content":[{"type":"list_item","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"yolo"}]}]},{"type":"list_item","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"profit?"}]}]}]},{"type":"heading","attrs":{"level":2,"align":null},"content":[{"type":"text","text":"dddddd"}]},{"type":"heading","attrs":{"level":1,"align":null},"content":[{"type":"text","text":"me long text a"}]},{"type":"paragraph","attrs":{"align":null}}]},"selection":{"type":"all"}}`;
const Groups = [
  {
    answer: JSON.parse(x),
    description: null,
    id: 187,
    participants: [249678],
    title: 'a',
  },
  {
    answer: JSON.parse(y),
    description: null,
    id: 186,
    participants: [823402],
    title: 'b',
  },
];
