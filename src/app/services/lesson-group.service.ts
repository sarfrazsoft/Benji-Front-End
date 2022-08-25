import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as global from 'src/app/globals';
import { map } from 'rxjs/operators';
import { PaginatedResponse } from './backend/schema/course_details';
import { Observable } from 'rxjs';

export class Folder {
  id: number;
  name: string;
  lesson: Array<number>;
  created_by: number;
  creation_time: string;
}

@Injectable()
export class LessonGroupService {
  constructor(private http: HttpClient) {}

  getAllFolders(): Observable<any>  {
    return this.http.get(global.apiRoot + `/course_details/lesson_group/`).pipe(
      map((res: PaginatedResponse<Folder>) => {
        return res.results;
      })
    );
  }

  createNewFolder(folder): Observable<any> {
    const data = {
      name: folder.title,
      lessons: [folder?.lessonId],
    };
    return this.http.post(global.apiRoot + `/course_details/lesson_group/`, data).pipe(
      map((res) => {
        return res;
      })
    );
  }

  updateFolder(folder): Observable<any> {
    console.log(folder.lessons);
    const data = {
      name: folder.title,
      lessons: folder?.lessons,
      // lessons: [644, 670, 633],
    };
    return this.http.patch(global.apiRoot + `/course_details/lesson_group/${folder.id}/`, data).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getFolderDetails(folderId): Observable<any> {
    return this.http.get(global.apiRoot + `/course_details/lesson_group/${folderId}/`).pipe(
      map((res) => {
        return res;
      })
    );
  }

  deleteFolder(folderId): Observable<any> {
    return this.http.delete(global.apiRoot + `/course_details/lesson_group/${folderId}/`).pipe(
      map((res) => {
        return res;
      })
    );
  }

}
