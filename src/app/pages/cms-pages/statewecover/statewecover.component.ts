import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Meta } from '@angular/platform-browser';
import { homewarrantycoveragemap } from '../../../metainfo';
@Component({
  selector: 'app-statewecover',
  templateUrl: './statewecover.component.html',
  styleUrls: ['./statewecover.component.scss']
})
export class StatewecoverComponent implements OnInit {
  newsLetter: FormGroup;
  allStates: any;
  mapDataStatic: any;
  status = false;
  statusstate = false;
  constructor(
    private api: ApiService,
    private meta: Meta
  ) {
    this.updatemetaInfo(homewarrantycoveragemap);
  }

  ngOnInit(): void {
    this.getAllStates();
    this.newsLetter = new FormGroup({
      newsLettermobilenum: new FormControl('', [Validators.required]),
      newsLetterzipcode: new FormControl('', [Validators.required]),
    });
    this.stateSel();
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.api.setpAgetitle(metainfo.title);
  }
  stateSel(event?, type?) {
    // if (event && type === 'list') {
    //   event.stateID = event.id;
    //   delete event.id;
    //   event.state = event.stateID.split('-').pop();
    // }
    // localStorage.setItem('selState', JSON.stringify(event));
    const element = document.querySelector('#state-artical');
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
    // this.router.navigate(['state-artical']);
  }

  getAllStates() {
    this.api.get('state/list').subscribe((res: any) => {
      if (res) {
        this.allStates = res.data;
        if (this.allStates.length > 0) {
          this.allStates.sort((a, b) => a.title.localeCompare(b.title));
        }
        this.allStates.map(item => {
          if (item.type === 'not_covered') {
            item.className = 'sanc';
          }
          if (item.type === 'cover') {
            item.className = 'sac';
          }
          if (item.type === 'processing') {
            item.className = 'swc';
          }
          return item;
        });
      }
    });
  }

  @HostListener('click', ['$event'])
  onClickBtn(event) {
    if (event.target === document.getElementsByClassName('strong').item(0) ||
      event.target === document.getElementsByClassName('custom__paragraph__image').item(0)) {
      return false;
    } else {
      this.status = false;
    }
  }
}
