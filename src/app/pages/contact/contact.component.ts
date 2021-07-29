import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Meta } from '@angular/platform-browser';
import { contact } from '../../metainfo';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  constructor(
    private api: ApiService,
    private meta: Meta
  ) {
    this.updatemetaInfo(contact);
  }

  ngOnInit(): void {
    this.formInIt();
  }
  formInIt() {
    this.contactForm = new FormGroup({
      fullname: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s\.]+ [a-zA-Z\s\.]{1,}\s*$/)]),
      department: new FormControl('', [Validators.required]),
      mobilenumber: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s._%+-]+@[a-z0-9\s.-]+\.[a-z\s]{2,66}\s*$/)]),
      message: new FormControl(''),
    });
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.api.setpAgetitle(metainfo.title);
  }
  replaceMorethenoneSpace(event, type) {
    if (event.target.value.match(/\s/g)) {
      event.target.value = event.target.value.replace(/ {1,}/g, ' ');
    }
    if (event.target.value.match(/\./g)) {
      event.target.value = event.target.value.replace(/\./g, '');
    }
    if (type === 'Uname') {
      this.contactForm.controls.fullname.setValue(event.target.value.split('.')[0]);
    }
  }
  removelastspace(event, type) {
    if (type === 'Uname') {
      this.contactForm.controls.fullname.setValue(event.target.value.trim());
    }
  }
  restrictSpace(event) {
    if (event.target.value.match(/\s/g)) {
      event.target.value = event.target.value.replace(/\s/g, '');
    }
  }
}
