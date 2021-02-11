import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import * as global from 'src/app/globals';
import { UtilsService } from 'src/app/services/utils.service';
import nodeViews from 'src/app/shared/ngx-editor/nodeviews/index';
import plugins, { placeholderPlugin } from 'src/app/shared/ngx-editor/plugins';
import { getUserName } from 'src/app/shared/ngx-editor/plugins';
import schema from 'src/app/shared/ngx-editor/schema';
import { yCursorPlugin as OrginalYCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

@Component({
  selector: 'benji-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements OnInit, OnDestroy {
  @Input() documentId;
  editor: Editor;
  editor2: Editor;
  colors = [
    { color: '#ffffff', backgroudColor: '#e6194b' },
    { color: '#ffffff', backgroudColor: '#3cb44b' },
    { color: '#000000', backgroudColor: '#ffe119' },
    { color: '#ffffff', backgroudColor: '#4363d8' },
    { color: '#ffffff', backgroudColor: '#f58231' },
    { color: '#ffffff', backgroudColor: '#911eb4' },
    { color: '#000000', backgroudColor: '#46f0f0' },
    { color: '#ffffff', backgroudColor: '#f032e6' },
    { color: '#000000', backgroudColor: '#bcf60c' },
    { color: '#000000', backgroudColor: '#fabebe' },
    { color: '#ffffff', backgroudColor: '#469990' },
    { color: '#000000', backgroudColor: '#008080' },
    { color: '#000000', backgroudColor: '#e6beff' },
    { color: '#ffffff', backgroudColor: '#9a6324' },
    { color: '#000000', backgroudColor: '#fffac8' },
    { color: '#ffffff', backgroudColor: '#800000' },
    { color: '#000000', backgroudColor: '#aaffc3' },
    { color: '#ffffff', backgroudColor: '#808000' },
    { color: '#000000', backgroudColor: '#ffd8b1' },
    { color: '#ffffff', backgroudColor: '#000075' },
    { color: '#000000', backgroudColor: '#808080' },
    { color: '#000000', backgroudColor: '#ffffff' },
    { color: '#ffffff', backgroudColor: '#000000' },
    { color: '#ffffff', backgroudColor: '#a9a9a9' },
  ];
  toolbar: Toolbar = [
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['bold', 'italic'],
    ['underline'],
    // ['underline', 'strike'],
    // ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    // ['link', 'image'],
    ['text_color', 'background_color'],
    // ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  constructor(private utilsService: UtilsService, private httpClient: HttpClient) {}

  ngOnInit(): void {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:1234', 'prosemirror-demo1', ydoc);
    const type = ydoc.getXmlFragment('prosemirror');

    const ydoc2 = new Y.Doc();
    const provider2 = new WebsocketProvider('ws://localhost:1234', this.documentId, ydoc2);
    const type2 = ydoc2.getXmlFragment('prosemirror2');

    //
    //
    // Remote cursor user's name
    //
    //
    //
    const awareness = provider.awareness;
    // get participant information here
    const userName = getUserName();

    const colorIndex = this.randomIntFromInterval(0, 19);
    awareness.setLocalStateField('user', {
      // Define a print name that should be displayed
      name: userName ? userName : 'Panda',
      // Define a color that should be associated to the user:
      color: this.colors[colorIndex].color, // should be a hex color
      backgroudColor: this.colors[colorIndex].backgroudColor, // should be a hex color
      // typing: false,
    });

    this.editor = new Editor({
      schema,
      plugins: [ySyncPlugin(type), ...plugins],
      nodeViews,
    });
    // this.editor2 = new Editor({
    //   schema,
    //   plugins: [ySyncPlugin(type2), ...plugins],
    //   nodeViews,
    // });

    // document.querySelector("#image-upload").addEventListener("change", e => {
    //   if (this.editor.view.state.selection.$from.parent.inlineContent && e.target.files.length) {
    //     startImageUpload(view, e.target.files[0])
    //   }
    //   view.focus()
    // })
  }

  imageSelected(imageList, lessonrun_code, participant_code) {
    if (this.editor.view.state.selection.$from.parent.inlineContent && imageList.length) {
      this.startImageUpload(this.editor.view, imageList[0], lessonrun_code, participant_code);
    }
    this.editor.view.focus();
  }

  // startImageUpload(view, img) {
  //   console.log('bawa ji im here');
  // }

  startImageUpload(view, file, lessonrun_code, participant_code) {
    // A fresh object to act as the ID for this upload
    const id = {};

    // Replace the selection with a placeholder
    const tr = view.state.tr;
    if (!tr.selection.empty) {
      tr.deleteSelection();
    }
    tr.setMeta(placeholderPlugin, { add: { id, pos: tr.selection.from } });
    view.dispatch(tr);

    this.uploadFile(file, lessonrun_code, participant_code).then(
      (url) => {
        console.log(url);
        url.subscribe((val) => {
          console.log(val);
        });
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
  }

  // This is just a dummy that loads the file and creates a data URL.
  // You could swap it out with a function that does an actual upload
  // and returns a regular URL for the uploaded file.
  uploadFile(file, lessonrun_code, participant_code): any {
    const code = lessonrun_code;
    const url = global.apiRoot + '/course_details/lesson_run/' + code + '/upload_image/';
    const reader = new FileReader();
    return new Promise((accept, fail) => {
      //   reader.onload = () => accept(reader.result);
      //   reader.onerror = () => fail(reader.error);
      // Some extra delay to make the asynchronicity visible
      // const file: File = fileList[0];
      return this.utilsService
        .resizeImage({
          file: file,
          maxSize: 500,
        })
        .then((resizedImage: Blob) => {
          const formData: FormData = new FormData();
          formData.append('img', resizedImage, file.name);
          formData.append('participant_code', participant_code);
          const headers = new HttpHeaders();
          headers.set('Content-Type', null);
          headers.set('Accept', 'multipart/form-data');
          const params = new HttpParams();
          return (
            this.httpClient
              .post(url, formData, { params, headers })
              // .map((res: any) => {
              //   console.log(res);
              //   // this.imagesList = null;
              //   // this.sendMessage.emit(
              //   //   new BrainstormSubmitEvent(this.userIdeaText, this.selectedCategory.id, res.id)
              //   // );
              //   // this.userIdeaText = '';
              //   return res.img;
              // })
              .subscribe(
                (data) => {
                  console.log(data);
                  return data;
                },
                (error) => console.log(error)
              )
          );
        })
        .catch(function (err) {
          console.error(err);
        });
      // setTimeout(() => reader.readAsDataURL(file), 1500);
    });
  }

  // findPlaceholder(state, id) {
  //   const decos = placeholderPlugin.getState(state);
  //   const found = decos.find(null, null, (spec) => spec.id === id);
  //   return found.length ? found[0].from : null;
  // }

  ngOnDestroy(): void {
    this.editor2.destroy();
    this.editor.destroy();
  }

  randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  findPlaceholder(state, id) {
    const decos = placeholderPlugin.getState(state);
    const found = decos.find(null, null, (spec) => spec.id === id);
    return found.length ? found[0].from : null;
  }
}
