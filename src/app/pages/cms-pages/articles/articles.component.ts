import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  status: boolean = false;
  clickEvent() {
    this.status = !this.status;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
