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
declare var google;
import { suppliers } from '../../../metainfo';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  basicInfoForm: FormGroup;
  companyInfoForm: FormGroup;
  ChooseFormgroup: FormGroup;
  businessContactForm: FormGroup;
  licensedTechniciansForm: FormGroup;
  additionalStateForm: FormGroup;
  preformServicesForm: FormGroup;
  commentBoxForm: FormGroup;
  stepFinishForm: FormGroup;
  addressSeldcted: boolean;
  selectedInddex: any;
  formData: any;
  formType: any;
  selectedState: any[] = new Array<any>();
  selectedUsers: any[] = new Array<any>();
  states: string[] = [];
  filteredStates: any[];
  filteredService: any[];
  allStates: any[];
  allServices: any[];
  suppliersmetainfo = suppliers;
  formNamearray: any;
  previousMatStepperData: MatStepper;
  @ViewChild('stateInput') stateInput: ElementRef<HTMLInputElement>;

  @ViewChild('vendors', { static: true }) public vendors: ElementRef;
  @ViewChild('zipcode', { static: true }) public zipcode: ElementRef;
  @ViewChild('stepper', { static: true }) public stepper: MatStepper;
  mapDataStatic: ({ id: string; value: number; fill: any; isRegulated: string; name: string; } |
  { id: string; value: number; isRegulated: string; fill?: undefined; name: string; })[];
  providersFormQuestion: { vendors: string[]; };
  constructor(
    public zone: NgZone,
    private apiService: ApiService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public storage: StorageService,
    private meta: Meta
  ) {
    this.formData = {};
    this.formType = 'vendors';
    this.updatemetaInfo(this.suppliersmetainfo);
    this.formNamearray = [];
  }

  ngOnInit(): void {
    this.getAllStates();
    this.getAllServices();
    this.formInit();
    this.getFromQuestionsData();
    if (this.vendors && this.vendors.nativeElement) {
      this.autoFillLocation('vendors');
    }
    setTimeout(() => {
      if (this.storage.getsuppliarData()) {
        if (this.storage.getsuppliarData().formNamearray.length > 0) {
          this.storage.getsuppliarData().formNamearray.map(item => {
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
    this.additionalStateForm = new FormGroup({
      nationWide: new FormControl(false),
      availability: new FormControl('')
    });
    this.preformServicesForm = new FormGroup({
      items: new FormControl('', [Validators.required]),
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
  getFromQuestionsData() {
    this.providersFormQuestion = {
      vendors: [
        '',
        'Let’s begin with your full name, mobile number and your email address.',
        'letʼs proceed with getting your company information:',
        'We do need your business contact information:',
        'Do your company provide services in any additional states:',
        // tslint:disable-next-line:max-line-length
        'Please select the items you are licensed to preform services on from the following list:',
        'Please provide any additional comments',
        '',
      ],
    };
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

  serarchService(event) {
    const input = (event.target as HTMLInputElement).value;
    if (input === '') {
      this.filteredService = this.allServices;
    } else {
      this.filteredService = this.allServices.filter((d: any) => d.title.toLowerCase().includes(input.toLowerCase()));
    }
  }
  restrictSpace(event) {
    if (event.target.value.match(/\s/g)) {
      event.target.value = event.target.value.replace(/\s/g, '');
    }
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
      if (formGroupName === 'insuranceInfoForm') {
        if (this[formGroupName].controls.contractor_licence_upload.invalid) {
          this.apiService.alert('Please upload contractor licence document!', 'info');
        } else if (this[formGroupName].controls.policy_document.invalid) {
          this.apiService.alert('Please upload general liability insurance policy document!', 'info');
        }
      }
      Object.keys(this[formGroupName].controls).forEach(key => {
        this[formGroupName].get(key).markAsTouched({ onlySelf: true });
      });
    }
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
      } else if (key === 'items') {
        for (let index = 0; index < data[key].length; index++) {
          const serviceItem = data[key][index].title;
          postData.append(`${key}[${index}]`, serviceItem);
        }
      } else if (key !== 'availability' && key !== 'items') {
        postData.set(key, data[key]);
      }

    }

    return new Promise((resolve, reject) => {
      this.apiService.postMultiData('leadform/create', postData).toPromise().then((res: any) => {
        if (res.status === 200) {
          this.formInit();
          this.storage.clearsuppliarData();
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
  setstepDatatocookie(formData, formGroupName, stepper: any, formNamearray) {
    const collectformdata = formData;
    const Collectdata = {
      formData: collectformdata,
      // tslint:disable-next-line:no-string-literal
      selectedInddex: stepper['_selectedIndex'],
      formGroupName,
      formNamearray,
      formType: this.formType
    };
    this.storage.setsuppliarData(Collectdata);
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
  optionClicked(event: Event, user: any) {
    event.stopPropagation();
    this.toggleSelection(user);
  }

  toggleSelection(user: any) {
    user.selected = !user.selected;
    if (user.selected) {
      this.selectedUsers.push({ title: user.title, _id: user._id, selected: user.selected, description: user.description });
    } else {
      const i = this.selectedUsers.findIndex(value => value.title === user.title);
      this.selectedUsers.splice(i, 1);
    }
    this.preformServicesForm.controls.items.setValue(this.selectedUsers);
  }

  removeOption(item) {
    item.selected = !item.selected;
    const i = this.selectedUsers.findIndex(value => value.title === item.title);
    this.selectedUsers.splice(i, 1);
    this.preformServicesForm.controls.items.setValue(this.selectedUsers);
    this.filteredService.map(service => {
      if (service.title === item.title) {
        delete service.selected;
      }
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
  getAllServices() {
    this.apiService.get('request-service/list').subscribe((res: any) => {
      if (res) {
        this.allServices = res.data;
        this.filteredService = this.allServices;
        this.selectedUsers.map(result => {
          const i = this.allServices.findIndex(value => value.title === result.title);
          this.allServices.splice(i, 1);
        });
      }
    });
  }
  accessForm(type) {
    if (type === 'acsess') {
      if (this.storage.getsuppliarData().formData.address) {
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
        if (this.storage.getsuppliarData().formNamearray.length > 0) {
          this.storage.getsuppliarData().formNamearray.map(item => {
            if (name === item) {
              this[name].patchValue(this.storage.getsuppliarData().formData);
              this.formData = this.storage.getsuppliarData().formData;
            }
          });
        }
      });
      if (this.storage.getsuppliarData().formData.availability) {
        this.storage.getsuppliarData().formData.availability.map(item => {
          this.selectedState.push(item);
        });
        this.additionalStateForm.controls.availability.setValue(this.selectedState);
        this.selectedState.map(result => {
          const i = this.filteredStates.findIndex(value => value.title === result.title);
          this.filteredStates[i].selected = true;
        });
      }
      if (this.storage.getsuppliarData().formData.items) {
        this.storage.getsuppliarData().formData.items.map(item => {
          this.selectedUsers.push(item);
        });
        this.preformServicesForm.controls.items.setValue(this.selectedUsers);
        this.selectedUsers.map(result => {
          const i = this.allServices.findIndex(value => value.title === result.title);
          this.allServices[i].selected = true;
          this.filteredService = this.allServices;
        });
      }
      this.stepper.selectedIndex = 1;
      this.selectedInddex = 1;
    } else {
      this.stepper.selectedIndex = 1;
      this.selectedInddex = 1;
      this.storage.clearsuppliarData();
    }
  }

}
