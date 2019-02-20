import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class ContextService {
  user: any;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Selected User
   */
  selected$ = new BehaviorSubject<any>(null);

  set selected(user: any) {
    this.selected$.next(user);
  }
  get selected(): any {
    return this.selected$.getValue();
  }
}
