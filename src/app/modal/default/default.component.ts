import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  modalData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalData = data;
    // console.log(modalData);
  }

  ngOnInit(): void {
  }

}
