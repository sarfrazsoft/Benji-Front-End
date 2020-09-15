import { JsonSchemaFormService } from '@ajsf/core';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'benji-emoji-selector',
  templateUrl: './emoji-selector.component.html',
  styleUrls: ['./emoji-selector.component.scss'],
})
export class EmojiSelectorComponent implements OnInit {
  showemoji;
  selectedEmoji;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];

  constructor(private jsf: JsonSchemaFormService) {}

  public ngOnInit() {
    console.log(this.layoutNode, this.dataIndex);
    this.jsf.initializeControl(this);
  }

  getSelectedEmoji() {
    return this.selectedEmoji;
  }

  addEmoji($event) {
    this.selectedEmoji = 'emoji://' + $event.emoji.unified;
    this.jsf.updateValue(this, this.selectedEmoji);
    this.showemoji = false;
  }
  stop(event) {
    event.stopPropagation();
  }
}
