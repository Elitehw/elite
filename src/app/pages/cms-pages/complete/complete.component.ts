import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { complete } from '../../../metainfo';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {
  linkList: any[];
  activeLink: any;
  completemetaInfo = complete;
  constructor(
    private router: Router,
    private meta: Meta,
    private api: ApiService
  ) {
    this.linkList = [
      {
        id: 1,
        name: 'ELITE APPLIANCES'
      },
      {
        id: 1,
        name: 'ELITE SYSTEM'
      },
      {
        id: 1,
        name: 'ELITE COMPLETE'
      },
      {
        id: 1,
        name: 'ELITE ELECTRONICS'
      },
      {
        id: 1,
        name: 'ELITE EXTEROR'
      },
      {
        id: 1,
        name: 'CUSTOMIZE YOUR OWN'
      },
    ];
    this.activeLink = this.linkList[2];
  }

  ngOnInit(): void {
    this.updatemetaInfo();
  }

  updatemetaInfo() {
    this.meta.updateTag({ name: 'description', content: this.completemetaInfo.description });
    this.meta.updateTag({ name: 'title', content: this.completemetaInfo.title });
    this.api.setpAgetitle(this.completemetaInfo.title);
  }
  routeTopage(pageName) {
    if (pageName === 'ELITE APPLIANCES') {
      this.router.navigate(['elite-appliances']);
    }
    if (pageName === 'ELITE SYSTEM') {
      this.router.navigate(['elite-systems']);
    }
    if (pageName === 'ELITE COMPLETE') {
      this.router.navigate(['elite-complete']);
    }
    if (pageName === 'ELITE ELECTRONICS') {
      this.router.navigate(['elite-electronics']);
    }
    if (pageName === 'ELITE EXTEROR') {
      this.router.navigate(['elite-exterior']);
    }
    if (pageName === 'CUSTOMIZE YOUR OWN') {
      this.router.navigate(['customize-your-own']);
    }
  }
}
