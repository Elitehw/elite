import { EventService } from './../../services/event.service';
import { Router } from '@angular/router';
import { StorageService } from './../../services/storage.service';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
declare var $: any;
import * as AOS from 'aos';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {
  @ViewChild('footer', { static: false }) footer: ElementRef;
  formType: string;
  isclosecookiediv: boolean;
  constructor(
    private storage: StorageService,
    private router: Router,
    private event: EventService
  ) {
    this.formType = '';
    this.isclosecookiediv = false;
  }

  ngOnInit() {
    if (this.storage.getcookiedivstatus() && this.storage.getcookiedivstatus() === true) {
      this.isclosecookiediv = false;
    }
    $(window).scroll(() => {
      const scroll = $(window).scrollTop();
      if (scroll >= 200) {
        $('.cookiesWrapBox').removeClass('h-100-- active');
        if (!this.storage.getcookiedivstatus()) {
          this.isclosecookiediv = true;
        }
      } else {
        $('.cookiesWrapBox').addClass('h-100-- active');
        this.isclosecookiediv = false;
      }
    });
    setTimeout(() => {
      AOS.init();
    }, 4000);
  }
  fooetrInit() {
  }

  ngAfterViewInit() {
    this.fooetrInit();
    // setTimeout(() => {
    //   AOS.init();
    // }, 1000);
  }

  closecookieDiv() {
    this.isclosecookiediv = !this.isclosecookiediv;
    this.storage.setcookiedivstatus(true);
  }
  scrollToDiv(tabname, formType: string) {
    this.formType = formType;
    if (this.router.url !== '/landing') {
      this.router.navigate(['/landing']);
      this.event.setHeaderEmmit(formType);
    } else {
      const element = document.querySelector(tabname);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
