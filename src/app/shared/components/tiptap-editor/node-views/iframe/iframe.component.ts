import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AngularNodeViewComponent } from 'ngx-tiptap';
import { IdeaDocument } from 'src/app/services/backend/schema';
import { FileProgress } from '../../../uploadcare-widget/uploadcare-widget.component';

@Component({
  selector: 'benji-nodeview-iframe',
  templateUrl: './iframe.component.html',
})
export class NodeviewIframeComponent extends AngularNodeViewComponent implements OnInit {
  userAddedUrl;
  iframeHTML;
  constructor(private httpClient: HttpClient) {
    super();
  }
  ngOnInit() {
    console.log(this.node.attrs['lessonRunCode']);
  }

  increment(): void {
    this.updateAttributes({
      count: this.node.attrs['count'] + 1,
    });
  }

  userChangedUrl(val: string) {
    console.log(val);
    this.checkIfLink(val);
    // this.fileProgress = fileProgress;
    // this.mediaUploading = true;
  }

  checkIfLink(link: string) {
    // if (this.isItemSelected()) {
    //   // Don't run if an item is already attached to the post
    //   return;
    // }
    // link can be
    // https://something.com
    // abc https://something.com
    // https://www.canadianstage.com/
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    const link2 = link.match(urlRegex);
    if (link2) {
      // send to iframely
      this.httpClient
        .get(`https://cdn.iframe.ly/api/iframely/?api_key=a8a6ac85153a6cb7d321bc&url=${link2[0]}`)
        .subscribe((res: any) => {
          if (res.html) {
            console.log(res.html);
            this.iframeHTML = res.html;
            // if (this.uploadPanelExpanded) {
            //   this.uploadPanelExpanded = false;
            // }
            // this.iframeAvailable = true;
            // this.iframeRemoved = false;
            // this.iframeData = { iframeHTML: res.html, url: res.url };
            // this.meta = { ...this.meta, iframe: this.iframeData };
            // iframely.load();
          }
        });
    }
  }
}
