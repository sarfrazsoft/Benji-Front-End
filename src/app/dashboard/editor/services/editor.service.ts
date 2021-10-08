import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { User } from 'src/app/services/backend/schema';
import { Lesson } from 'src/app/services/backend/schema/course_details';

@Injectable()
export class EditorService {
  constructor(private httpClient: HttpClient, private contextService: ContextService) {}

  saveEmptyLesson(lesson: Lesson): Observable<any[]> {
    return this.httpClient.post<any[]>(global.apiRoot + '/course_details/lesson/', lesson);
  }

  getActivites(): Observable<any[]> {
    return this.httpClient.get<any[]>(global.apiRoot + '/activityflow/schema/');
  }

  getLessonActivities(lesson: number) {
    return this.httpClient.get<any[]>(global.apiRoot + `/course_details/lesson/${lesson}/?editor=true`);
  }

  createYaml(lesson): Observable<any[]> {
    return this.httpClient.post<any[]>(global.apiRoot + '/activityflow/schema/to_yaml/', lesson);
  }

  updateLesson(lesson: Lesson, id): Observable<any[]> {
    return this.httpClient.patch<any[]>(global.apiRoot + `/course_details/lesson/${id}/`, lesson);
  }

  uploadFile(file: File, lessonId): Observable<any[]> {
    // return this.httpClient.post<any[]>(global.apiRoot + '/course_details/upload-document/', {
    //   file: file,
    //   lesson_id: lessonId,
    // });
    const formData: FormData = new FormData();
    formData.append('file', file);
    // const headers = new HttpHeaders();
    // headers.set('Content-Type', null);
    // headers.set('Accept', 'multipart/form-data');
    const params = new HttpParams();
    params.append('lesson_id', lessonId);
    // this.httpClient
    //                 .post(url, formData, { params, headers });
    return this.httpClient.post<any[]>(global.apiRoot + '/course_details/upload-document/', formData, {
      params,
      // headers,
    });
  }
}
