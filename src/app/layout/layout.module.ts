import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent, LayoutComponents } from './';
import { LayoutRoutes } from './layout.routing';

@NgModule({
  imports: [CommonModule, LayoutRoutes],
  exports: [RouterModule, LayoutComponent],
  declarations: [...LayoutComponents]
})
export class LayoutModule {}
