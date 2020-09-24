import { RouterModule, Routes } from '@angular/router';
import { AdminResolver } from '../admin-panel';
import { EditorComponent } from './index';
import { EditorResolver } from './services/editor.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: {
      dashData: AdminResolver,
    },
    children: [
      {
        path: '',
        component: EditorComponent,
        resolve: {
          editorData: EditorResolver,
        },
      },
      {
        path: ':lessonId',
        component: EditorComponent,
      },
    ],
  },
];

export const EditorRoutes = RouterModule.forChild(routes);
