import { Component, OnChanges, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'lodash';
import { debounceTime } from 'rxjs/operators';
import { AuthService, ContextService } from 'src/app/services';
import { Branding, TeamUser, User } from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { AccountService } from './services';
@Component({
  selector: 'benji-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  focusFn: boolean;
  focusLn: boolean;
  focusEm: boolean;
  form: FormGroup;
  isSubmitted = false;
  accontInfo: TeamUser;
  brandingInfo: Branding;
  imagesList: FileList;
  brandColor = '';
  logoSrc = null;
  favicSrc = null;
  formattedMessage: string;
  brandForm: FormGroup;
  selectedLogo: File;
  selectedFavicon: File;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private contextService: ContextService,
    private utilsService: UtilsService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    });

    this.brandForm = this.formBuilder.group({
      logo: new FormControl(''),
      favicon: new FormControl(''),
      color: new FormControl(''),
    });

    this.accontInfo = this.contextService.user;
    this.form.patchValue(this.accontInfo);

    if (this.contextService.brandingInfo) {
      this.brandingInfo = this.contextService.brandingInfo;
    }
    this.brandForm.patchValue(this.brandingInfo);

    if (this.brandingInfo) {
      this.brandColor = this.brandingInfo.color;
      this.logoSrc = this.brandingInfo.logo;
      this.favicSrc = this.brandingInfo.favicon;
    }

    this.onValueChanges();
  }

  get first_name(): AbstractControl {
    return this.form.get('first_name');
  }

  get last_name(): AbstractControl {
    return this.form.get('last_name');
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  get logo(): AbstractControl {
    return this.brandForm.get('logo');
  }

  get favicon(): AbstractControl {
    return this.brandForm.get('favicon');
  }

  get color(): AbstractControl {
    return this.brandForm.get('color');
  }

  onValueChanges(): void {
    this.form
      .get('first_name')
      .valueChanges.pipe(debounceTime(1500))
      .subscribe((val) => {
        this.onSubmit();
      });
    this.form
      .get('last_name')
      .valueChanges.pipe(debounceTime(1500))
      .subscribe((val) => {
        this.onSubmit();
      });
    this.form
      .get('email')
      .valueChanges.pipe(debounceTime(1500))
      .subscribe((val) => {
        this.onSubmit();
      });
    this.brandForm
      .get('logo')
      .valueChanges.pipe(debounceTime(1500))
      .subscribe((val) => {
        if (val && this.brandingInfo) {
          this.onUpdateBranding('logo');
        } else {
          this.onCreateBranding('logo');
          console.log(val);
        }
      });
    this.brandForm
      .get('favicon')
      .valueChanges.pipe(debounceTime(1500))
      .subscribe((val) => {
        if (val && this.brandingInfo) {
          this.onUpdateBranding('favicon');
        } else {
          this.onCreateBranding('favicon');
        }
      });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const val = this.form.value;
      merge(val, {
        id: this.accontInfo.id,
      });
      const saveUserObservable$ = this.accountService.saveUser(val);
      saveUserObservable$.subscribe(
        (res) => {
          console.log(res);
          this.isSubmitted = true;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onCreateBranding(type: string) {
    let val;
    if (type === 'logo') {
      this.utilsService
        .resizeImage({
          file: this.selectedLogo,
          maxSize: 152,
        })
        .then((resizedImage: Blob) => {
          val = { logo: resizedImage };
          this.accountService.createBranding(val, type).subscribe(
            (res: Branding) => {
              this.contextService.brandingInfo = res;
              this.brandingInfo = this.contextService.brandingInfo;
              localStorage.setItem('benji_branding', JSON.stringify(this.brandingInfo));
            },
            (err) => {
              console.log(err);
            }
          );
        })
        .catch(function (err) {
          console.error(err);
        });
    }
    if (type === 'favicon') {
      this.utilsService
        .resizeImage({
          file: this.selectedFavicon,
          maxSize: 16,
        })
        .then((resizedImage: Blob) => {
          val = { favicon: resizedImage };
          this.accountService.createBranding(val, type).subscribe(
            (res: Branding) => {
              this.contextService.brandingInfo = res;
              this.brandingInfo = this.contextService.brandingInfo;
              localStorage.setItem('benji_branding', JSON.stringify(this.brandingInfo));
            },
            (err) => {
              console.log(err);
            }
          );
        })
        .catch(function (err) {
          console.error(err);
        });
    }
    if (type === 'color') {
      val = { color: this.brandColor };
      this.accountService.createBranding(val, type).subscribe(
        (res: Branding) => {
          this.contextService.brandingInfo = res;
          this.brandingInfo = this.contextService.brandingInfo;
          localStorage.setItem('benji_branding', JSON.stringify(this.brandingInfo));
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onUpdateBranding(type: string) {
    if (this.brandForm.valid) {
      const val = this.brandForm.value;
      merge(val, {
        id: this.brandingInfo.id,
      });
      type === 'logo' ? (val.logo = this.selectedLogo) : delete val.logo;
      type === 'favicon' ? (val.favicon = this.selectedFavicon) : delete val.favicon;
      type === 'color' ? (val.color = this.brandColor) : delete val.color;
      this.accountService.updateBranding(val, type);
    }
  }

  passwordPage(): void {
    this.router.navigate(['/dashboard/account/password']);
  }

  onFileSelect(event, type) {
    const fileList: FileList = event.target.files;
    if (fileList.length === 0) {
      this.imagesList = null;
    } else {
      this.imagesList = fileList;
      const file = fileList[0];
      type === 'logo' ? (this.selectedLogo = file) : (this.selectedFavicon = file);
      const reader = new FileReader();
      // set the logoSrc for preview thumbnail
      reader.onload = (e) => {
        if (type === 'logo') {
          this.logoSrc = this.domSanitizer.bypassSecurityTrustUrl(reader.result.toString());
        } else {
          this.favicSrc = this.domSanitizer.bypassSecurityTrustUrl(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(type: string) {
    if (type === 'logo') {
      this.logoSrc = null;
      this.selectedLogo = null;
      this.onUpdateBranding('logo');
    } else if (type === 'favicon') {
      this.favicSrc = null;
      this.selectedFavicon = null;
      this.onUpdateBranding('favicon');
    }
  }

  onColorChange(color: string) {
    this.brandColor = color;
    if (this.brandingInfo) {
      this.onUpdateBranding('color');
    } else if (!this.brandingInfo) {
      this.onCreateBranding('color');
    }
  }

}
