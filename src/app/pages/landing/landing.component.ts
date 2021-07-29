import { Component, OnInit, ViewChild, ElementRef, NgZone, HostListener, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatChipInputEvent } from '@angular/material/chips';
declare var $;
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { ApiService } from 'src/app/services/api.service';
import { MapsAPILoader } from '@agm/core';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import * as AOS from 'aos';
declare var google;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit, AfterViewInit {
  status = false;
  filteredStates: any[];
  filteredService: any[];
  selectedUsers: any[] = new Array<any>();
  selectedState: any[] = new Array<any>();
  isLinear = false;
  providersFormQuestion: any;
  selectedInddex: number;
  allStates: any;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addressSeldcted: boolean;
  formData: any;
  allServices: any[];
  formType: string;
  previousMatStepperData: MatStepper;
  formNamearray: any;
  basicInfoForm: FormGroup;
  ChooseFormgroup: FormGroup;
  companyInfoForm: FormGroup;
  businessContactForm: FormGroup;
  newsLetter: FormGroup;
  licensedTechniciansForm: FormGroup;
  additionalStateForm: FormGroup;
  insuranceInfoForm: FormGroup;
  ServiceDiagnosisForm: FormGroup;
  preformServicesForm: FormGroup;
  commentBoxForm: FormGroup;
  stepFinishForm: FormGroup;
  contactForm: FormGroup;

  @ViewChild('stateInput') stateInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('csp', { static: true }) public csp: ElementRef;
  @ViewChild('rep', { static: true }) public rep: ElementRef;
  // tslint:disable-next-line:variable-name
  @ViewChild('title_agencies', { static: true }) public title_agencies: ElementRef;
  @ViewChild('vendors', { static: true }) public vendors: ElementRef;
  @ViewChild('affiliates', { static: true }) public affiliates: ElementRef;
  @ViewChild('zipcode', { static: true }) public zipcode: ElementRef;
  @ViewChild('stepper', { static: true }) public stepper: MatStepper;
  @ViewChild('stepper1', { static: true }) public stepper1: MatStepper;
  @ViewChild('stepper2', { static: true }) public stepper2: MatStepper;
  @ViewChild('stepper3', { static: true }) public stepper3: MatStepper;
  @ViewChild('stepper4', { static: true }) public stepper4: MatStepper;

  slides = [
    {
      img: './assets/images/realiability.png', title: 'RELIABILITY',
      content: 'We don’t make promises we can’t keep. We deliver the ultimate service that exceeds your expectations.',
    },
    {
      img: './assets/images/Licensed-and-regulation.png', title: 'FULLY LICENSED',
      content: 'We are fully licensed, regulated and bonded in every state we serve in.',
    },
    {
      img: './assets/images/better-coverage.png', title: 'BETTER COVERAGE',
      content: 'We offer higher caps and more coverage than most other service providers.',
    },
    {
      img: './assets/images/more-business.png', title: 'MORE BUSINESS',
      content: 'We can keep you busy delivering work orders using our network. Get future and repeat business from our policy holders.',
    },
    {
      img: './assets/images/protect-your-reputation.png', title: 'REPUTATION MATTERS',
      content: 'Our customers and partners are our main priority. We aim to provide excellent services that are second to none.',
    },
    {
      img: './assets/images/smarter-process.png', title: 'SMARTER PROCESS',
      content: 'We provide you with the ability to perform almost every transaction in few clicks from any device instantly.',
    },
    {
      img: './assets/images/effective-advertising.png', title: 'EFFECTIVE ADVERTISING',
      // tslint:disable-next-line:max-line-length
      content: 'Our customer base network is looking for your services. Get listed on our certified directory and be ready to receive calls.',
    },
    {
      img: './assets/images/fair-commision.png', title: 'FAIR COMMISSION',
      content: 'We truly appreciate your hard work which is why we offer some of the highest commissions in the industry.',
    },
  ];

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    infinite: true,
    dots: false,
    autoplay: false,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3, } },
      { breakpoint: 991, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true, autoplay: true, } },
      { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true, autoplay: true, } }
    ]
  };

  mapDataStatic: ({ id: string; value: number; fill: any; isRegulated: string; name: string; } |
  { id: string; value: number; isRegulated: string; fill?: undefined; name: string; })[];
  uploadDocumentarr: any[];
  uploadDocumentInsurance: any[];

  constructor(
    // tslint:disable-next-line:variable-name
    public zone: NgZone,
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public storageService: StorageService,
    private event: EventService,
    private router: Router
  ) {
    this.formData = {};
    this.formType = 'csp';
    this.selectedInddex = 0;
    this.uploadDocumentarr = [];
    this.uploadDocumentInsurance = [];
    this.formNamearray = [];
    this.allStates = [];
  }

  triggerFalseClick() {
  }

  ngOnInit() {
    this.getAllStates();
    this.getAllServices();
    if (this.csp && this.csp.nativeElement) {
      this.autoFillLocation('csp');
    }
    this.formInit();
    this.getFromQuestionsData();
    this.event.headerMenuTriggered.subscribe((res: any) => {
      if (res) {
        const element = document.querySelector('#nav-tabContent');
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
        this.registrationMenuChange(res);
      }
    });

    if (this.storageService.getcspStepData()) {
      if (this.storageService.getcspStepData().formNamearray.length > 0) {
        this.storageService.getcspStepData().formNamearray.map(item => {
          this.formNamearray.push(item);
        });
      }
      this.stepper.selectedIndex = 0;
    } else {
      this.stepper.selectedIndex = 1;
      this.selectedInddex = this.stepper.selectedIndex;
    }

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
  }

  ngAfterViewInit() {
    setTimeout(() => {
      AOS.init();
    }, 1000);
  }

  formInit() {
    this.basicInfoForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s\.]+ [a-zA-Z\s\.]{1,}\s*$/)]],
      // /^(\w+)( \w+)*$/
      mobile: ['', [Validators.required, Validators.minLength(10)]],
      // tslint:disable-next-line:max-line-length
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s._%+-]+@[a-z0-9\s.-]+\.[a-z\s]{2,66}\s*$/)]],
    });
    this.companyInfoForm = this._formBuilder.group({
      companyName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s\.]{1,}\s*$/)]],
      ein_number: ['', [Validators.required, Validators.minLength(9)]],
      address: ['', Validators.required],
      additionalAddress: ['', Validators.required],
      zipCode: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
    });
    this.businessContactForm = this._formBuilder.group({
      // tslint:disable-next-line:max-line-length
      business_email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s._%+-]+@[a-z0-9\s.-]+\.[a-z\s]{2,66}$/)]],
      business_phone: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.licensedTechniciansForm = this._formBuilder.group({
      licensed_employees: ['', Validators.required]
    });

    this.additionalStateForm = this._formBuilder.group({
      nationWide: [false],
      availability: ['']
    });

    this.insuranceInfoForm = this._formBuilder.group({
      contractor_licence_no: ['', Validators.required],
      contractor_licence_upload: ['', Validators.required],
      insurance_carrier: ['', Validators.required],
      policy_no: ['', Validators.required],
      policy_document: ['', Validators.required],
      Option_select: [false],
      choose_option: [false]
    });

    this.ServiceDiagnosisForm = this._formBuilder.group({
      fee: ['', Validators.required],
      factored: ['No', Validators.required]
    });

    this.preformServicesForm = this._formBuilder.group({
      items: ['', Validators.required],
    });

    this.commentBoxForm = this._formBuilder.group({
      comments: [''],
    });

    this.stepFinishForm = this._formBuilder.group({
      comments: [''],
    });

    this.contactForm = this._formBuilder.group({
      full_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s\.]+ [a-zA-Z\s\.]{1,}\s*$/)]],
      zip_code: ['', Validators.required],
      mobile_no: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s._%+-]+@[a-z0-9\s.-]+\.[a-z\s]{2,66}\s*$/)]],
      City: ['', Validators.required],
      State: ['', Validators.required],
    });
    this.newsLetter = this._formBuilder.group({
      newsLettermobilenum: ['', [Validators.required]],
      newsLetterzipcode: ['', Validators.required],
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

  getAllStates() {
    this.apiService.get('state/list').subscribe((res: any) => {
      if (res) {
        this.allStates = res.data;
        if (this.allStates.length > 0) {
          this.allStates.sort((a, b) => a.title.localeCompare(b.title));
        }
        this.allStates.map(item => {
          if (item.type === 'not_covered') {
            item.className = 'sanc';
          }
          if (item.type === 'cover') {
            item.className = 'sac';
          }
          if (item.type === 'processing') {
            item.className = 'swc';
          }
          return item;
        });
        this.filteredStates = this.allStates;
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

  isAlphabate(evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (!(charCode >= 65 && charCode <= 120) && (charCode !== 32 && charCode !== 0)) {
      evt.preventDefault();
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
    if (type === 'insurer') {
      this.insuranceInfoForm.controls.insurance_carrier.setValue(event.target.value.split('.')[0]);
    }
    if (type === 'policy_no') {
      this.insuranceInfoForm.controls.policy_no.setValue(event.target.value.split('.')[0]);
    }
    if (type === 'comments') {
      this.commentBoxForm.controls.comments.setValue(event.target.value.split('.')[0]);
    }
    if (type === 'conUname') {
      this.contactForm.controls.full_name.setValue(event.target.value.split('.')[0]);
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
    if (type === 'conUname') {
      this.contactForm.controls.full_name.setValue(event.target.value.trim());
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

  registrationMenuChange(tabType: string) {
    this.selectedInddex = 0;
    this.previousMatStepperData ? this.previousMatStepperData.reset() : '';
    this.formType = tabType;
    this.autoFillLocation(tabType);
    this.formInit();
    this.selectedUsers = [];
    this.selectedState = [];
    this.filteredStates.map(item => {
      if (item.selected) {
        delete item.selected;
      }
    });
    this.storageService.clearcspStepData();
    this.storageService.clearserviceStepData();
    this.storageService.clearFormStatusByUser();
    this.selectedUsers.map(item => {
      item.selected = !item.selected;
    });
    this.selectedState = [];
    this.selectedState.map(item => {
      item.selected = !item.selected;
    });
    if (this.formType === 'csp') {
      this.stepper.selectedIndex = 1;
    }
    if (this.formType === 'rep') {
      this.stepper1.selectedIndex = 0;
    }
    if (this.formType === 'title_agencies') {
      this.stepper2.selectedIndex = 0;
    }
    if (this.formType === 'vendors') {
      this.stepper3.selectedIndex = 0;
    }
    if (this.formType === 'affiliates') {
      this.stepper4.selectedIndex = 0;
    }
    if (this.formType !== 'csp') {
      this.companyInfoForm.controls.ein_number.clearValidators();
      this.companyInfoForm.controls.ein_number.updateValueAndValidity();
    }
  }

  getFromQuestionsData() {
    this.providersFormQuestion = {
      csp: [
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
      ],
      rep: [
        'Let’s begin with your full name, mobile number and your email address.',
        'letʼs proceed with getting your real estate company information:',
        'We do need your business contact information:',
        'What is the number of licensed real estate agents that are available at your company ?',
        'Do your agency provide services in any additional states:',
        'Please provide any additional comments',
        '',
      ],
      title_agencies: [
        'Let’s begin with your full name, mobile number and your email address.',
        'Letʼs proceed with getting your title company information:',
        'We do need your business contact information:',
        'What is the number agents that are available at your company ?',
        'Do your agency provide services in any additional states:',
        'Please provide any additional comments',
        '',
      ],
      vendors: [
        'Let’s begin with your full name, mobile number and your email address.',
        'letʼs proceed with getting your company information:',
        'We do need your business contact information:',
        'Do your company provide services in any additional states:',
        // tslint:disable-next-line:max-line-length
        'Please select the items you are licensed to preform services on from the following list:',
        'Please provide any additional comments',
        '',
      ],
      affiliates: [
        'Let’s begin with your full name, mobile number and your email address.',
        'Letʼs proceed with getting your affiliate company information:',
        'We do need your business contact information:',
        'Please provide any additional comments',
        '',
      ]
    };
    this.mapDataStatic = [
      {
        id: 'US-AL',
        value: 4447100,
        fill: null,
        isRegulated: 'soon',
        name: 'Alabama',
      },
      {
        id: 'US-AK',
        value: 626932,
        fill: null,
        isRegulated: 'covered',
        name: 'Alaska'
      },
      {
        id: 'US-AZ',
        value: 5130632,
        fill: null,
        isRegulated: 'soon',
        name: 'Arizona'
      },
      {
        id: 'US-AR',
        value: 2673400,
        fill: null,
        isRegulated: 'soon',
        name: 'Arkansas'
      },
      {
        id: 'US-CA',
        value: 33871648,
        fill: null,
        isRegulated: 'not-covered',
        name: 'California'
      },
      {
        id: 'US-CO',
        value: 4301261,
        fill: null,
        isRegulated: 'covered',
        name: 'Colorado'
      },
      {
        id: 'US-CT',
        value: 3405565,
        fill: null,
        isRegulated: 'soon',
        name: 'Connecticut'
      },
      {
        id: 'US-DE',
        value: 783600,
        fill: null,
        isRegulated: 'covered',
        name: 'Delaware'
      },
      {
        id: 'US-DC',
        value: 493782,
        fill: null,
        isRegulated: 'soon',
        name: 'District of Columbia'
      },
      {
        id: 'US-FL',
        value: 15982378,
        fill: null,
        isRegulated: 'soon',
        name: 'Florida'
      },
      {
        id: 'US-GA',
        value: 8186453,
        fill: null,
        isRegulated: 'covered',
        name: 'Georgia'
      },
      {
        id: 'US-HI',
        value: 1211537,
        fill: null,
        isRegulated: 'soon',
        name: 'Hawaii'
      },
      {
        id: 'US-ID',
        value: 1293953,
        fill: null,
        isRegulated: 'covered',
        name: 'Idaho'
      },
      {
        id: 'US-IL',
        value: 12419293,
        fill: null,
        isRegulated: 'soon',
        name: 'Illinois'
      },
      {
        id: 'US-IN',
        value: 6080485,
        fill: null,
        isRegulated: 'covered',
        name: 'Indiana'
      },
      {
        id: 'US-IA',
        value: 2926324,
        fill: null,
        isRegulated: 'soon',
        name: 'Iowa'
      },
      {
        id: 'US-KS',
        value: 2688418,
        fill: null,
        isRegulated: 'covered',
        name: 'Kansas'
      },
      {
        id: 'US-KY',
        value: 4041769,
        fill: null,
        isRegulated: 'covered',
        name: 'Kentucky'
      },
      {
        id: 'US-LA',
        value: 4468976,
        fill: null,
        isRegulated: 'soon',
        name: 'Louisiana'
      },
      {
        id: 'US-ME',
        value: 1274923,
        fill: null,
        isRegulated: 'soon',
        name: 'Maine'
      },
      {
        id: 'US-MD',
        value: 5296486,
        fill: null,
        isRegulated: 'soon',
        name: 'Maryland'
      },
      {
        id: 'US-MA',
        value: 6349097,
        fill: null,
        isRegulated: 'soon',
        name: 'Massachusetts'
      },
      {
        id: 'US-MI',
        value: 9938444,
        fill: null,
        isRegulated: 'covered',
        name: 'Michigan'
      },
      {
        id: 'US-MN',
        value: 4919479,
        fill: null,
        isRegulated: 'soon',
        name: 'Minnesota'
      },
      {
        id: 'US-MS',
        value: 2844658,
        fill: null,
        isRegulated: 'covered',
        name: 'Mississippi'
      },
      {
        id: 'US-MO',
        value: 5595211,
        fill: null,
        isRegulated: 'covered',
        name: 'Missouri'
      },
      {
        id: 'US-MT',
        value: 902195,
        fill: null,
        isRegulated: 'covered',
        name: 'Montana'
      },
      {
        id: 'US-NE',
        value: 1711263,
        fill: null,
        isRegulated: 'covered',
        name: 'Nebraska'
      },
      {
        id: 'US-NV',
        value: 1998257,
        fill: null,
        isRegulated: 'soon',
        name: 'Nevada'
      },
      {
        id: 'US-NH',
        value: 1235786,
        fill: null,
        isRegulated: 'soon',
        name: 'New Hampshire'
      },
      {
        id: 'US-NJ',
        value: 8414350,
        fill: null,
        isRegulated: 'covered',
        name: 'New Jersey'
      },
      {
        id: 'US-NM',
        value: 1819046,
        fill: null,
        isRegulated: 'soon',
        name: 'New Mexico'
      },
      {
        id: 'US-NY',
        value: 18976457,
        fill: null,
        isRegulated: 'soon',
        name: 'New York'
      },
      {
        id: 'US-NC',
        value: 8049313,
        fill: null,
        isRegulated: 'covered',
        name: 'North Carolina'
      },
      {
        id: 'US-ND',
        value: 642200,
        fill: null,
        isRegulated: 'covered',
        name: 'North Dakota'
      },
      {
        id: 'US-OH',
        value: 11353140,
        fill: null,
        isRegulated: 'covered',
        name: 'Ohio'
      },
      {
        id: 'US-OK',
        value: 3450654,
        fill: null,
        isRegulated: 'soon',
        name: 'Oklahoma'
      },
      {
        id: 'US-OR',
        value: 3421399,
        fill: null,
        isRegulated: 'soon',
        name: 'Oregon'
      },
      {
        id: 'US-PA',
        value: 12281054,
        fill: null,
        isRegulated: 'covered',
        name: 'Pennsylvania'
      },
      {
        id: 'US-RI',
        value: 1048319,
        fill: null,
        isRegulated: 'covered',
        name: 'Rhode Island'
      },
      {
        id: 'US-SC',
        value: 4012012,
        fill: null,
        isRegulated: 'soon',
        name: 'South Carolina'
      },
      {
        id: 'US-SD',
        value: 754844,
        fill: null,
        isRegulated: 'covered',
        name: 'South Dakota'
      },
      {
        id: 'US-TN',
        value: 5689283,
        fill: null,
        isRegulated: 'covered',
        name: 'Tennessee'
      },
      {
        id: 'US-TX',
        value: 20851820,
        fill: null,
        isRegulated: 'soon',
        name: 'Texas'
      },
      {
        id: 'US-UT',
        value: 2233169,
        fill: null,
        isRegulated: 'covered',
        name: 'Utah'
      },
      {
        id: 'US-VT',
        value: 608827,
        fill: null,
        isRegulated: 'soon',
        name: 'Vermont'
      },
      {
        id: 'US-VA',
        value: 7078515,
        fill: null,
        isRegulated: 'soon',
        name: 'Virginia'
      },
      {
        id: 'US-WA',
        value: 5894121,
        fill: null,
        isRegulated: 'not-covered',
        name: 'Washington'
      },
      {
        id: 'US-WV',
        value: 1808344,
        isRegulated: 'covered',
        name: 'West Virginia'
      },
      {
        id: 'US-WI',
        value: 5363675,
        fill: null,
        isRegulated: 'not-covered',
        name: 'Wisconsin'
      },
      {
        id: 'US-WY',
        value: 493782,
        fill: null,
        isRegulated: 'soon',
        name: 'Wyoming'
      }
    ];
  }

  goBack(stepper: MatStepper, formControlName: any, manualstep) {
    this.selectedInddex = manualstep;
    stepper.previous();
  }

  validateForm(stepper: any, formGroupName: any, manualStepperCount: number, nextGroupname: any) {
    this.previousMatStepperData = stepper;
    if (this[formGroupName].valid) {
      if (manualStepperCount === 9) {
        if (Object.keys(this.formData).length > 0) {
          this.formData = Object.assign({}, this.formData, this[formGroupName].value);
        } else {
          this.formData = this[formGroupName].value;
        }
        this.submitForm(this.formData).then(() => {
          stepper.next();
          this.selectedInddex = manualStepperCount;
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
        this.selectedInddex = stepper._selectedIndex - 1;
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
  setstepDatatocookie(formData, formGroupName, stepper: any, formNamearray) {
    if (formData.items && formData.items.length > 0) {
      const serviceStepData = {
        items: formData.items
      };
      this.storageService.setserviceStepData(serviceStepData);
      delete formData.items;
    }
    const collectformdata = formData;
    const Collectdata = {
      formData: collectformdata,
      // tslint:disable-next-line:no-string-literal
      selectedInddex: stepper['_selectedIndex'],
      formGroupName,
      formNamearray,
      formType: this.formType
    };
    this.storageService.setcspStepData(Collectdata);
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
          this.storageService.clearcspStepData();
          this.storageService.clearserviceStepData();
          this.storageService.clearFormStatusByUser();
          this.apiService.alert(res.message, 'success');
          resolve();
        } else {
          this.registrationMenuChange(this.formType);
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

  serarchService(event) {
    const input = (event.target as HTMLInputElement).value;
    if (input === '') {
      this.filteredService = this.allServices;
    } else {
      this.filteredService = this.allServices.filter((d: any) => d.title.toLowerCase().includes(input.toLowerCase()));
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

  uploadDocumentInit(e, uploadedFile: any) {
    for (let i = 0; i < uploadedFile.files.length; i++) {
      if (e.target.files[i].type === 'application/pdf') {
        const file: File = uploadedFile.files[i];
        this.uploadDocumentarr.push(file);
        this.insuranceInfoForm.patchValue({ contractor_licence_upload: this.uploadDocumentarr });
      } else {
        this.apiService.alert('Only .PDF are supported.', 'error');
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
        this.apiService.alert('Only .PDF are supported.', 'error');
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

  optionClicked(event: Event, user: any) {
    event.stopPropagation();
    this.toggleSelection(user);
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
  }

  accessForm(ev) {
    if (ev === 'acsess') {
      this.storageService.SetFormStatusByUser('Editable');
      if (this.storageService.getcspStepData().formData.address) {
        this.addressSeldcted = true;
      }
      if (this.companyInfoForm.controls.additionalAddress.value === null || this.companyInfoForm.controls.additionalAddress.value === '') {
        this.companyInfoForm.controls.additionalAddress.clearValidators();
        this.companyInfoForm.controls.additionalAddress.updateValueAndValidity();
      }
      if (this.storageService.getcspStepData() !== undefined) {
        this.formType = this.storageService.getcspStepData().formType;
        this.autoFillLocation(this.storageService.getcspStepData().formType);
        if (this.storageService.getcspStepData().formType !== 'csp') {
          this.companyInfoForm.controls.ein_number.clearValidators();
          this.companyInfoForm.controls.ein_number.updateValueAndValidity();
        }
        if (this.storageService.getcspStepData().formType === 'csp') {
          this.stepper.selectedIndex = 1;
        }
        if (this.storageService.getcspStepData().formType === 'rep') {
          this.stepper1.selectedIndex = 0;
        }
        if (this.storageService.getcspStepData().formType === 'title_agencies') {
          this.stepper2.selectedIndex = 0;
        }
        if (this.storageService.getcspStepData().formType === 'vendors') {
          this.stepper3.selectedIndex = 0;
        }
        if (this.storageService.getcspStepData().formType === 'affiliates') {
          this.stepper4.selectedIndex = 0;
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
          if (this.storageService.getcspStepData().formNamearray.length > 0) {
            this.storageService.getcspStepData().formNamearray.map(item => {
              if (name === item) {
                if (name !== 'preformServicesForm') {
                  this[name].patchValue(this.storageService.getcspStepData().formData);
                } else {
                  this.preformServicesForm.patchValue(this.storageService.getserviceStepData());
                }
              }
            });
          }
        });
        if (this.storageService.getserviceStepData().items) {
          this.storageService.getserviceStepData().items.map(item => {
            this.selectedUsers.push(item);
          });
          this.preformServicesForm.controls.items.setValue(this.selectedUsers);
          this.selectedUsers.map(result => {
            const i = this.allServices.findIndex(value => value.title === result.title);
            this.allServices[i].selected = true;
            this.filteredService = this.allServices;
          });
        }
        if (this.storageService.getcspStepData().formData.availability) {
          this.storageService.getcspStepData().formData.availability.map(item => {
            this.selectedState.push(item);
          });
          this.additionalStateForm.controls.availability.setValue(this.selectedState);
          this.selectedState.map(result => {
            const i = this.filteredStates.findIndex(value => value.title === result.title);
            this.filteredStates[i].selected = true;
          });
        }
      } else {
        this.formType = 'csp';
        this.selectedInddex = 0;
      }
    } else if (ev === 'New') {
      this.stepper.selectedIndex = 1;
      this.stepper1.selectedIndex = 1;
      this.stepper2.selectedIndex = 1;
      this.stepper3.selectedIndex = 1;
      this.stepper4.selectedIndex = 1;
      this.storageService.clearcspStepData();
      this.storageService.clearserviceStepData();
      this.storageService.clearFormStatusByUser();
    }
  }


  stateSel(event, type) {
    if (event && type === 'list') {
      event.stateID = event.id;
      delete event.id;
      event.state = event.stateID.split('-').pop();
    }
    localStorage.setItem('selState', JSON.stringify(event));
    // this.router.navigate(['state-artical']);
  }


  scrollToDiv(tabname, formType: string) {
    this.formType = formType;
    const element = document.querySelector(tabname);
    element.scrollIntoView({ behavior: 'smooth' });
  }

  contactUs() {
    if (this.contactForm.valid) {

    } else {
      this.contactForm.markAllAsTouched();
    }
  }
  scrollto(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  @HostListener('click', ['$event'])
  onClickBtn(event) {
    if (event.target === document.getElementsByClassName('selectstate').item(0)) {
      return false;
    } else {
      this.status = false;
    }
  }

}
