import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { AuthService, BackendRestService, ContextService } from 'src/app/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { EditorService } from './editor.service';

@Injectable()
export class EditorResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private authService: AuthService,
    private backendRestService: BackendRestService,
    private contextService: ContextService,
    private editorService: EditorService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    try {
      const lesson: Lesson = {
        lesson_name: 'untitled lesson',
        lesson_description: 'untitled lesson description',
      };
      const res = await this.editorService.saveEmptyLesson(lesson).toPromise();

      return { lesson: res };
    } catch (err) {
      console.log(err);
    }
  }
}
