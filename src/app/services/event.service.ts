import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private storage: StorageService
  ) { }

  private Loading = new BehaviorSubject(true);
  isLoading = this.Loading.asObservable();
  private headerMenuTrigger = new BehaviorSubject(undefined);
  headerMenuTriggered = this.headerMenuTrigger.asObservable();
  private Login = new BehaviorSubject(this.storage.isAuthenticate());
  isLogin = this.Login.asObservable();
  public cartnumberemmit = new BehaviorSubject(true);
  getcartNumber = this.cartnumberemmit.asObservable();

  private headerClass = new BehaviorSubject(undefined);
  getheaderClass = this.headerClass.asObservable();

  public cartEdit = new BehaviorSubject(undefined);
  getcarteditValue = this.cartEdit.asObservable();

  isHttpRequest = new Subject<boolean>();

  setLoginEmmit(isLogin: boolean) {
    return this.Login.next(isLogin);
  }
  setLoaderEmmit(isLoading: boolean) {
    return this.Loading.next(isLoading);
  }
  setHeaderEmmit(isLoading: any) {
    return this.headerMenuTrigger.next(isLoading);
  }
  setClassName(name: any) {
    return this.headerClass.next(name);
  }
}
