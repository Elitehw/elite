import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';
import { warantyQuotes } from '../../metainfo';
import * as _ from 'underscore';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DefaultComponent } from '../../modal/default/default.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  panelOpenState = false;
  show: boolean;
  forMultiplemobileNum: FormGroup;
  cartlist: any;
  isVerified: any;
  isOtpsection: boolean;
  verificatonrequired: boolean;
  mobilenumber = new FormControl('', [Validators.required, Validators.minLength(10)]);
  varificationCode = new FormControl('', [Validators.required, Validators.minLength(4)]);
  linkMobileNumber = new FormControl('', [Validators.required, Validators.minLength(10)]);
  isquoteAvailable: boolean;
  totalcost: any;
  chckoutitemlist: any;
  currenDate: string;
  linkAnotherNumber: boolean;
  effectivedateendDate: string;
  forOtpVerifcation: FormGroup;
  linkNumberOtpsectionEnable: boolean;
  linkId: any;
  linkIdforOtp: any;
  linkednumberArray: any;
  userValue: any;
  linknumberForm: FormGroup;
  userIp: any;
  constructor(
    private meta: Meta,
    private api: ApiService,
    private storage: StorageService,
    private event: EventService,
    private router: Router,
    private builder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.updatemetaInfo(warantyQuotes);
    this.cartlist = [];
    this.isOtpsection = false;
    this.verificatonrequired = false;
    this.isquoteAvailable = false;
    this.linkNumberOtpsectionEnable = false;
    this.chckoutitemlist = [];
    this.totalcost = 0;
    // For effective term Date
    this.currenDate = moment(new Date()).format('MM/DD/YYYY');
    const newDate = new Date();
    this.effectivedateendDate = moment(newDate.setDate(newDate.getDate() + 30)).format('MM/DD/YYYY');
  }

  ngOnInit(): void {
    this.api.getIpAddress().subscribe((res: any) => {
      if (res) {
        this.userIp = res.ip;
      }
    });
    this.patchData();
    this.linknumberForm = new FormGroup({
      otpGroup: new FormArray([]),
      mobilenumberNode: new FormArray([this.mobilenumobj()])
    });
  }
  get otpArray() {
    return this.linknumberForm.get('otpGroup') as FormArray;
  }
  get mobileNumberArray() {
    return this.linknumberForm.get('mobilenumberNode') as FormArray;
  }
  newotpobj(value?): FormGroup {
    return this.builder.group({
      number: [value ? value : ''],
      code: ['', Validators.required]
    });
  }
  mobilenumobj(): FormGroup {
    return this.builder.group({
      number: ['', [Validators.required, Validators.minLength(10)]],
    });
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.api.setpAgetitle(metainfo.title);
  }
  patchData() {
    if (this.storage.getcheckoutdata() && this.storage.getcheckoutdata()[0]) {
      const num = this.storage.getcheckoutdata()[0].step1.mobile_number;
      let valuetopatch;
      if (num.includes(environment.countryCode)) {
        // For us
        // const firstthree = num.slice(2, 5);
        // const midThree = num.slice(5, 8);
        // const lst = num.slice(8, 12);
        // for india
        const firstthree = num.slice(3, 6);
        const midThree = num.slice(6, 9);
        const lst = num.slice(9, 13);
        valuetopatch = `${firstthree}${midThree}${lst}`;
      } else {
        valuetopatch = num;
      }
      this.mobilenumber.patchValue(valuetopatch);
      this.enableverificationsection(this.storage.getcheckoutdata()[0].step1.mobile_number, 'init');
    } else {
      this.verificatonrequired = true;
    }
  }
  enableverificationsection(value, type) {
    let browserIp;
    if (value) {
      if (this.storage.getuniquecodeforbrowser()) {
        browserIp = this.storage.getuniquecodeforbrowser();
      }
      this.api.post('quote/exist-checking', {
        mobile_number: value.includes(environment.countryCode) ? value : environment.countryCode + value,
        user_ip: this.storage.getIp().ip,
        browser_ip: browserIp
      }).subscribe(res => {
        if (res.status === 200) {
          this.isVerified = res.isVerified;
          if (res.isVerified) {
            this.verificatonrequired = false;
            this.userValue = res.data;
            this.getcartlist(res.data);
          } else {
            this.verificatonrequired = true;
            if (type === 'click') {
              this.sendOtp();
            }
          }
        } else {
          this.verificatonrequired = true;
          if (type === 'click') {
            this.sendOtp();
          }
        }
      });
    } else {
      this.mobilenumber.markAsTouched();
    }
  }

  sendOtp() {
    const data = {
      mobile_number: environment.countryCode + this.mobilenumber.value
    };
    this.api.post('quote/sendOtp', data).subscribe((res: any) => {
      if (res.status === 200) {
        this.api.alert(res.message, 'success');
        this.isOtpsection = true;
      } else {
        this.isquoteAvailable = true;
      }
    }, err => {
      if (err) {
        this.api.alert(err.message ? err.message : 'Somthing went wrong', 'error');
      }
    });
  }
  verify() {
    if (this.varificationCode.valid) {
      let browserid;
      let now = Date.now().toString();
      now += now + Math.floor(Math.random() * 10);
      if (this.storage.getuniquecodeforbrowser()) {
        browserid = this.storage.getuniquecodeforbrowser();
      } else {
        browserid = now.slice(8, 14);
      }
      const data = {
        mobile_number: environment.countryCode + this.mobilenumber.value,
        otp: this.varificationCode.value,
        browser_ip: browserid,
        user_ip: this.userIp,
      };
      this.api.post('quote/verifyOtp', data).subscribe((res: any) => {
        if (res.status === 200) {
          const Forsavetostorage = {
            email: '',
            first_name: '',
            last_name: '',
            link_mobile_number: '',
            mobile_number: data.mobile_number,
            mobile_number_type: '',
            property_apartment: '',
            property_city: '',
            property_state: '',
            property_street_address: '',
            property_zip_code: '',
          };
          this.storage.savecheckoutdata([{ step1: Forsavetostorage }]);
          this.event.cartnumberemmit.next(true);
          this.api.alert(res.message, 'success');
          this.verificatonrequired = false;
          this.storage.saveuniquecodeforbrowser(browserid);
          this.getcartlist(res.data);
        } else {
          this.api.alert(res.message, 'info');
        }
      });
    } else {
      this.varificationCode.markAsTouched();
    }
  }
  togaleLinkNumberVerification() {
    if (!this.linkAnotherNumber) {
      this.linkAnotherNumber = !this.linkAnotherNumber;
    } else {
      this.linkAnotherNumber = !this.linkAnotherNumber;
      this.linkNumberOtpsectionEnable = false;
    }
    this.enableLinkAnotherNumbersection();
  }
  enableLinkAnotherNumbersection() {
    const data = {
      number: this.mobilenumber.value.includes(environment.countryCode) ?
        this.mobilenumber.value : environment.countryCode + this.mobilenumber.value
    };
    this.api.post('quote/fetch/number-link', data).subscribe((res: any) => {
      if (res.status === 200) {
        if (res && this.api.isExist(res.data)) {
          this.linkId = res.data.id;
          this.linkednumberArray = res.data.number;
        }
      }
    }, err => {
      if (err) { }
    });
  }
  verifyPhoneNum() {
    if (this.mobileNumberArray.valid) {
      let tempNumbArray;
      // let tempindex;
      const tempArr = [];
      const tempNumArray = [];
      const data = {
        link_id: this.linkId,
        number: [(environment.countryCode + this.mobilenumber.value)]
      };
      if (this.linkednumberArray && this.linkednumberArray.length > 0) {
        this.linkednumberArray.forEach(element => {
          tempNumArray.push(element.number);
        });
        tempNumbArray = [...tempNumArray];
        // (environment.countryCode + this.linkMobileNumber.value),
      } else {
        tempNumbArray = [...data.number];
      }
      this.mobileNumberArray.value.map(n => {
        tempArr.push((environment.countryCode + n.number));
      });
      const intersection = tempNumbArray.filter(element => tempArr.includes(element));
      data.number = tempNumbArray;
      if (intersection.length === 0) {
        tempArr.forEach(i => {
          data.number.push(i);
        });
        this.api.post('quote/number-link', data).subscribe((res: any) => {
          if (res.status === 200) {
            this.api.alert(res.message, 'success');
            this.otpArray.clear();
            tempNumbArray.forEach(eachitem => {
              this.otpArray.push(this.newotpobj(eachitem));
            });
            this.linkNumberOtpsectionEnable = true;
            this.linkIdforOtp = res.data._id;
          } else {
            this.api.alert(res.message, 'warning');
          }
        }, err => {
          if (err) { }
        });
      } else {
        this.api.alert('Number already linked', 'warning');
      }
    } else {
      this.mobileNumberArray.markAllAsTouched();
    }

  }
  openConfirmBox(removeNumber: any) {
    const dialogref = this.dialog.open(DefaultComponent, {
      width: '500px',
      data: {
        type: '1'
      }
    });
    dialogref.afterClosed().subscribe(res => {
      if (res) {
        const data = {
          number: removeNumber,
          id: this.linkId
        };
        this.api.post('quote/remove/number-link', data).subscribe(removeQoute => {
          if (removeQoute.status === 200) {
            this.api.alert(res.message, 'success');
            this.enableLinkAnotherNumbersection();
            this.linkNumberOtpsectionEnable = false;
            this.linkAnotherNumber = !this.linkAnotherNumber;
            this.getcartlist(this.userValue);
          }
        });
      }
    });

  }
  sendOtpForMultiple() {
    if (this.linknumberForm.get('otpGroup').valid) {
      this.api.post('quote/verify/number-link',
        {
          link_id: this.linkIdforOtp,
          number: this.linknumberForm.value.otpGroup
        }
      ).subscribe(res => {
        if (res.status === 200) {
          this.api.alert(res.message, 'success');
          this.linkNumberOtpsectionEnable = false;
          this.linkAnotherNumber = !this.linkAnotherNumber;
          this.getcartlist(this.userValue);
        } else {
          this.api.alert(res.message, 'warning');
        }
      });
    } else {
      this.linknumberForm.get('otpGroup').markAllAsTouched();
    }
  }
  deleteQuote(quoteid) {
    this.api.post('quote/delete', { id: quoteid }).subscribe(res => {
      if (res.status === 200) {
        const cartlist = this.cartlist;
        cartlist.forEach((cartelement, cartindex) => {
          if (cartelement._id === quoteid) {
            this.cartlist.splice(cartindex, 1);
            this.event.cartnumberemmit.next(true);
            if (this.cartlist.length === 0) {
              this.cartlist = undefined;
            }
          }
        });
      }
    });
  }
  getcartlist(value) {
    const data = {
      mobile_number: value.mobile_number,
      email: value.email
    };
    this.api.post('quote/list', data).subscribe(res => {
      if (res.status === 200) {
        if (res.data.length > 0) {
          this.cartlist = res.data.map(cartitem => {
            let totaladdeditem = 0;
            const temparrforaddeditem = [...cartitem.step8.covered_item_list, ...cartitem.step9.optional_item]
            temparrforaddeditem.forEach(tempaddedelement => {
              totaladdeditem += (tempaddedelement.coveredunit + tempaddedelement.additionalunitdefaultvalue);
            });
            const index = cartitem.step13.state_data.findIndex(state =>
              state.state_name.toLowerCase() === cartitem.property_state.toLowerCase());
            if (index !== -1) {
              cartitem.step13.state_data = cartitem.step13.state_data[index];
            } else {
              cartitem.step13.state_data = {};
            }
            cartitem.totalcost = (cartitem.total_cost + Number(cartitem.step11.service_fee.Price));
            cartitem.totaladdeditem = totaladdeditem;
            const percentagesalestax = (cartitem.totalcost * Number(cartitem.step13.state_data.salex_tax ?
              cartitem.step13.state_data.salex_tax : 0)) / 100;
            cartitem.salestax = percentagesalestax;
            const percentagesurcharge = (cartitem.totalcost * Number(cartitem.step13.state_data.surcharge ?
              cartitem.step13.state_data.surcharge : 0)) / 100;
            cartitem.surcharge = percentagesurcharge;
            cartitem.totalcost = (cartitem.totalcost + percentagesalestax + percentagesurcharge +
              (cartitem.step13.state_data.additional_cost ? Number(cartitem.step13.state_data.additional_cost) : 0));
            return cartitem;
          });
        } else {
          this.cartlist = undefined;
        }
      } else {
        this.cartlist = undefined;
      }
    }, err => {
      if (err) {
        this.cartlist = undefined;
      }
    });
  }
  addForcheckout(event, item) {
    if (event.checked) {
      this.chckoutitemlist.push(item);
    } else {
      const finditemindex = _.findIndex(this.chckoutitemlist, { _id: item._id });
      this.chckoutitemlist.splice(finditemindex, 1);
    }
    this.totalcost = 0;
    this.chckoutitemlist.forEach(cartelement => {
      this.totalcost += cartelement.totalcost;
    });
    this.totalcost = Number(this.totalcost).toFixed(2);
  }
  editQuote(item) {
    this.event.cartEdit.next(item);
    this.router.navigate(['/buy-home-warranties']);
  }
  scrolsscheck() {
    const topPos: any = document.getElementById('blankscroll');
    if (topPos) {
      if ((window.scrollY + 300) >= (topPos.offsetTop - 150)) {
        document.getElementById('dynamic__btn').className = 'update_btn';
      } else {
        document.getElementById('dynamic__btn').className = 'update_btnfixed';
      }
    }
  }
  addMultipleNumber() {
    if (this.mobileNumberArray.length < 5) {
      this.mobileNumberArray.push(this.mobilenumobj());
    }
  }
  reMoveInputBox(index) {
    this.mobileNumberArray.removeAt(index);
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolsscheck();
  }
}
