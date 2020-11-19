import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
