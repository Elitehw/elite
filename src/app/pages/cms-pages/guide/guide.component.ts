import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { warantyGuide } from '../../../metainfo';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {

  constructor(
    private meta: Meta,
    private api: ApiService
  ) {
    this.updatemetaInfo(warantyGuide);
  }

  ngOnInit(): void {
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.api.setpAgetitle(metainfo.title);
  }
}
