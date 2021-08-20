import { ChangeDetectionStrategy, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  SelectControlValueAccessor,
  Validators,
} from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { debounceTime, take } from 'rxjs/operators';

@Component({
  selector: 'benji-formly-field-select',
  templateUrl: './question-type-select.type.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionTypeSelectComponent extends FieldType implements OnInit {
  defaultOptions = {
    templateOptions: {
      options: [],
      compareWith(o1: any, o2: any) {
        return o1 === o2;
      },
    },
  };

  scaleRangeDropdown = [];

  // workaround for https://github.com/angular/angular/issues/10010
  @ViewChild(SelectControlValueAccessor, { static: true }) set selectAccessor(s: any) {
    if (!s) {
      return;
    }

    const writeValue = s.writeValue.bind(s);
    if (s._getOptionId(s.value) === null) {
      writeValue(s.value);
    }

    s.writeValue = (value: any) => {
      const id = s._idCounter;
      writeValue(value);
      if (value === null) {
        this.ngZone.onStable
          .asObservable()
          .pipe(take(1))
          .subscribe(() => {
            if (
              id !== s._idCounter &&
              s._getOptionId(value) === null &&
              s._elementRef.nativeElement.selectedIndex !== -1
            ) {
              writeValue(value);
            }
          });
      }
    };
  }

  // scale form
  scaleForm: FormGroup;
  scaleLabels = ['Low-value label', 'Mid-value label', 'High-value laabel'];

  // mcq form
  mcqForm: FormGroup;

  constructor(private ngZone: NgZone, private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.to['compareWith'] = (o1: any, o2: any) => {
      return o1 === o2;
    };

    // Code for scale type questions
    for (let i = 1; i <= 100; i++) {
      this.scaleRangeDropdown.push(i);
    }

    this.scaleForm = this.formBuilder.group({
      question_type: new FormControl('scale'),
      scale_json: this.formBuilder.group({
        from: new FormControl(0),
        to: new FormControl(100),
        labels: this.formBuilder.array([new FormControl(''), new FormControl(''), new FormControl('')]),
      }),
    });

    this.scaleForm.valueChanges.pipe(debounceTime(500)).subscribe((val) => {
      const control = this.form.get('question_json');
      control.setValue(val);
    });

    if (this.model.question_type === 'scale') {
      if (this.model.question_json) {
        this.scaleForm.patchValue(this.model.question_json);
      }
    }

    // Code for mcq
    this.mcqForm = this.formBuilder.group({
      required: new FormControl(false),
      multiSelect: new FormControl(false),
      mcqchoices: this.formBuilder.array([
        this.formBuilder.group({
          order: new FormControl(1),
          choice_text: new FormControl(''),
          is_correct: new FormControl(true),
          explanation: new FormControl('Test A'),
        }),
      ]),
    });

    this.mcqForm.valueChanges.pipe(debounceTime(500)).subscribe((val) => {
      const control = this.form.get('question_json');
      control.setValue(val);
    });

    if (this.model.question_type === 'multiple_choice') {
      if (this.model.question_json) {
        const json = this.model.question_json;
        this.mcqForm.patchValue(this.model.question_json);
        if (json.mcqchoices.length > 1) {
          for (let i = 1; i < json.mcqchoices.length; i++) {
            const element = json.mcqchoices[i];
            const choices = this.mcqForm.get('mcqchoices') as FormArray;
            choices.push(
              this.formBuilder.group({
                order: new FormControl(element.order),
                choice_text: new FormControl(element.choice_text),
                is_correct: new FormControl(element.is_correct),
                explanation: new FormControl(element.explanation),
              })
            );
          }
        }
      }
    }
  }

  get labelsFormArray(): FormArray {
    const formGroup = this.scaleForm.get('scale_json') as FormGroup;
    return formGroup.get('labels') as FormArray;
  }

  get choicesFormArray(): FormArray {
    const choices = this.mcqForm.get('mcqchoices') as FormArray;
    return choices;
  }

  addMCQchoice() {
    const choices = this.mcqForm.get('mcqchoices') as FormArray;
    const choicesLength = choices.length;
    choices.push(
      this.formBuilder.group({
        order: new FormControl(choicesLength + 1),
        choice_text: new FormControl(''),
        is_correct: new FormControl(true),
        explanation: new FormControl('Test A'),
      })
    );
  }

  removeMcqChoice(choiceIndex: number) {
    const choices = this.mcqForm.get('mcqchoices') as FormArray;
    choices.removeAt(choiceIndex);
  }
}
