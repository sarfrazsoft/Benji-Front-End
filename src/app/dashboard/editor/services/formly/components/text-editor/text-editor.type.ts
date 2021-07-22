import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { Editor } from 'ngx-editor';
import { TextEditorComponent } from 'src/app/shared/components/text-editor/text-editor.component';
import nodeViews from 'src/app/shared/ngx-editor/nodeviews/index';
import plugins, { placeholderPlugin } from 'src/app/shared/ngx-editor/plugins';
import { setAwareness } from 'src/app/shared/ngx-editor/plugins/cursor-plugin/cursor-plugin';
import { yCursorPlugin } from 'src/app/shared/ngx-editor/plugins/cursor-plugin/cursor-plugin';
import schema from 'src/app/shared/ngx-editor/schema';

@Component({
  selector: 'benji-formly-text-editor',
  templateUrl: './text-editor.type.html',
})
export class EditorTypeComponent extends FieldType implements OnInit {
  timeInSeconds = 0;
  mins = 0;
  secs = 0;
  // jsonDoc = JSON.parse(
  //   `{"doc":{"type":"doc","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"user b decided to add some long text and some headingsuser b decided to add some long text and some headingsuser b decided to add some long text and some headingsuser b decided to add some long text and some headingsuser b decided to add some long text and some headings"}]},{"type":"paragraph","attrs":{"align":null}},{"type":"ordered_list","attrs":{"order":1},"content":[{"type":"list_item","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"yolo"}]}]},{"type":"list_item","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"profit?"}]}]}]},{"type":"heading","attrs":{"level":2,"align":null},"content":[{"type":"text","text":"dddddd"}]},{"type":"heading","attrs":{"level":1,"align":null},"content":[{"type":"text","text":"me long text a"}]},{"type":"paragraph","attrs":{"align":null}}]},"selection":{"type":"all"}}`
  // ).doc;
  editor: Editor;
  @ViewChild('editorEntry', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;
  constructor(private cfr: ComponentFactoryResolver) {
    super();
  }

  // minEntered($event) {
  //   this.calculateTime();
  // }

  // secEntered($event) {
  //   this.calculateTime();
  // }

  // calculateTime() {
  //   const mins = this.mins;
  //   const convertedSeconds = mins * 60;
  //   const seconds = this.secs;
  //   const totalSeconds = convertedSeconds + seconds;
  //   this.formControl.setValue(totalSeconds);
  // }

  ngOnInit() {
    const teCF = this.cfr.resolveComponentFactory(TextEditorComponent);
    const component = this.entry.createComponent(teCF);
    if (this.formControl.value) {
      // console.log(JSON.parse(this.formControl.value));
      component.instance.html = JSON.parse(this.formControl.value);
      // const totalSeconds = this.formControl.value;
      // this.mins = Math.floor(totalSeconds / 60);
      // this.secs = totalSeconds % 60;
    } else {
    }

    // component.instance.html = this.jsonDoc;
    component.instance.editorUpdated.subscribe((jsonDoc) => {
      // console.log(jsonDoc);
      this.formControl.setValue(JSON.stringify(jsonDoc));
    });
  }
}
