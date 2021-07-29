import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { maintenanceandrepairs } from '../../../metainfo';

@Component({
  selector: 'app-maintenance-and-repairs',
  templateUrl: './maintenance-and-repairs.component.html',
  styleUrls: ['./maintenance-and-repairs.component.scss']
})
export class MaintenanceAndRepairsComponent implements OnInit {

  constructor(
    private meta: Meta,
    private api: ApiService
  ) {
    this.updatemetaInfo(maintenanceandrepairs);
  }

  ngOnInit(): void {
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.api.setpAgetitle(metainfo.title);
  }
}
