import { MapsAPILoader } from '@agm/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatStepper } from '@angular/material/stepper';
import { Meta } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import * as _ from 'underscore';
declare var google;
import { agencies } from '../../../metainfo';



@Component({
  selector: 'app-titleagencies',
  templateUrl: './titleagencies.component.html',
  styleUrls: ['./titleagencies.component.scss']
})
export class TitleagenciesComponent implements OnInit {
  basicInfoForm: FormGroup;
  companyInfoForm: FormGroup;
  businessContactForm: FormGroup;
  licensedTechniciansForm: FormGroup;
  additionalStateForm: FormGroup;
  ChooseFormgroup: FormGroup;
  commentBoxForm: FormGroup;
  stepFinishForm: FormGroup;
  addressSeldcted: boolean;
  selectedInddex: any;
  formData: any;
  formType: any;
  states: string[] = [];
  filteredStates: any[];
  selectedState: any[] = new Array<any>();
  allStates: any[];
  formNamearray: any;
  agenciesmetainfo = agencies;
  @ViewChild('stateInput') stateInput: ElementRef<HTMLInputElement>;
  @ViewChild('stepper', { static: true }) public stepper: MatStepper;
  @ViewChild('location', { static: true }) public location: ElementRef;
  providersFormQuestion: { title_agencies: string[]; };
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public storage: StorageService,
    public apiService: ApiService,
    private meta: Meta
  ) {
    this.formData = {};
    this.formType = 'title_agencies';
    this.updatemetaInfo();
    this.formNamearray = [];
  }

  ngOnInit(): void {
    this.formInit();
    this.getAllStates();
    this.getFromQuestionsData();
    if (this.location && this.location.nativeElement) {
      this.autoFillLocation('location');
    }
    setTimeout(() => {
      if (this.storage.gettitleAgencyData()) {
        if (this.storage.gettitleAgencyData().formNamearray.length > 0) {
          this.storage.gettitleAgencyData().formNamearray.map(item => {
            this.formNamearray.push(item);
          });
        }
        this.stepper.selectedIndex = 0;
      } else {
        this.stepper.selectedIndex = 1;
        this.selectedInddex = 1;
      }
    }, 100);
  }

  getFromQuestionsData() {
    this.providersFormQuestion = {
      title_agencies: [
        '',
        'Let’s begin with your full name, mobile number and your email address.',
        'Letʼs proceed with getting your title company information:',
        'We do need your business contact information:',
        'What is the number agents that are available at your company ?',
        'Do your agency provide services in any additional states:',
        'Please provide any additional comments',
        '',
      ],
    };
  }
  updatemetaInfo() {
    this.meta.updateTag({ name: 'description', content: this.agenciesmetainfo.description });
    this.meta.updateTag({ name: 'title', content: this.agenciesmetainfo.title });
    this.apiService.setpAgetitle(this.agenciesmetainfo.title);
  }
  getAllStates() {
    this.apiService.get('state/list').subscribe((res: any) => {
      if (res) {
        this.allStates = res.data;
        if (this.allStates.length > 0) {
          this.allStates.sort((a, b) => a.title.localeCompare(b.title));
        }
        this.filteredStates = this.allStates;
      }
    });
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
    this.licensedTechniciansForm = new FormGroup({
      licensed_employees: new FormControl('', [Validators.required])
    });
    this.additionalStateForm = new FormGroup({
      nationWide: new FormControl(false),
      availability: new FormControl('')
    });
    this.commentBoxForm = new FormGroup({
      comments: new FormControl(''),
    });
    this.stepFinishForm = new FormGroup({
      comments: new FormControl(''),
    });
    this.additionalStateForm.controls.nationWide.valueChanges.subscribe((isChecked: boolean) => {
      if (isChecked) {
        this.filteredStates.map(item => {
          if (item.selected) {
            delete item.selected;
          }
        });
        this.selectedState = [];
        this.additionalStateForm.patchValue({ availability: '' });
        this.additionalStateForm.controls.availability.disable();
      } else {
        this.additionalStateForm.controls.availability.enable();
      }
    });
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
  displayFn(value: any[] | string): string | undefined {
    let displayValue: string;
    if (Array.isArray(value)) {
      value.forEach((user, index) => {
        if (index === 0) {
          displayValue = '';
        } else {
          displayValue = '';
        }
      });
    } else {
      displayValue = '';
    }
    return displayValue;
  }
  stateOptionClicked(event: Event, user: any) {
    event.stopPropagation();
    this.toggleStateSelection(user);
  }
  toggleStateSelection(stateobj: any) {
    stateobj.selected = !stateobj.selected;
    if (stateobj.selected) {
      this.selectedState.push(stateobj);
    } else {
      const i = this.selectedState.findIndex(value => value.title === stateobj.title);
      this.selectedState.splice(i, 1);
    }
    this.additionalStateForm.controls.availability.setValue(this.selectedState);
  }
  removeState(state) {
    state.selected = !state.selected;
    const i = this.selectedState.findIndex(value => value.title === state.title);
    this.selectedState.splice(i, 1);
    this.additionalStateForm.controls.availability.setValue(this.selectedState);
    this.filteredStates.map(item => {
      if (item.title === state.title) {
        delete item.selected;
      }
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
    this.storage.settitleAgencyData(Collectdata);
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
          this.storage.cleartitleAgencyData();
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

  searchfilter(event) {
    const input = (event.target as HTMLInputElement).value;
    if (input === '') {
      this.filteredStates = this.allStates;
    } else {
      this.filteredStates = this.allStates.filter((d: any) => d.title.toLowerCase().includes(input.toLowerCase()));
    }
  }
  accessForm(type) {
    if (type === 'acsess') {
      if (this.storage.gettitleAgencyData().formData.address) {
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
        if (this.storage.gettitleAgencyData().formNamearray.length > 0) {
          this.storage.gettitleAgencyData().formNamearray.map(item => {
            if (name === item) {
              this[name].patchValue(this.storage.gettitleAgencyData().formData);
              this.formData = this.storage.gettitleAgencyData().formData;
            }
          });
        }
      });
      if (this.storage.gettitleAgencyData().formData.availability) {
        this.storage.gettitleAgencyData().formData.availability.map(item => {
          this.selectedState.push(item);
        });
        this.additionalStateForm.controls.availability.setValue(this.selectedState);
        this.selectedState.map(result => {
          const i = this.filteredStates.findIndex(value => value.title === result.title);
          this.filteredStates[i].selected = true;
        });
      }
      this.stepper.selectedIndex = 1;
      this.selectedInddex = 1;
    } else {
      this.stepper.selectedIndex = 1;
      this.storage.cleartitleAgencyData();
    }
  }

}
