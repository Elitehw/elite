import { Component, OnInit, Input } from '@angular/core';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {


  @Input() color = '#ffffff';
  @Input() class: string;
  @Input() background = 'transparent';
  @Input() fullPage = false;
  @Input() text = 'Wait';
  @Input() isButton = true;
  @Input() buttonText = true;


  loading: boolean;
  isLoading: any;

  constructor(
    private event: EventService
  ) {
    this.isLoading = this.event.isHttpRequest;
    this.loading = true;
  }

  ngOnInit() {
    this.event.isLoading.subscribe((res: boolean) => {
      this.loading = res;
    });
  }
}

