import { Component, OnInit, ViewChild } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('signupForm', { static: true }) private signupForm: any;
  form: FormGroup;


  constructor(private forms: FormService) { }

  ngOnInit(): void {
    this.form = this.forms.formInit(this.signupForm);
  }

  // LOGIN SUBMIT BUTON
  signup(formData: any) {
    if (this.form.valid) {
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).markAsTouched({ onlySelf: true });
      });
    }
  }


  matchPassword(password: FormControl, confirmPassword: FormControl) {
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ noMatch: true });
    } else {
      confirmPassword.clearValidators();
      confirmPassword.updateValueAndValidity();
    }
  }

}
