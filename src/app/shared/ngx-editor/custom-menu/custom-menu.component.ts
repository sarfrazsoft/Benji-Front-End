import { Component, Input, OnInit } from '@angular/core';
import { setBlockType } from 'prosemirror-commands';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Editor } from 'ngx-editor';
import { isNodeActive } from 'ngx-editor/helpers';
import { Observable } from 'rxjs';
import * as global from 'src/app/globals';
import { UtilsService } from 'src/app/services/utils.service';
import nodeViews from 'src/app/shared/ngx-editor/nodeviews/index';
import plugins, { placeholderPlugin } from 'src/app/shared/ngx-editor/plugins';
import schema from 'src/app/shared/ngx-editor/schema';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.scss'],
})
export class CustomMenuComponent implements OnInit {
  constructor(private utilsService: UtilsService, private httpClient: HttpClient) {}

  @Input() editor: Editor;
  @Input() participant_code: string;
  @Input() lessonrun_code: string;

  isActive = false;
  isDisabled = false;

  imagesList: FileList;

  onClick(e: MouseEvent): void {
    e.preventDefault();
    const { state, dispatch } = this.editor.view;
    this.execute(state, dispatch);
  }

  execute(state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
    const { schema } = state;

    if (this.isActive) {
      return setBlockType(schema.nodes.paragraph)(state, dispatch);
    }

    return setBlockType(schema.nodes.code_block)(state, dispatch);
  }

  update = (view: EditorView) => {
    const { state } = view;
    const { schema } = state;
    this.isActive = isNodeActive(state, schema.nodes.code_block);
    this.isDisabled = !this.execute(state, null); // returns true if executable
  }

  ngOnInit(): void {
    const plugin = new Plugin({
      key: new PluginKey(`custom-menu-codemirror`),
      view: () => {
        return {
          update: this.update,
        };
      },
    });

    this.editor.registerPlugin(plugin);
  }
  //
  //
  // image selection code
  onFileSelect(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length === 0) {
      this.imagesList = null;
    } else {
      this.imagesList = fileList;
      const participant_code = this.participant_code;
      this.imageSelected(this.imagesList[0], this.lessonrun_code, participant_code);
    }
  }

  imageSelected(file: File, lessonrun_code: string, participant_code: string) {
    if (this.editor.view.state.selection.$from.parent.inlineContent && file) {
      this.startImageUpload(this.editor.view, file, lessonrun_code, participant_code);
    }
    this.editor.view.focus();
  }

  startImageUpload(view: EditorView, file: File, lessonrun_code: string, participant_code: string) {
    // A fresh object to act as the ID for this upload
    const id = {};

    // Replace the selection with a placeholder
    const tr = view.state.tr;
    if (!tr.selection.empty) {
      tr.deleteSelection();
    }
    tr.setMeta(placeholderPlugin, { add: { id, pos: tr.selection.from } });
    view.dispatch(tr);

    // resize the image
    this.utilsService
      .resizeImage({
        file: file,
        maxSize: 500,
      })
      .then((resizedImage: Blob) => {
        this.uploadFile(resizedImage, file, lessonrun_code, participant_code).subscribe(
          (url) => {
            url = url.img;
            const hostname = window.location.protocol + '//' + window.location.hostname;
            url = hostname + url;
            const pos = this.findPlaceholder(view.state, id);
            // If the content around the placeholder has been deleted, drop
            // the image
            if (pos == null) {
              return;
            }
            // Otherwise, insert it at the placeholder's position, and remove
            // the placeholder
            view.dispatch(
              view.state.tr
                .replaceWith(pos, pos, schema.nodes.image.create({ src: url }))
                .setMeta(placeholderPlugin, { remove: { id } })
            );
          },
          () => {
            // On failure, just clean up the placeholder
            view.dispatch(tr.setMeta(placeholderPlugin, { remove: { id } }));
          }
        );
      });
  }

  // returns observable for image upload
  uploadFile(resizedImage, file, lessonrun_code, participant_code): Observable<any> {
    const code = lessonrun_code;
    const url = global.apiRoot + '/course_details/lesson_run/' + code + '/upload_image/';

    const formData: FormData = new FormData();
    formData.append('img', resizedImage, file.name);
    formData.append('participant_code', participant_code);
    const headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    const params = new HttpParams();
    return this.httpClient.post(url, formData, { params, headers });
  }

  findPlaceholder(state, id) {
    const decos = placeholderPlugin.getState(state);
    const found = decos.find(null, null, (spec) => spec.id === id);
    return found.length ? found[0].from : null;
  }
}
