import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { buyerSellereMetainfo } from '../../../metainfo';
@Component({
  selector: 'app-buyer-seller',
  templateUrl: './buyer-seller.component.html',
  styleUrls: ['./buyer-seller.component.scss']
})
export class BuyerSellerComponent implements OnInit {
  Metainfo = buyerSellereMetainfo;
  constructor(
    private meta: Meta,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.updatemetaInfo();
  }
  updatemetaInfo() {
    this.meta.updateTag({ name: 'description', content: this.Metainfo.description });
    this.meta.updateTag({ name: 'title', content: this.Metainfo.title });
    this.api.setpAgetitle(this.Metainfo.title);
  }
}
