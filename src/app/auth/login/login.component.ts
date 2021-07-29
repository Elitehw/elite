import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginModel, AuthModel } from 'src/app/global';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormService } from 'src/app/services/form.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  form: FormGroup;
  dummyLogin: LoginModel = {
    email: 'demo@demo.com',
    password: '123456'
  };

  @ViewChild('loginForm', { static: true }) private loginForm: any;

  constructor(
    private api: ApiService,
    private event: EventService,
    private storage: StorageService,
    private forms: FormService
  ) {


  }

  ngOnInit(): void {
    this.form = this.forms.formInit(this.loginForm);
  }

  // LOGIN SUBMIT BUTON
  loginInit(data: LoginModel) {
    if (this.form.valid) {
      // this.form.controls.email.updateValueAndValidity
      // '=================================================================';
      if (JSON.stringify(data) === JSON.stringify(this.dummyLogin)) {
        const authData: AuthModel = new AuthModel({
          token: 'USER TOKEN',
          username: 'DEMO USER',
          role: 'user'
        });

        this.storage.setUser(authData);
        this.api.alert('You have successfully login', 'success');
        this.event.setLoginEmmit(true);
      } else {
        this.api.alert('Some thing went wrong', 'error');
      }
      // '=================================================================';

    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).markAsTouched({ onlySelf: true });
      });
    }
  }
}
