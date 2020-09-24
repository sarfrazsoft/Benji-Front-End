import { Component, Input, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'benji-emoji-selector',
  templateUrl: './emoji-selector.component.html',
  styleUrls: ['./emoji-selector.component.scss'],
})
export class EmojiSelectorComponent extends FieldType implements OnInit {
  showemoji;
  selectedEmoji;

  public ngOnInit() {
    if (this.formControl.value) {
      this.selectedEmoji = this.formControl.value;
    }
  }

  getSelectedEmoji() {
    return this.selectedEmoji;
  }

  addEmoji($event) {
    this.selectedEmoji = 'emoji://' + $event.emoji.unified;
    this.formControl.setValue(this.selectedEmoji);
    this.showemoji = false;
  }
  stop(event) {
    event.stopPropagation();
  }
}
