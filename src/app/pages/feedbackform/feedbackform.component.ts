import { Validatable } from '@amcharts/amcharts4/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedbackform',
  templateUrl: './feedbackform.component.html',
  styleUrls: ['./feedbackform.component.scss']
})
export class FeedbackformComponent implements OnInit {
  feedbackform: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.formInIt();
  }
  formInIt() {
    this.feedbackform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s._%+-]+@[a-z0-9\s.-]+\.[a-z\s]{2,66}\s*$/)]),
      feedback_type: new FormControl('', [Validators.required]),
      message: new FormControl('')
    });
  }
  restrictSpace(event) {
    if (event.target.value.match(/\s/g)) {
      event.target.value = event.target.value.replace(/\s/g, '');
    }
  }
  send() {
    if (this.feedbackform.valid) {

    } else {
      this.feedbackform.markAllAsTouched();
    }
  }
}
