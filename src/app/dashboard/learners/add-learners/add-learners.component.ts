import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
// import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LearnerService } from '../services';

@Component({
  selector: 'benji-add-learners',
  templateUrl: './add-learners.component.html',
  styleUrls: ['./add-learners.component.scss']
})
export class AddLearnersComponent implements OnInit {
  form: FormGroup;
  emailErr = false;
  emailErrMsg = '';
  invitationsSent = false;
  userId: number;
  orgId: number;
  // serverString;

  // loadAPI: Promise<any>;

  constructor(
    private builder: FormBuilder,
    private learnerService: LearnerService,
    private route: ActivatedRoute
  ) {
    this.route.data.forEach((data: any) => {
      this.userId = data.dashData.user.id;
      this.orgId = data.dashData.user.organization;
    });
  }

  ngOnInit() {
    this.form = this.builder.group({
      emails: new FormControl('', [Validators.required])
    });
  }

  get emails(): AbstractControl {
    return this.form.get('emails');
  }

  emailChanged() {
    this.emailErr = false;
    this.emailErrMsg = '';
  }

  onSubmit(): void {
    if (this.form.valid) {
      const emails = this.form.value.emails.split(',');
      const json = [];
      emails.forEach(email => {
        json.push({
          email: email.trim(),
          organization: this.orgId,
          inviter: this.userId
        });
      });
      this.learnerService.addLearners(json).subscribe(
        res => {
          this.form.reset();
          this.invitationsSent = true;
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  importCSV() {}

  public changeListener(files: FileList) {
    console.log(files);
    if (files && files.length > 0) {
      const file: File = files.item(0);
      console.log(file.name);
      console.log(file.size);
      console.log(file.type);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = e => {
        const csv: string = reader.result as string;
        console.log(csv);
      };
    }
  }

  // getSeverString() {
  //   this.loadAPI = new Promise(resolve => {
  //     this.loadScript();
  //     resolve(true);
  //   });
  //   const dangerousHTML = `<!DOCTYPE html
  //   <html>
  //     <head>
  //       <meta charset='UTF-8'>
  //       <title>title</title>
  //     </head>
  //     <body>
  //       <div onclick="javascript:ddd();" class="server-class">mahin</div>
  //       i like ass
  //     </body>
  //   </html>
  //   <script>
  //         function ddd(){
  //             alert('hello ');
  //         };
  //         </script>`;

  //   // this.serverString = this.sanitizer.bypassSecurityTrustUrl(dangerousHTML);
  //   // this.serverString = this.sanitizer.bypassSecurityTrustScript(dangerousHTML);
  //   this.serverString = this.sanitizer.bypassSecurityTrustHtml(dangerousHTML);
  // }

  // public loadScript() {
  //   let isFound = false;
  //   const scripts = document.getElementsByTagName('script');
  //   for (let i = 0; i < scripts.length; ++i) {
  //     if (
  //       scripts[i].getAttribute('src') != null &&
  //       scripts[i].getAttribute('src').includes('loader')
  //     ) {
  //       isFound = true;
  //     }
  //   }

  //   if (!isFound) {
  //     const dynamicScripts = [
  //       'https://widgets.skyscanner.net/widget-server/js/loader.js'
  //     ];

  //     for (let i = 0; i < dynamicScripts.length; i++) {
  //       const node = document.createElement('script');
  //       node.src = dynamicScripts[i];
  //       node.type = 'text/javascript';
  //       node.async = false;
  //       node.charset = 'utf-8';
  //       document.getElementsByTagName('head')[0].appendChild(node);
  //     }
  //   }
  // }
}
