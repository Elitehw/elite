import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { partnerslogin } from '../../metainfo';

@Component({
  selector: 'app-partnerlogin',
  templateUrl: './partnerlogin.component.html',
  styleUrls: ['./partnerlogin.component.scss']
})
export class PartnerloginComponent implements OnInit {

  constructor(
    private api: ApiService,
    private meta: Meta
  ) {
    this.updatemetaInfo(partnerslogin);
  }

  ngOnInit(): void {
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.api.setpAgetitle(metainfo.title);
  }
}
