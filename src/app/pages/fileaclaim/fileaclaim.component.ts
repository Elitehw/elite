import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Meta } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { fileaclaim } from '../../metainfo';
declare var google;


@Component({
  selector: 'app-fileaclaim',
  templateUrl: './fileaclaim.component.html',
  styleUrls: ['./fileaclaim.component.scss']
})
export class FileaclaimComponent implements OnInit {
  @ViewChild('street', { static: true }) public street: ElementRef;
  streetAddress: any;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private meta: Meta,
    private api: ApiService
  ) {
    this.updatemetaInfo(fileaclaim);
  }

  ngOnInit(): void {
    if (this.street && this.street.nativeElement) {
      this.autoFillLocation();
    }
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.api.setpAgetitle(metainfo.title);
  }
  autoFillLocation() {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.street.nativeElement, {
        // types: ['(regions)'],
        componentRestrictions: {
          country: 'us'
        }
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = autocomplete.getPlace();
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < place.address_components.length; i++) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < place.address_components[i].types.length; j++) {
              if (place.address_components[i].types[j] === 'street_number') {
                this.streetAddress = place.address_components[i].long_name;
              }
              if (place.address_components[i].types[j] === 'route') {
                this.streetAddress = this.streetAddress + ' ' + place.address_components[i].long_name;
              }
            }
          }
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
        });
      });
    });
  }
}
