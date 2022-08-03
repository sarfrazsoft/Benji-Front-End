import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { TeamUser, User } from 'src/app/services/backend/schema';
import { Course, Lesson, PaginatedResponse } from 'src/app/services/backend/schema/course_details';
import { UtilsService } from 'src/app/services/utils.service';
import { Url } from 'url';

@Injectable()
export class AdminService {
  constructor(
    private http: HttpClient, 
    private contextService: ContextService,
    private utilsService: UtilsService,
    private httpClient: HttpClient,
    ) {}

  getUser(): Observable<TeamUser> {
    return this.http.get(global.apiRoot + '/tenants/users/who_am_i/').pipe(
      map((res: TeamUser) => {
        this.contextService.user = res;
        if(res.branding) {
          this.contextService.brandingInfo = res.branding;
        }
        return res;
      })
    );
  }

  getLessons(): Observable<Lesson[]> {
    return this.http.get(global.apiRoot + '/course_details/lesson/').pipe(
      map((res: PaginatedResponse<Lesson>) => {
        this.contextService.lessons = res.results;
        return res.results;
      })
    );
  }

  getLessonRuns(): Observable<Lesson[]> {
    const page = 1;
    let filterParams = '';
    const filter = 'hosted';
    if (filter === 'hosted') {
      filterParams = '&hosted=True';
      filterParams = filterParams + '&participated=True';
    }
    return this.http.get(global.apiRoot + '/course_details/lesson_run/?page=' + page + filterParams).pipe(
      map((res: PaginatedResponse<Lesson>) => {
        return res.results;
      })
    );
  }

  getLessonDetails(id: number): Observable<any> {
    return this.http.get(global.apiRoot + '/course_details/lesson/' + id + '/').pipe(
      map((res) => {
        return res;
      })
    );
  }

  deleteLesson(lessonId: number): Observable<any> {
    return this.http
      .delete(global.apiRoot + `/course_details/lesson/${lessonId}/`, { observe: 'response' })
      .pipe(
        map((res) => {
          if (res.status === 204) {
            return { success: true };
          } else {
            return { success: false };
          }
        })
      );
  }
  duplicateLesson(lessonId: number): Observable<any> {
    return this.http
      .post(global.apiRoot + `/course_details/lesson/${lessonId}/duplicate/`, { observe: 'response' })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  createNewBoard(res) {
    const data = {
      lesson_name: res.title,
      lesson_description: res.description,
      activities: [
        {
          activity_type: 'BrainstormActivity',
          instructions: 'Dummy Instructions',
          max_participant_submissions: 999,
          submission_seconds: 30000,
          voting_seconds: 12000,
          meeting_mode: false,
          boards: [
            {
              name: 'test1',
              remove: false,
              previous_board: null,
              next_board: null,
              categorized: false,
              board_activity: {
                categorized: false,
                instructions: '',
                sub_instructions: '',
              },
            },
          ],
        },
      ],
    };
    return this.http.post(global.apiRoot + `/course_details/lesson/asyn_session/`, data).pipe(
      map((res) => {
        return res;
      })
    );
  }

  updateLesson(lesson: Lesson, id): Observable<any[]> {
    return this.http.patch<any[]>(global.apiRoot + `/course_details/lesson/${id}/`, lesson);
  }

  addLessonRunImage(lessonrunCode: number, lessonImage: Blob, lessonImageName: string, imageUrl: string) {
    const url = global.apiRoot + '/course_details/lesson_run/' + lessonrunCode + '/upload_image/';
    const formData: FormData = new FormData();
    if (lessonImage) {
      formData.append('img', lessonImage, lessonImageName);
    }
    if (imageUrl) {
      formData.append('image_url', imageUrl );
    }
    const headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    const params = new HttpParams();
    this.httpClient
      .post(url, formData, { params, headers })
      .map((res: any) => {
        return res;
      })
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => console.log(error)
      );
  }

  updateLessonRunImage(lessonrunCode: number, lessonImage: Blob, lessonImageName: string, imageUrl: string, imageId: number) {
    const url = global.apiRoot + '/course_details/lesson_run/' + lessonrunCode + '/upload_image/?image_id=' + imageId;
    const formData: FormData = new FormData();
    if (lessonImage) {
      formData.append('img', lessonImage, lessonImageName);
    }
    if (imageUrl) {
      formData.append('image_url', imageUrl );
    }
    const headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    const params = new HttpParams();
    return this.httpClient
      .post(url, formData, { params, headers })
      .map((res: any) => {
        return res;
      })
  }

}
