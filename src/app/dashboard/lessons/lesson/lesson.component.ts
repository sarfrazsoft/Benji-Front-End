import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'benji-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit {
  lessonDetails;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const lId = paramMap.get('lessonId');

      this.activatedRoute.data.forEach((data: any) => {
        const lesson = data.dashData.lessons.filter((c) => c.lesson_id === lId)[0];

        this.lessonDetails = lesson.lesson_details;
      });
    });
  }
}

// const courseDetails = {
//   name: 'Pitch Perfect',
//   description: 'some description',
//   facilitator: {
//     description: 'Rayan Nahas',
//     img: 'path/to/image',
//   },
//   videos: [
//     {
//       title: 'How to handle an objection',
//       description: 'some description of video',
//       link: 'https://player.vimeo.com/external/myvideo.mp4',
//     },
//     {
//       title: 'How to handle an objection',
//       description: 'some description of video',
//       link: 'https://player.vimeo.com/external/myvideo.mp4',
//     },
//   ],
//   resources: [
//     {
//       title: 'Document on How to handle an objection',
//       description: 'some description of document',
//       link: 'path/to/download/pdf',
//     },
//     {
//       title: 'Document on How to handle an objection',
//       description: 'some description of document',
//       link: 'path/to/download/pdf',
//     },
//   ],
//   mcqs: [
//     {
//       text: 'Select any option',
//       correctExplanation: 'You know thats the wrong answer',
//       choices: [
//         { text: 'option 1', isCorrect: true, id: 1 },
//         { text: 'option 1', isCorrect: false, id: 2 },
//         { text: 'option 1', isCorrect: false, id: 3 },
//         { text: 'option 1', isCorrect: false, id: 4 },
//       ],
//     },
//     {
//       text: 'Select any option',
//       correctExplanation: 'You know what to do',
//       choices: [
//         { text: 'option 1', isCorrect: true, id: 1 },
//         { text: 'option 1', isCorrect: false, id: 2 },
//         { text: 'option 1', isCorrect: false, id: 3 },
//         { text: 'option 1', isCorrect: false, id: 4 },
//       ],
//     },
//   ],
// };
