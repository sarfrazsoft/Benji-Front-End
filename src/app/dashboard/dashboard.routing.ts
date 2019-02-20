import { RouterModule, Routes } from '@angular/router';
import {
  AdminPanelComponent,
  CoursesResolver,
  LearnersComponent,
  UserResolver
} from './index';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    resolve: {
      userData: UserResolver,
      courses: CoursesResolver
    }
  },
  {
    path: 'learners',
    component: LearnersComponent
  }
];

export const DashboardRoutes = RouterModule.forChild(routes);
