import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { systems } from '../../../metainfo';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {
  linkList: any[];
  activeLink: any;
  systemsmetaInfo = systems;
  // status: boolean = false;
  // clickEvent(){
  //     this.status = !this.status;
  // }
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
    this.activeLink = this.linkList[1];
  }

  ngOnInit(): void {
    this.updatemetaInfo();
  }
  updatemetaInfo() {
    this.meta.updateTag({ name: 'description', content: this.systemsmetaInfo.description });
    this.meta.updateTag({ name: 'title', content: this.systemsmetaInfo.title });
    this.api.setpAgetitle(this.systemsmetaInfo.title);
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
