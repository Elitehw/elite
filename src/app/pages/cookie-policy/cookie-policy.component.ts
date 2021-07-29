import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { Router } from '@angular/router';
import * as AOS from 'aos';
declare var $: any;
import { cookiepolicy } from '../../metainfo';
import { Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss']
})
export class CookiePolicyComponent implements OnInit {
  privacyPolicyData: any;
  formType: string;
  isclosecookiediv: boolean;
  cookiepolicymetainfo = cookiepolicy;
  constructor(
    private apiService: ApiService,
    private event: EventService,
    private router: Router,
    private meta: Meta
  ) {
    this.isclosecookiediv = true;
    this.updatemetaInfo(this.cookiepolicymetainfo);
  }

  ngOnInit() {
    this.getCookiepolicy();
    setTimeout(() => {
      AOS.init();
    }, 4000);
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.apiService.setpAgetitle(metainfo.title);
  }
  getCookiepolicy() {
    this.apiService.get('cms/cookie-policy').subscribe((res: any) => {
      if (res) {
        this.privacyPolicyData = res.data;
      }
    });
    $(window).scroll(() => {
      const scroll = $(window).scrollTop();
      if (scroll >= 100) {
        $('.cookiesWrapBox').removeClass('h-100 active');
      } else {
        $('.cookiesWrapBox').addClass('h-100 active');
      }
    });
  }

  scrollToDiv(tabname, formType: string) {
    this.formType = formType;
    this.event.setHeaderEmmit(formType);
    if (this.router.url !== '/landing') {
      this.router.navigate(['/landing']);
    }
  }


}
