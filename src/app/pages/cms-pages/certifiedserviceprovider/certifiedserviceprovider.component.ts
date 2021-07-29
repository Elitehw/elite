import { StorageService } from './../../../services/storage.service';
import { ApiService } from 'src/app/services/api.service';
import { MapsAPILoader } from '@agm/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
declare var google;
import { providers } from '../../../metainfo';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-certifiedserviceprovider',
  templateUrl: './certifiedserviceprovider.component.html',
  styleUrls: ['./certifiedserviceprovider.component.scss']
})
export class CertifiedserviceproviderComponent implements OnInit {
  basicInfoForm: FormGroup;
  companyInfoForm: FormGroup;
  ChooseFormgroup: FormGroup;
  businessContactForm: FormGroup;
  licensedTechniciansForm: FormGroup;
  additionalStateForm: FormGroup;
  insuranceInfoForm: FormGroup;
  ServiceDiagnosisForm: FormGroup;
  preformServicesForm: FormGroup;
  commentBoxForm: FormGroup;
  selectedState: any[] = new Array<any>();
  contactForm: FormGroup;
  stepFinishForm: FormGroup;
  addressSeldcted: boolean;
  filteredStates: any[];
  filteredService: any[];
  allStates: any[];
  allServices: any[];
  selectedUsers: any[] = new Array<any>();
  removable = true;
  uploadDocumentarr: any[];
  providersmetaInfo = providers;
  uploadDocumentInsurance: any[];
  @ViewChild('stateInput') stateInput: ElementRef<HTMLInputElement>;
  @ViewChild('stepper', { static: true }) public stepper: MatStepper;
  @ViewChild('location', { static: true }) public location: ElementRef;
  formData: any;
  formType: string;
  formNamearray: any;
  providersFormQuestion: any;
  selectedInddex: number;
  constructor(
    private formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private apiService: ApiService,
    private meta: Meta,
    private storage: StorageService
  ) {
    this.formData = {};
    this.updatemetaInfo();
    this.formType = 'csp';
    this.formNamearray = [];
    this.uploadDocumentarr = [];
    this.uploadDocumentInsurance = [];
  }

