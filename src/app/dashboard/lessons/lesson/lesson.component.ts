import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Editor } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
// import Table from '@tiptap/extension-table';
// import TableCell from '@tiptap/extension-table-cell';
// import TableHeader from '@tiptap/extension-table-header';
// import TableRow from '@tiptap/extension-table-row';
import StarterKit from '@tiptap/starter-kit';
import { ContextService } from 'src/app/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { AdminService } from '../../admin-panel/services';

@Component({
  selector: 'benji-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit {
  lessonDetails;
  editor = new Editor({
    extensions: [
      StarterKit,
      Placeholder,
      // Table.configure({
      //   resizable: true,
      // }),
      // TableRow,
      // TableHeader,
      // Default TableCell
      // TableCell,
      // Custom TableCell with backgroundColor attribute
      // CustomTableCell,
    ],
    editorProps: {
      attributes: {
        class: 'p-2 border-black focus:border-blue-700 border-2 rounded-md outline-none',
      },
    },
  });

  value = '<p>Hello, Tiptap!</p>';
  constructor(
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    // check if lesson is not available
    if (!this.contextService.lesson) {
      this.activatedRoute.paramMap.subscribe((paramMap) => {
        const lId = paramMap.get('lessonId');
        const id = parseInt(lId, 10);

        this.adminService.getLessonDetails(id).subscribe((res: Lesson) => {
          if (res.lesson_details) {
            this.contextService.lesson = res;
            this.lessonDetails = res.lesson_details;
          }
        });
      });
    } else {
      // lesson detail is available
      this.contextService.lesson$.subscribe((lesson) => {
        this.lessonDetails = lesson.lesson_details;
      });
    }
  }
  addTable() {
    // this.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }
  showdoc() {
    this.editor.getJSON();
    console.log(JSON.stringify(this.editor.getJSON()));
  }
}

const courseDetails = {
  name: 'Pitch Perfect',
  description: 'Participants learn to deliver a persuasive pitch.',
  videos: [
    {
      title: 'How to handle an objection',
      description: 'some description of video',
      link: 'https://player.vimeo.com/external/340456701.hd.mp4?s=86908a6f830304253f76b6bbd6f6b07fc8f5f6e6&profile_id=174',
    },
    {
      title: 'How to handle an objection',
      description: 'some description of video',
      link: 'https://player.vimeo.com/external/340456701.hd.mp4?s=86908a6f830304253f76b6bbd6f6b07fc8f5f6e6&profile_id=174',
    },
  ],
  resources: [
    {
      title: 'Document on How to handle an objection',
      description: 'some description of document',
      link: 'path/to/download/pdf',
    },
    {
      title: 'Document on How to handle an objection',
      description: 'some description of document',
      link: 'path/to/download/pdf',
    },
  ],
  mcqs: [
    {
      text: 'Select any option',
      correctExplanation: 'You know thats the wrong answer',
      choices: [
        { text: 'option 1', isCorrect: true, id: 1 },
        { text: 'option 1', isCorrect: false, id: 2 },
        { text: 'option 1', isCorrect: false, id: 3 },
        { text: 'option 1', isCorrect: false, id: 4 },
      ],
    },
    {
      text: 'Select any option',
      correctExplanation: 'You know what to do',
      choices: [
        { text: 'option 1', isCorrect: true, id: 1 },
        { text: 'option 1', isCorrect: false, id: 2 },
        { text: 'option 1', isCorrect: false, id: 3 },
        { text: 'option 1', isCorrect: false, id: 4 },
      ],
    },
  ],
};

// const CustomTableCell = TableCell.extend({
//   addAttributes() {
//     return {
//       // extend the existing attributes …
//       ...this.parent?.(),
//       // and add a new one …
//       backgroundColor: {
//         default: null,
//         parseHTML: (element) => {
//           return {
//             backgroundColor: element.getAttribute('data-background-color'),
//           };
//         },
//         renderHTML: (attributes) => {
//           return {
//             'data-background-color': attributes.backgroundColor,
//             style: `background-color: ${attributes.backgroundColor}`,
//           };
//         },
//       },
//     };
//   },
// });
