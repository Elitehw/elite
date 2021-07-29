import { Component, ElementRef, OnInit, NgZone, ViewChild, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { EventService } from 'src/app/services/event.service';
import { ApiService } from 'src/app/services/api.service';
declare var google;
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  status = false;
  statusfrm = false;
  statusstate = false;
  getaddress2: any;
  getaddress1: any;
  addClass: boolean;
  videoLink: string;
  changeText1: boolean;
  changeText2: boolean;
  changeText3: boolean;
  changeText4: boolean;
  changeText5: boolean;
  changeText6: boolean;
  changeText7: boolean;
  reviewArr: any;
  @ViewChild('address', { static: true }) public address: ElementRef;
  @ViewChild('address1', { static: true }) public address1: ElementRef;
  @ViewChild('vid', { static: true }) public vid: ElementRef<HTMLVideoElement>;
  slideConfigcontent = {
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    infinite: true,
    dots: true,
    autoplay: false,
    autoplaySpeed: 4000,

    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3, } },
      { breakpoint: 991, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true, autoplay: true, } },
      { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true, autoplay: true, } }
    ]
  };
  isInsideClick: boolean;
  isOutsideClick: boolean;
  mapDataStatic: any;
  allStates: any;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private element: ElementRef,
    private event: EventService,
    private apiService: ApiService
  ) {
    this.addClass = false;
    this.videoLink = '/assets/video/sample9.mp4';
    this.changeText1 = false;
    this.changeText2 = false;
    this.changeText3 = false;
    this.changeText4 = false;
    this.changeText5 = false;
    this.changeText6 = false;
    this.changeText7 = false;
    this.reviewArr = [{
      name: 'Linda H',
      address: 'Virginia Beach, Virginia',
      // tslint:disable-next-line: max-line-length
      comment: 'I feel secure having Elite Home Warranty and paying that yearly premium. When things happen, there\'s a company that is easy to deal with that\'s not gonna run hide behind the fine print to try to get out of the claims. They stand behind what they cover. Not everybody does that.',
      star: 5
    },
    {
      name: 'Kurtis R',
      address: 'Oklahoma City, Oklahoma',
      // tslint:disable-next-line: max-line-length
      comment: 'The appliance repair company did a wonderful job. They arrived on time as scheduled and repaired my refrigerator successfully. Great experience overall.',
      star: 5
    }, {
      name: 'Mary B',
      address: 'Jackson, Wyoming',
      // tslint:disable-next-line: max-line-length
      comment: 'The contractor came out right away and fixed the issue and gave me options. I was very pleased. They got my air conditioner working stress free.',
      star: 5
    }, {
      name: 'Robert M',
      address: 'New Orleans, Louisiana',
      comment: 'The claim team was very polite, very concerned, patient, and listened to what I had to say. They gave us the information and followed up until my washing machine got fixed. They kept us informed of when the technician was coming and followed throughout the entire process. It was a unique experience. I am completely satisfied.',
      star: 5
    }, {
      name: 'Cindy M',
      address: 'Colorado Springs, Colorado',
      // tslint:disable-next-line: max-line-length
      comment: 'There was a leak in the sink. I submitted a claim with Elite Home Warranty and the process was very easy. Then, the tech who came out was very good and very friendly. He explained to me what was the cause and completed the repair perfectly.',
      star: 5
    },
    {
      name: 'Phillip A',
      address: 'Salt Lake City, Utah',
      // tslint:disable-next-line: max-line-length
      comment: 'The process of ordering the home warranty was very informative and transparent. I was able to increase the coverage amount of one of my professional-grade appliances to ensure full coverage. It is truly impressive to see how transparent they’re comparing the other companies.',
      star: 5
    },
    {
      name: 'Kelly S',
      address: 'Minneapolis, Minnesota',
      // tslint:disable-next-line: max-line-length
      comment: 'I just purchased the Elite Complete plan and customized the coverage according to my needs. The annual cost is a bit high, but the coverage is much better. As always, you pay for what you get. I’m happy with the terms of coverage.',
      star: 5
    },
    {
      name: 'Jim N',
      address: 'Clive, Iowa',
      // tslint:disable-next-line: max-line-length
      comment: 'The washer was not draining and it was just making noise. I filed a claim online with EHW, and paid my deductible. A repair company contacted me within 2 hours which was very impressive. They have fixed the issue and it is now working perfectly. Fantastic service!',
      star: 5
    },
    {
      name: 'Christopher T',
      address: 'South Burlington, Vermont',
      // tslint:disable-next-line: max-line-length
      comment: 'The technician was so kind. He came in and looked at my dishwasher. He ordered some parts which took 2 days to arrive. He was very professional and he did an excellent job.',
      star: 5
    },
    {
      name: 'Gordon C',
      address: 'Manchester, New Hampshire',
      // tslint:disable-next-line: max-line-length
      comment: 'I\'ve used Elite Home Warranty for the first time and everything has gone very smoothly. I just dialed the number and filed a claim with a super friendly representative. The next day a contractor came by and did what they came to do, and they were very courteous, polite, and efficient.',
      star: 5
    },
    {
      name: 'Rose L',
      address: 'Mount Pleasant, South Carolina',
      // tslint:disable-next-line: max-line-length
      comment: 'I was 100% satisfied with my recent claim experience with EHW and it was super. The water heater was broken and it was replaced. The repair guys were in and out in very little time and did a fantastic job.',
      star: 5
    },
    {
      name: 'Diane G',
      address: 'Hempstead, New York',
      // tslint:disable-next-line: max-line-length
      comment: 'Took out a plan with Elite Home Warranty. The representative I worked with was very informative and friendly. He helped me choosing the right plan for my home. Hope I never have to use it. So far, so good.',
      star: 5
    },
    {
      name: 'Rose L',
      address: 'Mount Pleasant, South Carolina',
      // tslint:disable-next-line: max-line-length
      comment: 'I was 100% satisfied with my recent claim experience with EHW and it was super. The water heater was broken and it was replaced. The repair guys were in and out in very little time and did a fantastic job.',
      star: 5
    },
    {
      name: 'Neil D',
      address: 'Rumson, New Jersey',
      // tslint:disable-next-line: max-line-length
      comment: 'Two of my friends got EHW and they said that when they had a problem, the repair was covered. I signed up with them and got the Elite Complete plan for $950. After my first great experience, I got another plan for my second home.',
      star: 5
    },
    {
      name: 'Lisa P',
      address: 'Albuquerque, New Mexico',
      // tslint:disable-next-line: max-line-length
      comment: 'Elite Home Warranty is excellent. They have been good at answering and taking care of my claims. So far, the experience is great. They are very responsive and professional.',
      star: 5
    },
    ];
  }



  ngOnInit(): void {
    this.event.setClassName('homeHeader');
    this.getAllStates();
    if (this.address && this.address.nativeElement) {
      this.autoFillLocation('address');
    }
    if (this.address1 && this.address1.nativeElement) {
      this.autoFillLocation('address1');
    }
    this.getReview();
  }
  ngAfterViewInit() {
    // setTimeout(() => {
    this.play();
    // }, 5000);
    const lastScroll = 700;

    $(window).scroll(() => {
      const scroll = $(window).scrollTop();
      const myVideo: any = document.getElementById('vid');
      if (myVideo) {
        if (scroll > lastScroll) {
          myVideo.pause();
        } else {
          myVideo.play();
        }
      }
    });
  }
  play() {
    const myVideo: any = document.getElementById('vid');
    if (myVideo) {
      myVideo.muted = true;
      myVideo.controls = false;
      myVideo.play();
    }
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
          const place = autocomplete.getPlace();
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < place.address_components.length; i++) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < place.address_components[i].types.length; j++) {
              if (place.address_components[i].types[j] === 'street_number') {
                if (element === 'address') {
                  this.getaddress1 = place.formatted_address;
                }
                if (element === 'address1') {
                  this.getaddress2 = place.formatted_address;
                }
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
        this.mapDataStatic = this.allStates;
      }
    });
  }
  getReview() {
    if (window.innerWidth <= 1023) {
      this.reviewArr.splice(6);
    } else {
      this.reviewArr.splice(10);
    }
  }
  @HostListener('click', ['$event'])
  onClickBtn(event) {
    if (event.target === document.getElementsByClassName('strong').item(0) ||
      event.target === document.getElementsByClassName('custom__paragraph__image').item(0)) {
      return false;
    } else {
      this.status = false;
    }
  }

  ngOnDestroy() {
    this.event.setClassName('');
  }

  scrolltomap() {
    const element = document.querySelector('#scrollmap');
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

}
