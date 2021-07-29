import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Meta } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import * as _ from 'underscore';
declare var google;
import { affiliates } from '../../../metainfo';

@Component({
  selector: 'app-affiliates',
  templateUrl: './affiliates.component.html',
  styleUrls: ['./affiliates.component.scss']
})
export class AffiliatesComponent implements OnInit {
  basicInfoForm: FormGroup;
  companyInfoForm: FormGroup;
  businessContactForm: FormGroup;
  commentBoxForm: FormGroup;
  stepFinishForm: FormGroup;
  ChooseFormgroup: FormGroup;
  addressSeldcted: boolean;
  selectedInddex: any;
  formData: any;
  formType: any;
  states: string[] = [];
  filteredStates: any[];
  allStates: any[];
  affiliatesmetainfo = affiliates;
  formNamearray: any;
  previousMatStepperData: MatStepper;
  @ViewChild('stateInput') stateInput: ElementRef<HTMLInputElement>;
  @ViewChild('affiliates', { static: true }) public affiliates: ElementRef;
  @ViewChild('stepper', { static: true }) public stepper: MatStepper;
  @ViewChild('location', { static: true }) public location: ElementRef;
  providersFormQuestion: any;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public storage: StorageService,
    public apiService: ApiService,
    private meta: Meta,
  ) {
    this.formData = {};
    this.formType = 'affiliates';
    this.formNamearray = [];
    this.updatemetaInfo(this.affiliatesmetainfo);
  }

  ngOnInit(): void {
    this.formInit();

    if (this.location && this.location.nativeElement) {
      this.autoFillLocation('location');
    }
    setTimeout(() => {
      if (this.storage.getaffiliateData()) {
        if (this.storage.getaffiliateData().formNamearray.length > 0) {
          this.storage.getaffiliateData().formNamearray.map(item => {
            this.formNamearray.push(item);
          });
        }
        this.stepper.selectedIndex = 0;
      } else {
        this.stepper.selectedIndex = 1;
        this.selectedInddex = 1;
      }
    }, 100);
    this.getFromQuestionsData();
  }
  getFromQuestionsData() {
    this.providersFormQuestion = {
      affiliates: [
        '',
        'Let’s begin with your full name, mobile number and your email address.',
        'Letʼs proceed with getting your affiliate company information:',
        'We do need your business contact information:',
        'Please provide any additional comments',
        '',
      ]
    };
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.apiService.setpAgetitle(metainfo.title);
  }
  formInit() {
    this.basicInfoForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s\.]+ [a-zA-Z\s\.]{1,}\s*$/)]),
      mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s._%+-]+@[a-z0-9\s.-]+\.[a-z\s]{2,66}\s*$/)])
    });
    this.companyInfoForm = new FormGroup({
      companyName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s\.]{1,}\s*$/)]),
      // ein_number: new FormControl('', [Validators.required, Validators.minLength(9)]),
      address: new FormControl('', [Validators.required]),
      additionalAddress: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
    });
    this.businessContactForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      business_email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s._%+-]+@[a-z0-9\s.-]+\.[a-z\s]{2,66}\s*$/)]),
      business_phone: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
    this.commentBoxForm = new FormGroup({
      comments: new FormControl(''),
    });
    this.stepFinishForm = new FormGroup({
      comments: new FormControl(''),
    });
  }
  autoFillLocation(element: string) {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this[element].nativeElement, {
        // types: ['(regions)'],
        componentRestrictions: {
          country: 'us'
        }
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          this.addressSeldcted = true;
          const place = autocomplete.getPlace();
          // console.log(place);
          this.companyInfoForm.controls.zipCode.setValue(null);
          this.companyInfoForm.controls.additionalAddress.setValue(null);
          this.companyInfoForm.controls.city.setValue(null);
          this.companyInfoForm.controls.state.setValue(null);
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < place.address_components.length; i++) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < place.address_components[i].types.length; j++) {
              if (place.address_components[i].types[j] === 'route') {
                this.companyInfoForm.patchValue({ address: place.name });
              }
              // tslint:disable-next-line:max-line-length
              if (this.companyInfoForm.controls.additionalAddress.value === null || this.companyInfoForm.controls.additionalAddress.value === '') {
                this.companyInfoForm.controls.additionalAddress.clearValidators();
                this.companyInfoForm.controls.additionalAddress.updateValueAndValidity();
              }
              if (place.address_components[i].types[j] === 'postal_code') {
                this.companyInfoForm.patchValue({ zipCode: place.address_components[i].long_name });
              }
              // tslint:disable-next-line:max-line-length
              if (place.address_components[i].types[j] === 'locality') {
                this.companyInfoForm.patchValue({ city: place.address_components[i].long_name });
              }
              if (place.address_components[i].types[j] === 'sublocality_level_1') {
                this.companyInfoForm.patchValue({ city: place.address_components[i].long_name });
              }
              if (place.address_components[i].types[j] === 'sublocality') {
                this.companyInfoForm.patchValue({ city: place.address_components[i].long_name });
              }
              if (place.address_components[i].types[j] === 'administrative_area_level_1') {
                this.companyInfoForm.patchValue({ state: place.address_components[i].long_name });
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
  goBack(stepper: any) {
    stepper.previous();
    this.selectedInddex = stepper._selectedIndex;
  }
  replaceMorethenoneSpace(event, type) {
    if (event.target.value.match(/\s/g)) {
      event.target.value = event.target.value.replace(/ {1,}/g, ' ');
    }
    if (event.target.value.match(/\./g)) {
      event.target.value = event.target.value.replace(/\./g, '');
    }
    if (type === 'Uname') {
      this.basicInfoForm.controls.name.setValue(event.target.value.split('.')[0]);
    }
    if (type === 'Cname') {
      this.companyInfoForm.controls.companyName.setValue(event.target.value.split('.')[0]);
    }
    if (type === 'comments') {
      this.commentBoxForm.controls.comments.setValue(event.target.value.split('.')[0]);
    }
  }
  removelastspace(event, type) {
    if (type === 'Uname') {
      this.basicInfoForm.controls.name.setValue(event.target.value.trim());
    }
    if (type === 'Cname') {
      this.companyInfoForm.controls.companyName.setValue(event.target.value.trim());
    }
    if (type === 'comments') {
      this.commentBoxForm.controls.comments.setValue(event.target.value.trim());
    }
  }
  restrictSpace(event) {
    if (event.target.value.match(/\s/g)) {
      event.target.value = event.target.value.replace(/\s/g, '');
    }
  }


  validateForm(stepper: any, formGroupName: any, manualStepperCount: number) {
    if (this[formGroupName].valid) {
      if (manualStepperCount === 9) {
        if (Object.keys(this.formData).length > 0) {
          this.formData = Object.assign({}, this.formData, this[formGroupName].value);
        } else {
          this.formData = this[formGroupName].value;
        }
        this.submitForm(this.formData).then(() => {
          stepper.next();
        });
      } else {
        if (Object.keys(this.formData).length > 0) {
          this.formData = Object.assign({}, this.formData, this[formGroupName].value);
        } else {
          this.formData = this[formGroupName].value;
        }
        const index = this.formNamearray.indexOf(formGroupName);
        if (index === -1) {
          this.formNamearray.push(formGroupName);
        }
        this.setstepDatatocookie(this.formData, formGroupName, stepper, this.formNamearray);
        stepper.next();
        this.selectedInddex = stepper._selectedIndex;
      }
    } else {
      Object.keys(this[formGroupName].controls).forEach(key => {
        this[formGroupName].get(key).markAsTouched({ onlySelf: true });
      });
    }
  }
  setstepDatatocookie(formData, formGroupName, stepper: any, formNamearray) {
    const collectformdata = formData;
    const Collectdata = {
      formData: collectformdata,
      // tslint:disable-next-line:no-string-literal
      selectedInddex: stepper['_selectedIndex'],
      formNamearray,
      formType: this.formType
    };
    this.storage.setaffiliateData(Collectdata);
  }
  submitForm(data: any) {
    const postData = new FormData();
    postData.set('formType', this.formType);
    for (const key in data) {
      if (key === 'availability') {
        if (data[key].length > 0) {
          for (let index = 0; index < data[key].length; index++) {
            const availStates = data[key][index];
            postData.append(`${key}[${index}]`, availStates);
          }
        }
      } else if (key !== 'availability') {
        postData.set(key, data[key]);
      }
    }
    return new Promise<void>((resolve, reject) => {
      this.apiService.postMultiData('leadform/create', postData).toPromise().then((res: any) => {
        if (res.status === 200) {
          this.formInit();
          this.storage.clearaffiliateData();
          this.apiService.alert(res.message, 'success');
          resolve();
        } else {
          this.apiService.alert(res.message, 'error');
        }
      }, err => {
        this.apiService.alert('Somethings went wrong. Try Again!', 'error');
        reject();
      });
    });
  }
  accessForm(type) {
    if (type === 'acsess') {
      if (this.storage.getaffiliateData().formData.address) {
        this.addressSeldcted = true;
      }
      if (this.companyInfoForm.controls.additionalAddress.value === null || this.companyInfoForm.controls.additionalAddress.value === '') {
        this.companyInfoForm.controls.additionalAddress.clearValidators();
        this.companyInfoForm.controls.additionalAddress.updateValueAndValidity();
      }
      const formNamearray = [
        'basicInfoForm',
        'companyInfoForm',
        'businessContactForm',
        'licensedTechniciansForm',
        'additionalStateForm',
        'insuranceInfoForm',
        'ServiceDiagnosisForm',
        'preformServicesForm',
        'commentBoxForm',
      ];
      formNamearray.map(name => {
        if (this.storage.getaffiliateData().formNamearray.length > 0) {
          this.storage.getaffiliateData().formNamearray.map(item => {
            if (name === item) {
              this[name].patchValue(this.storage.getaffiliateData().formData);
              this.formData = this.storage.getaffiliateData().formData;
            }
          });
        }
      });
      this.stepper.selectedIndex = 1;
      this.selectedInddex = 1;
    } else {
      this.stepper.selectedIndex = 1;
      this.storage.clearaffiliateData();
    }
  }

}
