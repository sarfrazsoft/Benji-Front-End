import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'benji-snack-bar-component',
  templateUrl: './snack-bar.component.html',
})
export class SnackBarComponent implements OnInit {
  constructor(
    public snackBarRef: MatSnackBarRef<SnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public content: any
  ) {}

  ngOnInit() {}
}
