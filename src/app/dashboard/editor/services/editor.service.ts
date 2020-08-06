import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { User } from 'src/app/services/backend/schema';

@Injectable()
export class EditorService {
  constructor(
    private http: HttpClient,
    private contextService: ContextService
  ) {}

  getActivites(): Observable<any[]> {
    return this.http
      .get<any[]>(global.apiRoot + '/course_details/course/?page=1')
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }
}
