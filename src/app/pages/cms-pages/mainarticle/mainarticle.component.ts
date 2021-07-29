import { ApiService } from './../../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { homeownerhub } from '../../../metainfo';
@Component({
  selector: 'app-mainarticle',
  templateUrl: './mainarticle.component.html',
  styleUrls: ['./mainarticle.component.scss']
})
export class MainarticleComponent implements OnInit {

  status = false;
  homeownerhubmetainfo = homeownerhub;
  clickEvent() {
    this.status = !this.status;
  }
  constructor(
    private meta: Meta,
    private api: ApiService
  ) {
    this.updatemetaInfo(this.homeownerhubmetainfo);
  }

  ngOnInit(): void {
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.api.setpAgetitle(metainfo.title);
  }
}
