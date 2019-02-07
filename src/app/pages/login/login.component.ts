import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'benji-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  selectedTab = 0;

  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.form = this.builder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: ''
    });
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  showSignupTab(): void {
    this.selectedTab = 1;
  }

  onSubmit(): void {
    if (this.form.valid) {
    }
  }
}
