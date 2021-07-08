import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService, ContextService } from 'src/app/services';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

@Component({
  selector: 'benji-dashboard-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  isSignupClicked = false;
  isSubmitted = false;
  passwordMinLenErr = false;
  emailErr = false;
  emailErrMsg = '';
  firstName = '';
  lastName ='';

  logo;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private contextService: ContextService,
    private deviceService: DeviceDetectorService,
    public router: Router
  ) {}

  ngOnInit() {
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.logo = info.parameters.darkLogo;
      }
    });

    this.form = this.builder.group(
      {
        name: new FormControl('', [Validators.required]),
        //lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validator: this.checkIfMatchingPasswords('password', 'confirmPassword'),
      }
    );

    if (this.authService.userInvitation) {
      this.form.get('email').setValue(this.authService.userInvitation.email);
      if (this.authService.userInvitation.suggested_first_name) {
        this.form.get('name').setValue(this.authService.userInvitation.suggested_first_name + ' ' + this.authService.userInvitation.suggested_last_name);
        //this.form.get('lastName').setValue(this.authService.userInvitation.suggested_last_name);
      }
    }
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  get name(): AbstractControl {
    return this.form.get('name');
  }

  // get lastName(): AbstractControl {
  //   return this.form.get('lastName');
  // }

  get password(): AbstractControl {
    return this.form.get('password');
  }

  get confirmPassword(): AbstractControl {
    return this.form.get('confirmPassword');
  }

  emailChanged() {
    this.emailErr = false;
    this.emailErrMsg = '';
  }

  onSubmit(): void {
    this.isSignupClicked = true;
    if (this.form.valid) {
      const val = this.form.value;
      const myArr = (val.name).split(" ");
      this.firstName = myArr[0];
      myArr[1]? this.lastName = myArr[1]: this.lastName = " ";
      if (myArr[2]) {
        this.lastName += " " + myArr[2];
      }
      // console.log("First Name: " + this.firstName);
      // console.log("Last Name: " + this.lastName);
      this.authService.register(val.email.toLowerCase(), val.password, this.firstName, this.lastName).subscribe(
        (res) => {
          if (res.token) {
            this.isSubmitted = true;
            this.authService.signIn(val.email.toLowerCase(), val.password).subscribe(
              (signInRes) => {
                if (res.token) {
                  // if (this.authService.redirectURL.length) {
                  // window.location.href = this.authService.redirectURL;
                  // } else {
                  this.deviceService.isMobile()
                    ? this.router.navigate(['/participant/join'])
                    : this.router.navigate(['/dashboard']);
                  // }
                } else {
                }
              },
              (err) => {
                console.log(err);
              }
            );
            return;
          }

          if (res.password1) {
            this.passwordMinLenErr = true;
          }

          if (res.email) {
            this.emailErr = true;
            this.emailErrMsg = res.email[0];
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }
}
