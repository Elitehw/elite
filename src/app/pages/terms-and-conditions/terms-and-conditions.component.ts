import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { termsofservice } from '../../metainfo';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  TermsData: any;
  formType: string;
  termsofservicemetainfo = termsofservice;
  constructor(
    private apiService: ApiService,
    private event: EventService,
    private router: Router,
    private meta: Meta
  ) {
    this.updatemetaInfo(this.termsofservicemetainfo);
  }

  ngOnInit(): void {
    this.getTermsAndConditions();
    setTimeout(() => {
      AOS.init();
    }, 4000);
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.apiService.setpAgetitle(metainfo.title);
  }
  getTermsAndConditions() {
    this.apiService.get('cms/terms-and-conditions').subscribe((res: any) => {
      if (res) {
        this.TermsData = res.data;
      }
    });
  }

  scrollToDiv(tabname, formType: string) {
    this.formType = formType;
    this.event.setHeaderEmmit(formType);
    this.router.navigate(['/landing']);
  }
}
