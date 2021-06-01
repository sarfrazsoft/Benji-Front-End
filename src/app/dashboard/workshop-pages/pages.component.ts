import { Component, OnInit } from '@angular/core';
import { BackendRestService } from '../../services';
import { Lesson, PaginatedResponse } from '../../services/backend/schema/course_details';

@Component({
  selector: 'benji-pages',
  templateUrl: './pages.component.html',
})
export class PagesComponent implements OnInit {
  lessonPage = 0;
  lessonResponse: PaginatedResponse<Lesson>;
  lessonsUpdating: boolean; // use this variable to display a loading screen

  constructor(private backendRestService: BackendRestService) {}

  ngOnInit() {}
}
