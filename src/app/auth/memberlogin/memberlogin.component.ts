import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { memberlogin } from '../../metainfo';

@Component({
  selector: 'app-memberlogin',
  templateUrl: './memberlogin.component.html',
  styleUrls: ['./memberlogin.component.scss']
})
export class MemberloginComponent implements OnInit {

  constructor(
    private api: ApiService,
    private meta: Meta
  ) {
    this.updatemetaInfo(memberlogin);
  }

  ngOnInit(): void {
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.api.setpAgetitle(metainfo.title);
  }
}
