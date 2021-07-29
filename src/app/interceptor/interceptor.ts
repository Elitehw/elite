// loader.interceptors.ts
import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventService } from '../services/event.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private event: EventService) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.event.isHttpRequest.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);
    // console.log('No of requests--->' + this.requests.length);
    this.event.isHttpRequest.next(true);
    // tslint:disable-next-line: deprecation
    return new Observable(observer => {
      const subscription = next.handle(req)
        .subscribe(
          event => {
            if (event instanceof HttpResponse) {
              setTimeout(() => {
                this.removeRequest(req);
              }, 1000);
              observer.next(event);
            }
          },
          err => {
            setTimeout(() => {
              this.removeRequest(req);
            }, 1000);
            observer.error(err);
          },
          () => {
            setTimeout(() => {
              this.removeRequest(req);
            }, 1000);
            observer.complete();
          });
      // remove request from queue when cancelled
      return () => {
        setTimeout(() => {
          this.removeRequest(req);
        }, 1000);
        subscription.unsubscribe();
      };
    });
  }
}
