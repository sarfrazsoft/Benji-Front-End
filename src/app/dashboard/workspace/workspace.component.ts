import { Component, OnInit } from '@angular/core';
import { BackendRestService} from '../../services';
import {Lesson, PaginatedResponse} from '../../services/backend/schema/course_details';

@Component({
  selector: 'benji-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  lessonPage = 0;
  lessonResponse: PaginatedResponse<Lesson>;
  lessonsUpdating: boolean; // use this variable to display a loading screen

  constructor(private backendRestService: BackendRestService) { }

  updateLessons() {
    this.lessonsUpdating = true;
    this.backendRestService.get_lessons(this.lessonPage).subscribe((response) => {
      console.log(response);
      this.lessonResponse = response;
      this.lessonsUpdating = false;
    });
  }

  ngOnInit() {
    this.updateLessons();
  }

}
