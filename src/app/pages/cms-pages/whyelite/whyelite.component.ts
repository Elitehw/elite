import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { whyelite } from '../../../metainfo';

@Component({
  selector: 'app-whyelite',
  templateUrl: './whyelite.component.html',
  styleUrls: ['./whyelite.component.scss']
})
export class WhyeliteComponent implements OnInit {
  whyelitemetainfo = whyelite;
  constructor(
    private meta: Meta,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.updatemetaInfo();
  }
  updatemetaInfo() {
    this.meta.updateTag({ name: 'description', content: this.whyelitemetainfo.description });
    this.meta.updateTag({ name: 'title', content: this.whyelitemetainfo.title });
    this.api.setpAgetitle(this.whyelitemetainfo.title);
  }
}
