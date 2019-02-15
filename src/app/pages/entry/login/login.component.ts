import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  isLoginClicked = false;
  @Output() showSignupTab = new EventEmitter();

  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.form = this.builder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: ''
    });
  }

  showSignup(): void {
    this.showSignupTab.emit();
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  onSubmit(): void {
    this.isLoginClicked = true;
    if (this.form.valid) {
    }
  }
}
