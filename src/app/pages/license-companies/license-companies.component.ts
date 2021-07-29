import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-license-companies',
  templateUrl: './license-companies.component.html',
  styleUrls: ['./license-companies.component.scss']
})
export class LicenseCompaniesComponent implements OnInit {
  searchedLoc: any;
  formType: string;
  constructor(
    private apiService: ApiService,
    private event: EventService,
    private router: Router
  ) { }

  ngOnInit() {
    if (localStorage.getItem('selState')) {
      const data = JSON.parse(localStorage.getItem('selState'));
      this.searchedLoc = data;
    }
    setTimeout(() => {
      AOS.init();
    }, 4000);
  }


  scrollToDiv(tabname, formType: string) {
    this.formType = formType;
    this.event.setHeaderEmmit(formType);
    if (this.router.url !== '/landing') {
      this.router.navigate(['/landing']);
    }
  }
}
