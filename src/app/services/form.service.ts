import { Injectable, } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() {
  }




  formInit(loginForm) {
    const EL = [];
    const form = new FormGroup({});
    const HTML = loginForm.nativeElement;
    const INPUT = HTML.getElementsByTagName('input');
    const SELECT = HTML.getElementsByTagName('select');
    const MATSELECT = HTML.getElementsByTagName('mat-select');
    const TEXTAREA = HTML.getElementsByTagName('textarea');
    const MATRADIOGROUP = HTML.getElementsByTagName('mat-radio-group');
    const MATCHECKBOX = HTML.getElementsByTagName('mat-checkbox');
    EL.push(...INPUT, ...SELECT, ...MATSELECT, ...TEXTAREA,
      ...MATRADIOGROUP, ...MATCHECKBOX);

    if (EL && EL.length > 0) {
      for (const iterator of EL) {
        iterator.addEventListener('change', (r) => {
          if (r.target.value.trim().length <= 0) {
            form.get(iterator.getAttribute('formcontrolname')).setValue('');
          }
        });
        // console.log(form.get(iterator.getAttribute('formcontrolname')));
        // const pattern = iterator.getAttribute('pattern');
        // const minLength = iterator.getAttribute('minLength');
        // const maxLength = iterator.getAttribute('maxLength');
        // const required = iterator.getAttribute('required');
        form.addControl(
          iterator.getAttribute('formcontrolname'),
          new FormControl('')
        );
      }
    }
    return form;
  }

}
