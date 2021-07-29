import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { compare } from '../../../metainfo';

@Component({
  selector: 'app-compareplan',
  templateUrl: './compareplan.component.html',
  styleUrls: ['./compareplan.component.scss']
})
export class CompareplanComponent implements OnInit {
  comparemetaInfo = compare;
  constructor(
    private meta: Meta,
    private api: ApiService
  ) { }


  ngOnInit(): void {
    this.updatemetaInfo();
  }
  updatemetaInfo() {
    this.meta.updateTag({ name: 'description', content: this.comparemetaInfo.description });
    this.meta.updateTag({ name: 'title', content: this.comparemetaInfo.title });
    this.api.setpAgetitle(this.comparemetaInfo.title);
  }
}
