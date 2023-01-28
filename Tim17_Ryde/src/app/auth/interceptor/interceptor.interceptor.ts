import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken: any = localStorage.getItem('user');
    const decodedItem = JSON.parse(accessToken);
    if (req.headers.get('skip')) {
    console.log(decodedItem);
    return next.handle(req);
    }

    if (accessToken) {
      console.log(decodedItem);
      const cloned = req.clone({
        setHeaders: { Authorization: "Bearer " + decodedItem},
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
