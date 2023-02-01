import { Component, Input } from "@angular/core";

@Component({
  selector: 'benji-loading-screen',
  templateUrl: './loading-screen.component.html',
})
export class LoadingScreenComponent {
  @Input() title;
  @Input() subTitle;
}