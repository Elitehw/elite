import { MapsAPILoader } from '@agm/core';
import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { ApiService } from './../../services/api.service';
import { buyhome } from '../../metainfo';
import { StorageService } from 'src/app/services/storage.service';
import { LocationStrategy } from '@angular/common';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { EventService } from 'src/app/services/event.service';
declare var google;
import { parsePhoneNumber, CountryCode } from 'libphonenumber-js/min';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewInit, OnDestroy {
  stepOneGroup: FormGroup;
  stepProcess: any;
  numbercorrection: boolean;
  varificationCode = new FormControl('', [Validators.required, Validators.minLength(4)]);
  decribeYou: FormControl = new FormControl('', [Validators.required]);
  purchasinghome = new FormControl('', [Validators.required]);
  wanttoshareinvoice = new FormControl('', [Validators.required]);
  closingDate = new FormControl('');
  stepFiveformGroup: FormGroup;
  realStateAgentaddress: FormGroup;
  invoiceaddress: FormGroup;
  addressSeldcted: boolean;
  checkOutProcessStart: boolean;
  forInvoiceForm: FormGroup;
  @ViewChild('search') search: ElementRef;
  @ViewChild('search2') search2: ElementRef;
  @ViewChild('search3') search3: ElementRef;
  @ViewChild('address', { static: false }) address: ElementRef;
  minDate: Date;
  datatokeep: any;
  quoteId: any;
  userIp: any;
  isVerified: any;
  cartValuetoedit: any;
  phoneType: string;
  allStates: any;
  isStateAvailable: boolean;
  isAvailablemsg: boolean;
  constructor(
    private api: ApiService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private meta: Meta,
    private storage: StorageService,
    private location: LocationStrategy,
    private event: EventService,
    private builder: FormBuilder
  ) {
    this.minDate = new Date();
    this.checkOutProcessStart = false;
    this.updatemetaInfo(buyhome);
    this.datatokeep = [];
    this.isStateAvailable = false;
  }

  ngOnInit(): void {
    this.api.getIpAddress().subscribe((res: any) => {
      if (res) {
        this.userIp = res.ip;
      }
    });
    this.getAllStates();
    this.forminit();
    this.event.getcarteditValue.subscribe(res => {
      if (res) {
        this.cartValuetoedit = res;
        this.patchData();
      }
    });
    this.preventBackButton();
    this.stepProcess = {
      stepOne: false, stepTwo: false, stepThree: false, stepFour: false, stepFive: false,
    };
    this.stepProcess.stepOne = true;
    this.stepOneGroup.controls.mobile_number.valueChanges.subscribe(res => {
      if (res) {
        this.checkNumberType(res);
      }
    });
  }
  getAllStates() {
    this.api.get('state/list').subscribe((res: any) => {
      if (res) {
        this.allStates = res.data.filter(state => state.type === 'cover');
      }
    });
  }
  get invoiceArr() {
    return this.forInvoiceForm.get('invoiceGroup') as FormArray;
  }
  checkNumberType(value) {
    if (value.length === 10) {
      const country = 'US';
      const phoneNumber = parsePhoneNumber(('+1' + value) + '', country as CountryCode);
      this.phoneType = phoneNumber.getType();
    }

  }
  newInvoiceobj(): FormGroup {
    return this.builder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required,
      Validators.pattern(/^[a-zA-Z0-9\s._%+-]+@[a-z0-9\s.-]+\.[a-z\s]{2,66}\s*$/)]],
      mobile_number: ['', [Validators.required]]
    }
    );
  }
  getcartitemdetail(cartItemid) {
    this.api.post(`quote/details/${cartItemid}`).subscribe((res: any) => {
      if (res.status === 200) {

      }
    })
  }
  preventBackButton() {
    history.pushState(null, null, location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }
  forminit() {
    this.stepOneGroup = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      mobile_number: new FormControl('', [Validators.required, Validators.minLength(10)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s._%+-]+@[a-z0-9\s.-]+\.[a-z\s]{2,66}\s*$/)]),
      property_zip_code: new FormControl('', [Validators.required]),
      property_street_address: new FormControl('', [Validators.required]),
      mobile_number_type: new FormControl('mobile', [Validators.required])
    });
    this.stepFiveformGroup = new FormGroup({
      streetAddress: new FormControl('', [Validators.required]),
      apt_number: new FormControl(''),
      zip_code: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required])
    });
    this.realStateAgentaddress = new FormGroup({
      streetAddress: new FormControl('', [Validators.required]),
      apt_number: new FormControl(''),
      zip_code: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      mobile_number: new FormControl('', [Validators.required])
    });

    this.forInvoiceForm = new FormGroup({
      invoiceGroup: new FormArray([this.newInvoiceobj()])
    });
    this.invoiceaddress = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s._%+-]+@[a-z0-9\s.-]+\.[a-z\s]{2,66}\s*$/)]),
      mobile_number: new FormControl('', [Validators.required]),
    });
  }
  patchData() {
    if (this.cartValuetoedit) {
      const num = this.cartValuetoedit.mobile_number;
      const valuetopatch = this.cartValuetoedit;
      if (valuetopatch.mobile_number.includes(environment.countryCode)) {
        // for india
        const firstthree = num.slice(3, 6);
        const midThree = num.slice(6, 9);
        const lst = num.slice(9, 13);
        // For us
        // const firstthree = num.slice(2, 5);
        // const midThree = num.slice(5, 8);
        // const lst = num.slice(8, 12);
        valuetopatch.mobile_number = `${firstthree}${midThree}${lst}`;
      }
      this.stepOneGroup.patchValue(valuetopatch);
      this.decribeYou.patchValue(valuetopatch.property_user_type);
      console.log(valuetopatch);
      console.log(this.stepFiveformGroup);
      if (valuetopatch.step4.streetAddress) {
        this.stepFiveformGroup.patchValue(valuetopatch.step4);
      } else {
        this.stepFiveformGroup.patchValue({
          streetAddress: valuetopatch.property_apartment,
          zip_code: valuetopatch.property_zip_code,
          city: valuetopatch.property_city,
          state: valuetopatch.property_state
        });
      }
      this.purchasinghome.patchValue(valuetopatch.sub1step4.purchase_plan);
      this.closingDate.patchValue(new Date(valuetopatch.sub3step4.estimatedClosingDate));
      this.wanttoshareinvoice.patchValue(valuetopatch.sub4step4.Shareinvoice);
      this.invoiceaddress.patchValue(valuetopatch.sub6step4);
      for (const [index, val] of valuetopatch.sub5step4.entries()) {
        if (index !== 0) {
          this.invoiceArr.push(this.newInvoiceobj());
        }
      }
      this.invoiceArr.patchValue(valuetopatch.sub5step4);
    }
  }
  ngAfterViewInit(): void {
    if (this.address && this.address.nativeElement) {
      this.autoFillLocation('address');
    }
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.api.setpAgetitle(metainfo.title);
  }

  editOrNewProcess(nextStepname, previousStepName, formGroupname) {
    if (this.allStates.length > 0) {
      if (this[formGroupname].valid) {
        this.allStates.forEach(state => {
          if (state.title.toLowerCase() === this.stepFiveformGroup.controls.state.value.toLowerCase()) {
            this.isStateAvailable = true;
          }
        });
      }
    }
    if (this.cartValuetoedit) {
      const value = this[formGroupname].value;
      if (value.mobile_number !== this.cartValuetoedit.mobile_number) {
        value.second_mobile_number = environment.countryCode + value.mobile_number;
        value.mobile_number = environment.countryCode + this.cartValuetoedit.mobile_number;
      }
      value.mobile_number = environment.countryCode + this.cartValuetoedit.mobile_number;
      value.user_ip = this.userIp;
      value.property_state = this.stepFiveformGroup.controls.state.value ?
        this.stepFiveformGroup.controls.state.value : this.cartValuetoedit.property_state;
      value.property_city = this.stepFiveformGroup.controls.city.value ?
        this.stepFiveformGroup.controls.city.value : this.cartValuetoedit.property_city;
      value.property_apartment = this.stepFiveformGroup.controls.streetAddress.value ?
        this.stepFiveformGroup.controls.streetAddress.value : this.cartValuetoedit.property_apartment;
      this.quoteId = this.cartValuetoedit._id;
      if (this[formGroupname].valid) {
        if (this.stepFiveformGroup.valid) {
          if (this.isStateAvailable) {
            this.event.setLoaderEmmit(false);
            this.savequotes(value).then((res: any) => {
              if (res.status === 200) {
                this.api.alert(res.message, 'success');
                this.isVerified = res.data.is_verified;
                this.continue('stepFour', previousStepName, formGroupname);
                this.storage.savecheckoutdata([{ step1: this[formGroupname].value }]);
                this.event.cartnumberemmit.next(true);
                this.isStateAvailable = false;
              }
            });
          } else {
            this.api.alert(`We do not offer services in ${this.stepFiveformGroup.controls.state.value}.`, 'warning');
            this.isAvailablemsg = true;
          }
        } else {
          this.stepFiveformGroup.markAllAsTouched();
        }
      } else {
        this[formGroupname].markAllAsTouched();
      }
    } else {
      this.startnewprocess(nextStepname, previousStepName, formGroupname);
    }
  }

  // Continue 1
  startnewprocess(nextStepname, previousStepName, formGroupname) {
    let browserIp;
    if (this[formGroupname].valid) {
      return new Promise<void>((resolve, rejects) => {
        if (this.storage.getuniquecodeforbrowser()) {
          browserIp = this.storage.getuniquecodeforbrowser();
        }
        this.api.post('quote/exist-checking', {
          mobile_number: environment.countryCode + this[formGroupname].value.mobile_number,
          user_ip: this.userIp,
          browser_ip: browserIp
        }).subscribe(
          (res: any) => {
            if (res.status === 200) {
              this.isVerified = res.isVerified;
              if (res.isVerified) {
                this.event.setLoaderEmmit(false);
                nextStepname = 'stepFour';
                this.event.cartnumberemmit.next(true);
              } else {
                nextStepname = 'stepTwo';
              }
              resolve();
            } else {
              console.log(this[formGroupname].value);
              this.storage.savecheckoutdata([{ step1: this[formGroupname].value }]);
              this.event.cartnumberemmit.next(true);
              resolve();
            }
          },
          (err) => {
            if (err) {
              rejects();
              this.api.alert(err.message ? err.message : 'Somthig went wrong', 'error');
            }
          });
      }).then(() => {
        if (this[formGroupname].value.mobile_number.includes(environment.countryCode)) {
          this[formGroupname].value.mobile_number = this[formGroupname].value.mobile_number;
        } else {
          this[formGroupname].value.mobile_number = environment.countryCode + this[formGroupname].value.mobile_number;
        }
        this[formGroupname].value.link_mobile_number = this[formGroupname].value.mobile_number;
        this[formGroupname].value.user_ip = this.userIp;
        this[formGroupname].value.property_state = this.stepFiveformGroup.controls.state.value;
        this[formGroupname].value.property_city = this.stepFiveformGroup.controls.city.value;
        this[formGroupname].value.property_apartment = this.stepFiveformGroup.controls.streetAddress.value;
        if (this.stepFiveformGroup.valid) {
          if (this.isStateAvailable) {
            this.api.post('quote/save', this[formGroupname].value).subscribe(
              (res: any) => {
                if (res.status === 200) {
                  this.storage.savecheckoutdata([{ step1: this[formGroupname].value }]);
                  this.quoteId = res.data._id;
                  this.api.alert(res.message, 'success');
                  this.continue(nextStepname, previousStepName, formGroupname);
                  this.isStateAvailable = false;
                } else {
                  this.api.alert(res.message, 'info');
                }
              },
              (err) => {
                if (err) {
                  this.api.alert(err.message ? err.message : 'Somthig went wrong', 'error');
                }
              });
          } else {
            this.api.alert(`We do not offer services in ${this.stepFiveformGroup.controls.state.value}.`, 'warning');
            this.isAvailablemsg = true;
          }
        } else {
          this.stepFiveformGroup.markAllAsTouched();
        }
      });
    } else {
      this[formGroupname].markAllAsTouched();
    }
  }
  // Continue 2
  sendOtp(nextStepname, previousStepName, type) {
    if (type === 'send') {
      const data = {
        mobile_number: this.stepOneGroup.value.mobile_number
      };
      this.api.post('quote/sendOtp', data).subscribe((res: any) => {
        if (res.status === 200) {
          this.api.alert(res.message, 'success');
          this.next(nextStepname, previousStepName);
        } else {
          this.api.alert(res.message, 'info');
        }
      }, err => {
        if (err) {
          this.api.alert(err.message ? err.message : 'Somthing went wrong', 'error');
        }
      });
    } else if ('correctnum') {
      this.api.alert('Successfully updated', 'success');
    } else {
      this.api.alert('Verification code re-sent successfully', 'success');
    }
  }
  // Continue 3
  verify(nextStepname, previousStepName) {
    let browserid;
    if (this.varificationCode.valid) {
      if (!this.storage.getuniquecodeforbrowser()) {
        let now = Date.now().toString();
        now += now + Math.floor(Math.random() * 10);
        browserid = now.slice(8, 14);
      } else {
        browserid = this.storage.getuniquecodeforbrowser();
      }
      const data = {
        mobile_number: this.stepOneGroup.value.mobile_number,
        otp: this.varificationCode.value,
        browser_ip: browserid,
        user_ip: this.userIp,
      };
      this.event.setLoaderEmmit(false);
      this.api.post('quote/verifyOtp', data).subscribe((res: any) => {
        if (res.status === 200) {
          this.event.cartnumberemmit.next(true);
          this.next(nextStepname, previousStepName);
          this.api.alert(res.message, 'success');
          this.storage.saveuniquecodeforbrowser(browserid);
        } else {
          this.api.alert(res.message, 'info');
        }
      });

    } else {
      this.varificationCode.markAsTouched();
    }
  }
  // Continue 4  Continue 5-1
  chooseuserType(nextStepname, previousStepName, formGroupname) {
    if (this[formGroupname].valid) {
      this.next(nextStepname, previousStepName);
      if (formGroupname === 'decribeYou') {
        this.savequotes({ property_user_type: this[formGroupname].value });
      } else {
        this.savequotes({ step4: this[formGroupname].value });
      }
      if (formGroupname !== 'decribeYou' &&
        (this.decribeYou.value.toLowerCase() === 'homeowner' || this.decribeYou.value.toLowerCase() === 'renter')) {
        this.checkOutProcessStart = true;
        this.stepProcess[nextStepname] = false;
      }
    } else {
      this[formGroupname].markAllAsTouched();
    }
  }
  // Continue 5-2 Continue 5-3 Continue 5-4 Continue 6 Continue 7 Continue 8 Continue 9
  continue(nextStepname, previousStepName, formGroupname) {
    if (this[formGroupname].valid) {
      if (formGroupname === 'wanttoshareinvoice') {
        if (this[formGroupname].value === 'yes') {
          this.next(nextStepname, previousStepName);
        } else {
          this.checkOutProcessStart = true;
          this.stepProcess.stepNine = false;
        }
        this.savequotes({ sub4step4: { Shareinvoice: this[formGroupname].value } });
      } else {
        if (formGroupname === 'purchasinghome') {
          this.savequotes({ sub1step4: { purchase_plan: this[formGroupname].value } });
        } else if (formGroupname === 'stepFiveformGroup') {
          this.savequotes({ sub2step4: this[formGroupname].value });
        } else if (formGroupname === 'closingDate') {
          this.savequotes({ sub3step4: { estimatedClosingDate: moment(this[formGroupname].value).format('MM/DD/YYYY') } });
        } else if (formGroupname === 'invoiceaddress') {
          this.savequotes({ sub6step4: this[formGroupname].value });
        }
        this.next(nextStepname, previousStepName);
      }
    } else {
      this[formGroupname].markAllAsTouched();
    }
  }
  // Continue 10
  continueTofinalstep(nextStepname, previousStepName, formGroupname) {
    if (this[formGroupname].valid) {
      const arrayVal = this[formGroupname].value.invoiceGroup;
      // if (this.realStateAgentaddress.valid) {
      this.checkOutProcessStart = true;
      this.stepProcess.stepTen = false;
      this.savequotes({ sub5step4: arrayVal });
      // } else {
      //   this.realStateAgentaddress.markAllAsTouched();
      // }
    } else {
      this[formGroupname].markAllAsTouched();
    }
  }
  stepfourBack(nextStep) {
    if (this.isVerified) {
      this.back('stepOne', nextStep);
    } else {
      this.back('stepTwo', nextStep);
    }
  }
  updatelocation(type) {
    this.autoFillLocation(type);
  }

  formateNum(num) {
    const firstthree = num.slice(2, 5);
    const midThree = num.slice(5, 8);
    const lst = num.slice(8, 12);
    return `(${firstthree})${midThree}-${lst}`;
  }
  restrictSpace(event) {
    if (event.target.value.match(/\s/g)) {
      event.target.value = event.target.value.replace(/\s/g, '');
    }
  }
  allowAlphabate(event) {
    const regex = new RegExp('^[a-zA-Z ]+$');
    const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }
  next(nextStep, previousStep) {
    this.stepProcess[nextStep] = true;
    this.stepProcess[previousStep] = false;
  }
  back(previousStep, nextStep) {
    this.stepProcess[nextStep] = false;
    this.stepProcess[previousStep] = true;
  }
  autoFillLocation(element) {
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
          this.stepFiveformGroup.setValue({
            streetAddress: '',
            apt_number: '',
            zip_code: '',
            city: '',
            state: ''
          });
          const place = autocomplete.getPlace();
          // this.stepOneGroup.get('property_street_address').setValue('');
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < place.address_components.length; i++) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < place.address_components[i].types.length; j++) {
              if (element === 'search' || element === 'search2' || element === 'search3') {
                if (place.address_components[i].types[j] === 'route') {
                  if (element === 'search3') {
                    this.realStateAgentaddress.patchValue({ streetAddress: place.name });
                  } else {
                    this.stepFiveformGroup.patchValue({ streetAddress: place.name });
                  }
                }

                if (place.address_components[i].types[j] === 'postal_code') {
                  if (element === 'search3') {
                    this.realStateAgentaddress.patchValue({ zip_code: place.address_components[i].long_name });
                  } else {
                    this.stepFiveformGroup.patchValue({ zip_code: place.address_components[i].long_name });
                  }
                }
                if (place.address_components[i].types[j] === 'locality') {
                  if (element === 'search3') {
                    this.realStateAgentaddress.patchValue({ city: place.address_components[i].long_name });
                  } else {
                    this.stepFiveformGroup.patchValue({ city: place.address_components[i].long_name });
                  }
                }
                if (place.address_components[i].types[j] === 'sublocality_level_1') {
                  if (element === 'search3') {
                    this.realStateAgentaddress.patchValue({ city: place.address_components[i].long_name });
                  } else {
                    this.stepFiveformGroup.patchValue({ city: place.address_components[i].long_name });
                  }
                }
                if (place.address_components[i].types[j] === 'sublocality') {
                  if (element === 'search3') {
                    this.realStateAgentaddress.patchValue({ city: place.address_components[i].long_name });
                  } else {
                    this.stepFiveformGroup.patchValue({ city: place.address_components[i].long_name });
                  }
                }
                if (place.address_components[i].types[j] === 'administrative_area_level_1') {
                  if (element === 'search3') {
                    this.realStateAgentaddress.patchValue({ state: place.address_components[i].long_name });
                  } else {
                    this.stepFiveformGroup.patchValue({ state: place.address_components[i].long_name });
                  }
                }
              }
            }
          }
          if (element !== 'search' && element !== 'search2' && element !== 'search3') {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < place.address_components.length; i++) {
              // tslint:disable-next-line:prefer-for-of
              for (let j = 0; j < place.address_components[i].types.length; j++) {
                if (place.address_components[i].types[j] === 'postal_code') {
                  this.stepOneGroup.patchValue({ property_zip_code: place.address_components[i].long_name });
                  this.stepFiveformGroup.patchValue({ zip_code: place.address_components[i].long_name });
                }
                if (place.address_components[i].types[j] === 'route') {
                  this.stepFiveformGroup.patchValue({ streetAddress: place.name });
                }
                if (place.address_components[i].types[j] === 'locality') {
                  this.stepFiveformGroup.patchValue({ city: place.address_components[i].long_name });
                }
                if (place.address_components[i].types[j] === 'sublocality_level_1') {
                  this.stepFiveformGroup.patchValue({ city: place.address_components[i].long_name });
                }
                if (place.address_components[i].types[j] === 'sublocality') {
                  this.stepFiveformGroup.patchValue({ city: place.address_components[i].long_name });
                }
                if (place.address_components[i].types[j] === 'administrative_area_level_1') {
                  this.stepFiveformGroup.patchValue({ state: place.address_components[i].long_name });
                }
              }
            }
            this.stepOneGroup.patchValue({ property_street_address: place.formatted_address });
          }
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          console.log(this.stepFiveformGroup.value);
          console.log(this.stepOneGroup.value);
        });
      });

    });
  }

  chooseuserPlantype(nextStepname, previousStepName, formGroupname) {
    if (this[formGroupname].valid) {
      this.next(nextStepname, previousStepName);
    } else {
      this[formGroupname].markAllAsTouched();
    }
  }
  backfromcheckoutpage(event) {
    if (event) {
      if (this.decribeYou.value.toLowerCase() === 'homeowner' || this.decribeYou.value.toLowerCase() === 'renter') {
        this.checkOutProcessStart = false;
        this.stepProcess.stepFive = true;
      }
      if (this.decribeYou.value.toLowerCase() === 'home buyer' || this.decribeYou.value.toLowerCase() === 'home seller'
        || this.decribeYou.value.toLowerCase() === 'real estate professional' || this.decribeYou.value.toLowerCase() === 'title agent') {
        if (this.wanttoshareinvoice.value === 'yes') {
          this.checkOutProcessStart = false;
          this.stepProcess.stepTen = true;
        } else {
          this.checkOutProcessStart = false;
          this.stepProcess.stepNine = true;
        }
      }
    }
  }
  savequotes(value) {
    return new Promise<void>((resolve, rejects) => {
      const api = this.api.post(`quote/update/${this.quoteId}`, value);
      api.subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            resolve(res);
          } else {
            resolve(res);
          }
        },
        error: (err) => { if (err) { } },
        complete: () => { }
      });
    });
  }
  addAddressField() {
    this.invoiceArr.push(this.newInvoiceobj());
  }
  removeAddress(invoiceindex) {
    this.invoiceArr.removeAt(invoiceindex);
  }
  ngOnDestroy(): void {
  }
}


