import { Injectable, Optional } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, Observer, throwError } from 'rxjs';
import { catchError, map, exhaust } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { EventService } from './event.service';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL: string;
  httpOptions: { headers: HttpHeaders; };
  TOKEN: string;
  ROLE: string;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private event: EventService,
    private router: Router,
    private title: Title
  ) {
    this.API_URL = environment.BASE_API_ENDPOINT;
    this.TOKEN = this.storage.getDataField('token');
    this.ROLE = this.storage.getDataField('role');

    this.router.events.subscribe((res: any) => {
      if (res instanceof NavigationEnd || res instanceof NavigationStart) {
        this.TOKEN = this.storage.getDataField('token');
        this.ROLE = this.storage.getDataField('role');
      }
    });
    this.event.isLogin.subscribe((res: boolean) => {
      this.TOKEN = this.storage.getDataField('token');
      this.ROLE = this.storage.getDataField('role');
    });
    if (this.TOKEN !== undefined) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'multipart/form-data',
          'x-access-token': this.TOKEN
        })
      };
    } else {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'multipart/form-data',
        })
      };
    }
  }



  private formatErrors(error: any) {
    return throwError(error.error);
  }


  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${this.API_URL}${path}`, { headers: this.httpOptions.headers, params })
      .pipe(catchError(this.formatErrors));
  }

  post(path: any, body: object = {}): Observable<any> {
    return this.http.post(`${this.API_URL}${path}`, body, this.httpOptions).pipe(catchError(this.formatErrors));
  }
  postx(path: any, body: object = {}): Observable<any> {
    return this.http.post(`http://8d22dc75e599.ngrok.io/${path}`, body, this.httpOptions).pipe(catchError(this.formatErrors));
  }


  put(path: any, body: object = {}) {
    return this.http.put(`${this.API_URL}${path}`, body, this.httpOptions).pipe(map((r: any) => {
      if (alert) {
        this.alert(r.message ? r.message : 'Success', 'success');
      }
    })).pipe(catchError(this.formatErrors));
  }


  delete(path: string, alert: boolean = false, params: HttpParams = new HttpParams()) {
    return this.http.delete(`${this.API_URL}${path}`, { headers: this.httpOptions.headers, params }).pipe(map((r: any) => {
      if (alert) {
        this.alert(r.message ? r.message : 'Success', 'success');
      }
    })).pipe(catchError(this.formatErrors));
  }
  upload(path: any, body: FormData) {
    return this.http.put(`${this.API_URL}${path}`, body, this.httpOptions).pipe(map((r: any) => {
      if (alert) {
        this.alert(r.message ? r.message : 'Success', 'success');
      }
    })).pipe(catchError(this.formatErrors));
  }

  postMultiData(path: string, file: FormData): Observable<any> {
    const httpOptionsimg = {
      headers: new HttpHeaders({
        Accept: 'multipart/form-data'
      })
    };
    return this.http.post(`${this.API_URL}${path}`, file, httpOptionsimg).pipe(catchError(this.formatErrors));
  }
  postMultiDatawithoutApiurl(path: string, file: FormData): Observable<any> {
    const httpOptionsimg = {
      headers: new HttpHeaders({
        Accept: 'multipart/form-data'
      })
    };
    return this.http.post(`${path}`, file, httpOptionsimg).pipe(catchError(this.formatErrors));
  }


  alert(message: string, type: any) {
    return Swal.fire({
      title: message,
      icon: type,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
    });
  }


  getIpAddress(): any {
    return this.http
      .get('https://jsonip.com')
      .pipe(
        catchError(this.handleError)
      );
  }
  // https://api.ipify.org/?format=json
  getGEOLocation(ip) {
    // Update your api key to get from https://ipgeolocation.io
    const url = 'https://extreme-ip-lookup.com/json/';
    return this.http
      .get(url)
      .pipe(
        catchError(this.formatErrors)
      );
  }
  isExist(val) {
    if (_.isNull(val) || _.isEmpty(val) || _.isEmpty(val)) {
      return false;
    } else {
      return true;
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }


  setpAgetitle(title) {
    this.title.setTitle(title);
  }

}
