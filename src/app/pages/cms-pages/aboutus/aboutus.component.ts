import { ApiService } from './../../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { warranty } from '../../../metainfo';
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent implements OnInit {
  panelOpenState = false;
  warrantymetainfo = warranty;
  constructor(
    private meta: Meta,
    private api: ApiService
  ) {
    this.updatemetaInfo(this.warrantymetainfo);
  }

  ngOnInit(): void {
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.api.setpAgetitle(metainfo.title);
  }
}
