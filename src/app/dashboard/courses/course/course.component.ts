import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'benji-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  data = courseDetails;
  videoURL =
    'https://player.vimeo.com/external/' +
    '298880631.hd.mp4?s=69e47bc8bbb2f9bfcbbc919fab096e326ede516a&profile_id=175';
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const cId = paramMap.get('courseId');

      this.activatedRoute.data.forEach((data: any) => {
        const course = data.dashData.courses.filter(
          c => c.course_id === cId
        )[0];

        console.log(course);
        // this.courses = data.dashData.courses;
      });
    });
  }
}

const courseDetails = {
  name: 'Pitch Perfect',
  description: 'some description',
  facilitator: {
    description: 'Rayan Nahas',
    img: 'path/to/image'
  },
  videos: [
    {
      title: 'How to handle an objection',
      description: 'some description of video',
      link: 'https://player.vimeo.com/external/myvideo.mp4'
    },
    {
      title: 'How to handle an objection',
      description: 'some description of video',
      link: 'https://player.vimeo.com/external/myvideo.mp4'
    }
  ],
  resources: [
    {
      title: 'Document on How to handle an objection',
      description: 'some description of document',
      link: 'path/to/download/pdf'
    },
    {
      title: 'Document on How to handle an objection',
      description: 'some description of document',
      link: 'path/to/download/pdf'
    }
  ],
  mcqs: [
    {
      text: 'Select any option',
      correctExplanation: 'You know thats the wrong answer',
      choices: [
        { text: 'option 1', isCorrect: true, id: 1 },
        { text: 'option 1', isCorrect: false, id: 2 },
        { text: 'option 1', isCorrect: false, id: 3 },
        { text: 'option 1', isCorrect: false, id: 4 }
      ]
    },
    {
      text: 'Select any option',
      correctExplanation: 'You know what to do',
      choices: [
        { text: 'option 1', isCorrect: true, id: 1 },
        { text: 'option 1', isCorrect: false, id: 2 },
        { text: 'option 1', isCorrect: false, id: 3 },
        { text: 'option 1', isCorrect: false, id: 4 }
      ]
    }
  ]
};
