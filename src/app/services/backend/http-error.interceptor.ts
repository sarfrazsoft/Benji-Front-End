import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // remove this if in your application, this is just for testing purposes of this plnkr
    if (request.url === './error-and-bypass-interceptor.json') {
      return next.handle(request);
    }
    console.log('Intercepting Request:', request);

    return next.handle(request).catch((err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', err.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${err.status}, body was: ${
            err.error[Object.keys(err.error)[0]]
          }`
        );
      }

      // ...optionally return a default fallback value so app can continue (pick one)
      // which could be a default value
      // return Observable.of(
      //   new HttpResponse({
      //     body: [
      //       { name: 'Default values returned by Interceptor', id: 88 },
      //       { name: 'Default values returned by Interceptor(2)', id: 89 }
      //     ]
      //   })
      // );

      return Observable.throw(err);

      // or simply an empty observable
      // return Observable.empty<HttpEvent<any>>();
    });
  }
}
