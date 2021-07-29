import { MapsAPILoader } from '@agm/core';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
declare var $: any;
import { FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
declare var google: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean;
  username: string;
  public show = false;
  formType: string;
  selectedItem = '';
  selectedItemsub = '';
  showalrt: any;
  showpasswordalrt = true;
  currentLocation: any;
  passwordFormControl = new FormControl('', [Validators.required]);
  location: any;
  dynamicClass: any;
  cartnumber: any;
  // public buttonName:any = 'Show';
  constructor(
    private event: EventService,
    private storage: StorageService,
    private router: Router,
    private apiservice: ApiService,
    public mapsAPILoader: MapsAPILoader,
  ) {
    this.getlocation();
    document.body.classList.add('modal-open');
    this.formType = '';
    this.event.isLogin.subscribe((res: boolean) => {
      this.isLoggedIn = res;
      this.username = this.storage.getDataField('username');
    });
    if (this.storage.getscreenstatus() && this.storage.getscreenstatus() === true) {
      this.showalrt = true;
      document.body.classList.remove('modal-open');
    }

  }

  ngOnInit() {
    this.event.getheaderClass.subscribe(res => {
      this.dynamicClass = res;
    });
    this.event.getcartNumber.subscribe(res => {
      if (this.storage.getcheckoutdata()) {
        this.enableverificationsection(this.storage.getcheckoutdata()[0].step1.mobile_number);
      }
    });

    let lastScroll = 0;
    $(window).scroll(() => {
      const scroll = $(window).scrollTop();
      if (scroll > lastScroll) {
        if (this.selectedItem === 'item1') {
          $('.header-desktop').removeClass('active');
        } else if (this.selectedItem === 'item2') {
          $('.header-desktop').removeClass('active2');
        } else if (this.selectedItem === 'item3') {
          $('.header-desktop').removeClass('active3');
        } else if (this.selectedItem === 'item4') {
          $('.header-desktop').removeClass('active4');
        }
      } else if (scroll < lastScroll) {
        if (this.selectedItem === 'item1') {
          $('.header-desktop').addClass('active');
          this.selectedItem = '';
        } else if (this.selectedItem === 'item2') {
          $('.header-desktop').addClass('active2');
          this.selectedItem = '';
        } else if (this.selectedItem === 'item3') {
          $('.header-desktop').addClass('active3');
          this.selectedItem = '';
        } else if (this.selectedItem === 'item4') {
          $('.header-desktop').addClass('active4');
          this.selectedItem = '';
        }
      }
      lastScroll = scroll;
    });
  }

  logout() {
    this.storage.clearUser();
    this.event.setLoginEmmit(false);
  }

  getlocation() {
    this.apiservice.getIpAddress().subscribe((res: any) => {
      if (res) {
        this.storage.saveIp(res);
        this.apiservice.getGEOLocation(res.ip).subscribe((location: any) => {
          if (location) {
            this.location = location;
            this.showpassworddiv(this.location);
          }
        }, err => {
          if (err) {
            this.apiservice.alert(err.message, 'error');
          }
        });
      }
    });
  }
  enableverificationsection(value) {
    let browserIp;
    if (value) {
      if (!value.includes(environment.countryCode)) {
        value = environment.countryCode + value;
      }
      if (this.storage.getuniquecodeforbrowser()) {
        browserIp = this.storage.getuniquecodeforbrowser();
      }
      this.apiservice.post('quote/exist-checking', {
        mobile_number: value,
        user_ip: this.storage.getIp().ip,
        browser_ip: browserIp
      }).subscribe(res => {
        if (res.status === 200) {
          if (res.isVerified) {
            this.getcartlist(res.data);
          }
        } else {
          this.cartnumber = undefined;
        }
      });
    }
  }
  getcartlist(value) {
    const data = {
      mobile_number: value.mobile_number,
      email: value.email
    };
    this.apiservice.post('quote/list', data).subscribe(res => {
      if (res.status === 200) {
        if (res.data.length > 0) {
          this.cartnumber = res.data.length;
        } else {
          this.cartnumber = undefined;
        }
      } else {
        this.cartnumber = undefined;
      }
    }, err => {
      if (err) {
        this.cartnumber = undefined;
      }
    });
  }
  showpassworddiv(location) {
    if (!this.storage.getpassworddivstatus() && this.storage.getscreenstatus() && this.storage.getscreenstatus() === true) {
      if (location.city === 'New Jersey' || location.city === 'New York' || location.city === 'Manhattan'
        || location.city === 'Brooklyn' || location.city === 'Queens' || location.city === 'Bronx' || location.city === 'Staten Island' ||
        location.city === 'Long Island' || location.city === 'Long Island city') {
        this.showpasswordalrt = false;
      }
    } else {
      this.showpasswordalrt = true;
    }
  }

  toggle() {
    if (this.show === true) {
      document.body.classList.remove('modal-open');
    } else {
      document.body.classList.add('modal-open');
    }
    this.selectedItemsub = '';
    this.show = !this.show;
  }



  scrollToDiv(formType: string) {
    this.formType = formType;
    this.event.setHeaderEmmit(formType);
    if (this.router.url !== '/landing') {
      this.router.navigate(['/landing']);
    }
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    // console.log(window.scrollY);
    if (window.scrollY >= 75) {
      document.getElementsByClassName('landing-header')[0].classList.add('scrollActive');
    } else {
      document.getElementsByClassName('landing-header')[0].classList.remove('scrollActive');
    }
  }

  removealrt() {
    this.showalrt = !this.showalrt;
    this.storage.setscreenstatus(true);
    document.body.classList.remove('modal-open');
    if (!this.storage.getpassworddivstatus()) {
      if (this.location.city === 'New Jersey' || this.location.city === 'New York' || this.location.city === 'Manhattan'
        || this.location.city === 'Brooklyn' || this.location.city === 'Queens' || this.location.city === 'Bronx'
        || this.location.city === 'Staten Island' ||
        this.location.city === 'Long Island' || this.location.city === 'Long Island city') {
        this.showpasswordalrt = false;
      } else {

      }
    }
  }

  proceed() {
    if (this.passwordFormControl.valid) {
      if (this.passwordFormControl.value === 'EHw2021') {
        this.apiservice.alert('Successful', 'success');
        this.storage.setpassworddivstatus(true);
        this.showpasswordalrt = true;
      } else {
        this.apiservice.alert('You enter a wrong password', 'error');
      }
    } else {
      this.passwordFormControl.markAsTouched();
    }
  }



}
