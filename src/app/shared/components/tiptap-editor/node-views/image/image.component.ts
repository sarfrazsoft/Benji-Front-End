import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { AngularNodeViewComponent } from 'ngx-tiptap';
import { IdeaDocument } from 'src/app/services/backend/schema';
import { FileProgress } from '../../../uploadcare-widget/uploadcare-widget.component';

@Component({
  selector: 'benji-nodeview-image',
  templateUrl: './image.component.html',
})
export class NodeviewImageComponent extends AngularNodeViewComponent implements OnInit {
  image;

  ngOnInit() {}

  constructor(protected permissionsService: NgxPermissionsService) {
    super();
  }

  _noFileSelected(): void {
    this.deleteNode();
  }

  mediaUploadProgress(fileProgress: FileProgress) {}

  mediaUploaded(res: IdeaDocument) {
    if (res.document_type === 'video') {
      // if (res.document_url) {
      //   this.videoURL = res.document_url;
      //   this.videoURLConverted = res.document_url_converted;
      // } else if (res.document) {
      //   this.videoURL = res.document;
      // }
      // this.video = true;
      // this.video_id = res.id;
      // if (this.videoCleared) {
      //   this.removeIdeaDocumentFromBE();
      // }
      // this.videoCleared = false;
    } else if (res.document_type === 'image') {
      if (res.document_url) {
        this.editor.chain().focus().setImage({ src: res.document_url }).run();
      } else if (res.document) {
        this.editor.chain().focus().setImage({ src: res.document }).run();
      }
      this.image = true;
      this.deleteNode();
    } else if (res.document_type === 'document') {
    }
  }
}
