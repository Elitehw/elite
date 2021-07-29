import { ApiService } from './../../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { alaska } from '../../../metainfo';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-elitestate',
  templateUrl: './elitestate.component.html',
  styleUrls: ['./elitestate.component.scss']
})
export class ElitestateComponent implements OnInit {
  alaskametainfo = alaska;
  stateDetails: any = [];
  baseFilePath: string;
  staticImageList: any = [];
  constructor(
    private meta: Meta,
    private api: ApiService,
    private actiVatedroute: ActivatedRoute
  ) {
    // this.updatemetaInfo(this.alaskametainfo);
    this.baseFilePath = environment.BASE_IMAGE_ENDPOINT;
  }

  ngOnInit(): void {
    this.actiVatedroute.params.subscribe(res => {
      if (res) {
        this.getStateId(res.name);
      }
    });
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.api.setpAgetitle(metainfo.title);
  }
  getStateId(name) {
    const StateName = name.split('-');
    // console.log(StateName[0]);
    this.api.get('state/list').subscribe(res => {
      if (res && this.api.isExist(res.data)) {
        if (res.data.length > 0) {
          const state = res.data.filter(item => item.title.toLowerCase() === StateName[0]);
          if (state.length > 0) {
            this.getStateArticle(state[0]._id);
            this.getstaticImageList();
          }
        }
      }
    });
  }
  getstaticImageList() {
    this.api.get('state-image-list').subscribe(res => {
      if (res) {
        this.staticImageList = res.data[0];
      }
    });
  }
  getStateArticle(stateId) {
    this.api.get(`state/article/${stateId}`).subscribe(res => {
      this.stateDetails = res.data[0];
      console.log(this.stateDetails);
      this.updatemetaInfo({
        title: this.stateDetails.meta_title ?
          this.stateDetails.meta_title : this.alaskametainfo.title,
        description: this.stateDetails.meta_description ? this.stateDetails.meta_description : this.alaskametainfo.description
      });
    });
  }
}
