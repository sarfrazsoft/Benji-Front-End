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
    // console.log(this.data.casestudy);
    // this.groups = Groups;
    this.casestudy = this.data.casestudy;
    this.questions = this.casestudy.casestudyquestion_set;

    // this.groups = this.data.casestudy.groups;
    const tempGroups = [];
    for (let g = 0; g < this.data.casestudy.groups.length; g++) {
      const group = this.data.casestudy.groups[g];
      const filteredInUsers = this.pastSessionService.filteredInUsers;
      let pushed = false;
      for (let u = 0; u < group.participants.length; u++) {
        const participantCode = group.participants[u];
        if (filteredInUsers.find((fiu) => fiu === participantCode) && !pushed) {
          tempGroups.push(group);
          pushed = true;
        }
      }
    }
    this.groups = tempGroups;
    console.log(this.groups);

    this.getGroupAndTheirAnswers();
  }

  getGroupAndTheirAnswers() {}

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
export const z = `{"doc":{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Hello, Tiptap!"}]},{"type":"table","content":[{"type":"tableRow","content":[{"type":"tableHeader","attrs":{"colspan":1,"rowspan":1,"colwidth":null},"content":[{"type":"paragraph","content":[{"type":"text","text":"asdf"}]}]},{"type":"tableHeader","attrs":{"colspan":1,"rowspan":1,"colwidth":null},"content":[{"type":"paragraph","content":[{"type":"text","text":"gh"}]}]},{"type":"tableHeader","attrs":{"colspan":1,"rowspan":1,"colwidth":null},"content":[{"type":"paragraph"}]}]},{"type":"tableRow","content":[{"type":"tableCell","attrs":{"colspan":1,"rowspan":1,"colwidth":null,"backgroundColor":null},"content":[{"type":"paragraph"}]},{"type":"tableCell","attrs":{"colspan":1,"rowspan":1,"colwidth":null,"backgroundColor":null},"content":[{"type":"paragraph","content":[{"type":"text","text":"b"}]}]},{"type":"tableCell","attrs":{"colspan":1,"rowspan":1,"colwidth":null,"backgroundColor":null},"content":[{"type":"paragraph","content":[{"type":"text","text":"hh"}]}]}]},{"type":"tableRow","content":[{"type":"tableCell","attrs":{"colspan":1,"rowspan":1,"colwidth":null,"backgroundColor":null},"content":[{"type":"paragraph"}]},{"type":"tableCell","attrs":{"colspan":1,"rowspan":1,"colwidth":null,"backgroundColor":null},"content":[{"type":"paragraph"}]},{"type":"tableCell","attrs":{"colspan":1,"rowspan":1,"colwidth":null,"backgroundColor":null},"content":[{"type":"paragraph","content":[{"type":"text","text":"n"}]}]}]}]}]}}`;
const Groups = [
  {
    answer: JSON.parse(z),
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
