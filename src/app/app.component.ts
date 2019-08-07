import { Component } from '@angular/core';
import { ContextService } from './services/context.service';
import { LayoutService } from './services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(
    private layoutService: LayoutService,
    private contextService: ContextService
  ) {
    layoutService.getPartnerInfo();
  }
}
