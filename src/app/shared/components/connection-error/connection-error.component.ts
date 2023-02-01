import { Component, Input } from "@angular/core";

@Component({
  selector: 'benji-connection-error',
  templateUrl: './connection-error.component.html',
})
export class ConnectionErrorComponent {
  @Input() title;
  @Input() subTitle;

  reloadCurrentPage() {
    window.location.reload();
  }
}
