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
      const id = parseInt(lId, 10);

      this.activatedRoute.data.forEach((data) => {
        const lesson = data.dashData.lessons.filter((c) => c.id === id)[0];

        this.lessonDetails = courseDetails;
        // this.lessonDetails = lesson.lesson_details;
      });
    });
  }
}

const courseDetails = {
  name: 'Pitch Perfect',
  description: 'Participants learn to deliver a persuasive pitch.',
  videos: [
    {
      title: 'How to handle an objection',
      description: 'some description of video',
      link:
        'https://player.vimeo.com/external/340456701.hd.mp4?s=86908a6f830304253f76b6bbd6f6b07fc8f5f6e6&profile_id=174',
    },
    {
      title: 'How to handle an objection',
      description: 'some description of video',
      link:
        'https://player.vimeo.com/external/340456701.hd.mp4?s=86908a6f830304253f76b6bbd6f6b07fc8f5f6e6&profile_id=174',
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
