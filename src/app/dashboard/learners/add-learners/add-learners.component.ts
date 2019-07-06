import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { LearnerService } from '../services';

@Component({
  selector: 'benji-add-learners',
  templateUrl: './add-learners.component.html',
  styleUrls: ['./add-learners.component.scss']
})
export class AddLearnersComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  emailErr = false;
  emailErrMsg = '';

  constructor(
    private builder: FormBuilder,
    private learnerService: LearnerService
  ) {}

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
    // this.isSignupClicked = true;
    if (this.form.valid) {
      console.log(this.form.value);
      const val = this.form.value;
      this.learnerService.addLearners(val.emails).subscribe(
        res => {},
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
