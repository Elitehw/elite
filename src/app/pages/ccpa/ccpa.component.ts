import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { ccpanotice } from '../../metainfo';
import { Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-ccpa',
  templateUrl: './ccpa.component.html',
  styleUrls: ['./ccpa.component.scss']
})
export class CCPAComponent implements OnInit {
  formType: string;
  ccpanoticemetainfo = ccpanotice;
  constructor(
    private event: EventService,
    private router: Router,
    private meta: Meta,
    private api: ApiService
  ) {
    this.updatemetaInfo(this.ccpanoticemetainfo);
  }

  ngOnInit() {
    setTimeout(() => {
      AOS.init();
    }, 4000);
  }

  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.api.setpAgetitle(metainfo.title);
  }
  scrollToDiv(tabname, formType: string) {
    this.formType = formType;
    this.event.setHeaderEmmit(formType);
    if (this.router.url !== '/landing') {
      this.router.navigate(['/landing']);
    }
  }

}
