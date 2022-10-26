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
export class FolderInfo {
  id?: number;
  title?: string;
  lessonId?: number;
  lessonsIds?: Array<number>;
  newFolder?: boolean;
}
export class MoveToFolderData {
  lessonId?: number;
  folders?: Array<Folder>;
  lessonFolders?: Array<number>;
}

@Injectable()
export class LessonGroupService {
  constructor(private http: HttpClient) {}

  getAllFolders(): Observable<any> {
    return this.http.get(global.apiRoot + `/course_details/lesson_group/`).pipe(
      map((res: PaginatedResponse<Folder>) => {
        return res.results.sort(function (a, b) {
          return a.creation_time.localeCompare(b.creation_time);
        });
      })
    );
  }

  createNewFolder(folder: FolderInfo): Observable<any> {
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

  updateFolder(folder: FolderInfo): Observable<any> {
    const data = {
      name: folder.title,
      lessons: folder?.lessonsIds,
    };
    return this.http.patch(global.apiRoot + `/course_details/lesson_group/${folder.id}/`, data).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getFolderDetails(folderId: number): Observable<any> {
    return this.http.get(global.apiRoot + `/course_details/lesson_group/${folderId}/`).pipe(
      map((res) => {
        return res;
      })
    );
  }

  deleteFolder(folderId: number): Observable<any> {
    return this.http.delete(global.apiRoot + `/course_details/lesson_group/${folderId}/`).pipe(
      map((res) => {
        return res;
      })
    );
  }

  bulkUpdateFolders(lessonId: number, foldersIds: Array<number>): Observable<any> {
    const data = {
      lesson: lessonId,
      groups: foldersIds,
    };
    return this.http.patch(global.apiRoot + `/course_details/lesson_group/bulk-update/`, data).pipe(
      map((res) => {
        return res;
      })
    );
  }

}
