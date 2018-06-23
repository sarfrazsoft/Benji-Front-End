import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as global from '../globals';

@Injectable()
export class BackendService {
  constructor(private http: HttpClient) { }
}
