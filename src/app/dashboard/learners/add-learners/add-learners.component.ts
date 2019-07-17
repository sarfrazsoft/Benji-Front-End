import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
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
}