  ngOnInit(): void {
    if (this.location && this.location.nativeElement) {
      this.autoFillLocation('location');
    }
    this.formInit();
    this.getAllStates();
    this.getAllServices();
    this.getFromQuestionsData();
    this.insuranceInfoForm.controls.Option_select.valueChanges.subscribe(item => {
      if (item === true) {
        this.insuranceInfoForm.get('contractor_licence_upload').clearValidators();
        this.insuranceInfoForm.get('contractor_licence_upload').updateValueAndValidity();
      } else {
        this.insuranceInfoForm.get('contractor_licence_upload').setValidators([Validators.required]);
        this.insuranceInfoForm.get('contractor_licence_upload').updateValueAndValidity();
      }
    });
    this.insuranceInfoForm.controls.choose_option.valueChanges.subscribe(item => {
      if (item === true) {
        this.insuranceInfoForm.get('policy_document').clearValidators();
        this.insuranceInfoForm.get('policy_document').updateValueAndValidity();
      } else {
        this.insuranceInfoForm.get('policy_document').setValidators([Validators.required]);
        this.insuranceInfoForm.get('policy_document').updateValueAndValidity();
      }
    });
    if (this.storage.getcspData()) {
      if (this.storage.getcspData().formNamearray.length > 0) {
        this.storage.getcspData().formNamearray.map(item => {
          this.formNamearray.push(item);
        });
      }
      this.stepper.selectedIndex = 0;
    } else {
      this.stepper.selectedIndex = 1;
      this.selectedInddex = this.stepper.selectedIndex;
    }
  }
  updatemetaInfo() {
    this.meta.updateTag({ name: 'description', content: this.providersmetaInfo.description });
    this.meta.updateTag({ name: 'title', content: this.providersmetaInfo.title });
    this.apiService.setpAgetitle(this.providersmetaInfo.title);
  }
  getFromQuestionsData() {
    this.providersFormQuestion = {
      csp: [
        '',
        'Let’s begin with your full name, mobile number and your email address.',
        'letʼs proceed with getting your company information:',
        'We do need your business contact information:',
        'What is the number of licensed Technicians that are available at your company ?',
        'Do your company provide services in any additional states:',
        'Letʼs verify your business license and insurance information:',
        'Thank you for all of the information you have provided. Now please let us know what is your standard Service/Diagnosis fee ?',
        'Please select the items you are licensed to preform services on from the following list:',
        'Please provide any additional comments',
        '',
      ]
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

  formInit() {
    this.basicInfoForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s\.]+ [a-zA-Z\s\.]{1,}\s*$/)]],
      mobile: ['', [Validators.required, Validators.minLength(10)]],
      // tslint:disable-next-line:max-line-length
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s._%+-]+@[a-z0-9\s.-]+\.[a-z\s]{2,66}\s*$/)]],
    });
    this.companyInfoForm = this.formBuilder.group({
      companyName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s\.]{1,}\s*$/)]],
      ein_number: ['', [Validators.required, Validators.minLength(9)]],
      address: ['', Validators.required],
      additionalAddress: ['', Validators.required],
      zipCode: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
    });
    this.businessContactForm = this.formBuilder.group({
      // tslint:disable-next-line:max-line-length
      business_email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s._%+-]+@[a-z0-9\s.-]+\.[a-z\s]{2,66}\s*$/)]],
      business_phone: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.licensedTechniciansForm = this.formBuilder.group({
      licensed_employees: ['', Validators.required]
    });

    this.additionalStateForm = this.formBuilder.group({
      nationWide: [false],
      availability: ['']
    });

    this.insuranceInfoForm = this.formBuilder.group({
      contractor_licence_no: ['', Validators.required],
      contractor_licence_upload: ['', Validators.required],
      insurance_carrier: ['', Validators.required],
      policy_no: ['', Validators.required],
      policy_document: ['', Validators.required],
      Option_select: [false],
      choose_option: [false]
    });

    this.ServiceDiagnosisForm = this.formBuilder.group({
      fee: ['', Validators.required],
      factored: ['No', Validators.required]
    });

    this.preformServicesForm = this.formBuilder.group({
      items: ['', Validators.required],
    });

    this.commentBoxForm = this.formBuilder.group({
      comments: [''],
    });

    this.stepFinishForm = this.formBuilder.group({
      comments: [''],
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
      } else if (key === 'policy_document') {
        if (data[key].length > 0) {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < data[key].length; index++) {
            const availFile = data[key][index];
            postData.append(`${key}`, availFile);
          }
        }
      } else if (key === 'contractor_licence_upload') {
        if (data[key].length > 0) {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < data[key].length; index++) {
            const availFile = data[key][index];
            postData.append(`${key}`, availFile);
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

    return new Promise<void>((resolve, reject) => {
      this.apiService.postMultiData('leadform/create', postData).toPromise().then((res: any) => {
        if (res.status === 200) {
          this.formInit();
          this.storage.clearcspData();
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
    this.storage.setcspData(Collectdata);
  }
  goBack(stepper: any) {
    stepper.previous();
    this.selectedInddex = stepper._selectedIndex;
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
    if (type === 'insurer') {
      this.insuranceInfoForm.controls.insurance_carrier.setValue(event.target.value.split('.')[0]);
    }
    if (type === 'policy_no') {
      this.insuranceInfoForm.controls.policy_no.setValue(event.target.value.split('.')[0]);
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
    if (type === 'insurer') {
      this.insuranceInfoForm.controls.insurance_carrier.setValue(event.target.value.trim());
    }
    if (type === 'policy_no') {
      this.insuranceInfoForm.controls.policy_no.setValue(event.target.value.trim());
    }
    if (type === 'comments') {
      this.commentBoxForm.controls.comments.setValue(event.target.value.trim());
    }
  }

  searchfilter(event) {
    const input = (event.target as HTMLInputElement).value;
    if (input === '') {
      this.filteredStates = this.allStates;
    } else {
      this.filteredStates = this.allStates.filter((d: any) => d.title.toLowerCase().includes(input.toLowerCase()));
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

  serarchService(event) {
    const input = (event.target as HTMLInputElement).value;
    if (input === '') {
      this.filteredService = this.allServices;
    } else {
      this.filteredService = this.allServices.filter((d: any) => d.title.toLowerCase().includes(input.toLowerCase()));
    }
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

  isNumberKey(evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 36) {
      return false;
    } else {
      return true;
    }
  }

  Addsign(event) {
    let inputvalue;
    inputvalue = event.target.value;
    if (inputvalue) {
      if (inputvalue.charAt(0) === '$') {
        inputvalue = inputvalue.substring(1);
      }
    }
    let newValue;
    newValue = `$${inputvalue}`;
    event.target.value = newValue;
  }

  uploadDocumentInit(e, uploadedFile: any) {
    for (let i = 0; i < uploadedFile.files.length; i++) {
      if (e.target.files[i].type === 'application/pdf') {
        const file: File = uploadedFile.files[i];
        this.uploadDocumentarr.push(file);
        this.insuranceInfoForm.patchValue({ contractor_licence_upload: this.uploadDocumentarr });
      } else {
        // this.apiService.alert('Only .PDF are supported.', 'error');
      }
    }
  }

  removeDocument(index, type) {
    if (type === 'contractor_licence_upload') {
      this.insuranceInfoForm.controls.contractor_licence_upload.value.splice(index, 1);
    }
    if (type === 'policy_document') {
      this.insuranceInfoForm.controls.policy_document.value.splice(index, 1);
    }
  }

  uploadDocumentInsuranceInit(e, uploadedFile: any) {
    for (let i = 0; i < uploadedFile.files.length; i++) {
      if (e.target.files[i].type === 'application/pdf') {
        const file: File = uploadedFile.files[i];
        this.uploadDocumentInsurance.push(file);
        this.insuranceInfoForm.patchValue({ policy_document: this.uploadDocumentInsurance });
      } else {
        // this.apiService.alert('Only .PDF are supported.', 'error');
      }
    }
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
  accessForm(type) {
    if (type === 'acsess') {
      if (this.storage.getcspData().formData.address) {
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
        if (this.storage.getcspData().formNamearray.length > 0) {
          this.storage.getcspData().formNamearray.map(item => {
            if (name === item) {
              // if (name !== 'preformServicesForm') {
              this[name].patchValue(this.storage.getcspData().formData);
              this.formData = this.storage.getcspData().formData;
              this.insuranceInfoForm.controls.policy_document.setValue('');
              this.insuranceInfoForm.controls.contractor_licence_upload.setValue('');
              if (this.formData.contractor_licence_upload) {
                this.formData.contractor_licence_upload = [];
              }
              if (this.formData.policy_document) {
                this.formData.policy_document = [];
              }
              // } else {
              //   this.preformServicesForm.patchValue(this.storage.getserviceStepData());
              // }
            }
          });
        }
      });
      if (this.storage.getcspData().formData.availability) {
        this.storage.getcspData().formData.availability.map(item => {
          this.selectedState.push(item);
        });
        this.additionalStateForm.controls.availability.setValue(this.selectedState);
        this.selectedState.map(result => {
          const i = this.filteredStates.findIndex(value => value.title === result.title);
          this.filteredStates[i].selected = true;
        });
      }
      if (this.storage.getcspData().formData.items) {
        this.storage.getcspData().formData.items.map(item => {
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
      this.storage.clearcspData();
    }
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

}
