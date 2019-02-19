import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivateAccountComponent, EntryComponent } from 'src/app/pages';

const routes: Routes = [
  {
    path: '',
    loadChildren: 'src/app/layout/layout.module#LayoutModule'
  },
  {
    path: 'login',
    component: EntryComponent
  },
  {
    path: 'activate/:confirmationCode',
    component: ActivateAccountComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
