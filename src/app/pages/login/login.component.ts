import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'benji-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.form = this.builder.group({
      email: '',
      password: ''
    });
  }

  onSubmit() {
    if (this.form.valid) {
    }
  }
}
