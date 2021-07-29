import { Component, ElementRef, OnInit, ViewChild, NgZone, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { ApiService } from 'src/app/services/api.service';
import * as _ from 'underscore';
declare var google;
declare var $: any;
import * as moment from 'moment';
import { StorageService } from 'src/app/services/storage.service';
import { EventService } from 'src/app/services/event.service';
declare var paypal_sdk;

@Component({
  selector: 'app-buyitems',
  templateUrl: './buyitems.component.html',
  styleUrls: ['./buyitems.component.scss']
})
export class BuyitemsComponent implements OnInit {
  stepProcess: any;
  propertypewecover = new FormControl('', [Validators.required]);
  propertySizeweCover = new FormControl('', [Validators.required]);
  serviceFee: FormControl = new FormControl('', [Validators.required]);
  keepPlanSelectionSame: FormControl = new FormControl('', [Validators.required]);
  paymentType = new FormControl('1', [Validators.required]);
  cardDetail: FormGroup;
  accountDetail: FormGroup;
  isPaypal: boolean;
  paypaldetail: FormGroup;
  coverAdditional = new FormControl('', [Validators.required]);
  selectPlan: any;
  propertyType: any;
  addressForm: FormGroup;
  propertySize: any;
  planList: any;
  viewmoreforbottombox: boolean;
  @Output() backtojoinourclubemit = new EventEmitter<any>();
  @Input() quoteId = new EventEmitter<any>();
  @Input() cartEditdata: any = new EventEmitter<any>();
  PlanCustomarr = {
    firstTwoplan: [],
    thirdPlan: [],
    restOfthePlan: []
  };
  planDetail: any;
  @ViewChild('location', { static: false }) public location: ElementRef;
  addressSeldcted: boolean;
  plansummary: any;
  currenDate: any;
  effectivedateendDate: any;
  allStates: any = [];
  isStateAvailable: boolean;
  newFullAddres: any;
  newquotedata: any;
  mulitplePlanArray: any = [];
  constructor(
    private api: ApiService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private storage: StorageService,
    private event: EventService
  ) {
    this.isPaypal = false;
    this.stepProcess = {
      stepOne: false, stepTwo: false, stepThree: false, stepFour: false, stepFive: false,
      stepSix: false, stepSeven: false, stepEight: false, stepNine: false, stepTen: false,
      stepeleven: false, stepTwelve: false, stepthirteen: false, stepFourteen: false, stenFifteen: false
    };
    this.selectPlan = {
      planOne: false, planTwo: false, planThree: false, planFour: false, planFive: false,
    };
    this.viewmoreforbottombox = false;
    this.stepProcess.stepOne = true;
    // For effective term Date
    this.currenDate = moment(new Date()).format('MM/DD/YYYY');
    const newDate = new Date();
    this.effectivedateendDate = moment(newDate.setDate(newDate.getDate() + 30)).format('MM/DD/YYYY');

    this.plansummary = {
      plan1stpanelState: false, plan2ndpanelState: false,
      plan3rdpanelState: false, plan4thpanelState: false,
      plan5thpanelState: false, plan6thpanelState: false,
      plan7thpanelState: false
    };
  }

  ngOnInit(): void {
    this.formInit();
    this.getaListingData();
    this.paymentType.valueChanges.subscribe(res => {
      if (res === '1') {
        setTimeout(() => {
          this.proceedPaypal();
        }, 500);
      }
    });
    // this.proceedPaypal();
    this.getAllStates();
  }
  patchData() {
    if (this.cartEditdata) {
      const propertytypeIndex = _.findIndex(this.propertyType, { _id: this.cartEditdata.step5.propertyType });
      const propertySizeIndex = _.findIndex(this.propertySize, { _id: this.cartEditdata.step6.propertySize });
      if (propertySizeIndex !== -1) {
        this.propertySizeweCover.patchValue(this.propertySize[propertySizeIndex]);
      }
      if (propertytypeIndex !== -1) {
        this.propertypewecover.patchValue(this.propertyType[propertytypeIndex]);
      }
      this.serviceFee.patchValue(Number(this.cartEditdata.step11.service_fee.Price));
    }
  }
  formInit() {
    this.cardDetail = new FormGroup({
      name_on_card: new FormControl('', [Validators.required]),
      card_number: new FormControl('', [Validators.required]),
      card_exp: new FormControl('', [Validators.required]),
      cvv: new FormControl('', [Validators.required]),
    });
    this.accountDetail = new FormGroup({
      account_name: new FormControl('', [Validators.required]),
      routing_number: new FormControl('', [Validators.required]),
      account_number: new FormControl('', [Validators.required]),
      verify_number: new FormControl('', [Validators.required]),
    });
    this.paypaldetail = new FormGroup({
      routing_number: new FormControl('', [Validators.required]),
      account_number: new FormControl('', [Validators.required]),
      verify_number: new FormControl('', [Validators.required]),
    });
    this.addressForm = new FormGroup({
      street_address: new FormControl('', [Validators.required]),
      apt: new FormControl(''),
      zipcode: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
    });
  }
  getAllStates() {
    this.api.get('state/list').subscribe((res: any) => {
      if (res) {
        this.allStates = res.data.filter(state => state.type === 'cover');
      }
    });
  }
  backtojoinourclub() {
    this.backtojoinourclubemit.emit(true);
  }
  gotoTop() {
    const element = document.querySelector('#nav-tabContent');
    if (element) {
      element.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }
  checkExpiryforcard(controls: FormControl) {
    let data;
    if (!controls.hasError('Mask error')) {
      if (controls.value !== '') {
        data = {
          exp_month: controls.value.slice(0, 2),
          exp_year: controls.value.slice(2)
        };
        if (data.exp_month >= 1 && data.exp_month <= 12 && this.isFutureDate(`01/${data.exp_month}/${'20' + data.exp_year}`)) {
          controls.clearValidators();
        } else {
          controls.setErrors({ inValid: true });
        }
      }

    }
  }

  matchPassword(accountnumber: FormControl, verifyaccountnumber: FormControl) {
    if ((accountnumber.value !== verifyaccountnumber.value) && (verifyaccountnumber.value && verifyaccountnumber.dirty)) {
      verifyaccountnumber.setErrors({ noMatch: true });
    } else if (!verifyaccountnumber.value) {
      verifyaccountnumber.setErrors({ required: true });
    } else {
      verifyaccountnumber.clearValidators();
      verifyaccountnumber.updateValueAndValidity();
    }
  }
  saveAccountdetail() {
    if (this.accountDetail.valid) {
      this.api.alert('Details saved successfully', 'success');
      this.accountDetail.reset();
    } else {
      this.accountDetail.markAllAsTouched();
    }
  }
  savepaypalAccountdetail() {
    if (this.paypaldetail.valid) {
      // this.api.alert('Details saved successfully', 'success');
      // this.paypaldetail.reset();
    } else {
      this.paypaldetail.markAllAsTouched();
    }
  }
  isFutureDate(idate) {
    const today = new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime();
    idate = idate.split('/');
    idate = new Date(idate[2], idate[1] - 1, idate[0]).getTime();
    return (today - idate) < 0 ? true : false;
  }
  // Continue 1
  continuetosizesection() {
    if (this.propertypewecover.value.title === 'Single Family' || this.propertypewecover.value.title === 'Condominium' ||
      this.propertypewecover.value.title === 'Townhouse') {
      this.continue('stepTwo', 'stepOne', 'propertypewecover');
    } else {
      this.continue('stepThree', 'stepOne', 'propertypewecover');
      this.propertySizeweCover.setValue('');
      this.getPlanList();
    }
  }
  // Continue 2 Continue 4 Continue 6 Continue 7 Continue 8 Continue 9 Continue 10
  continue(nextstepname, previousStepname, formGroupname) {
    setTimeout(() => {
      if (this.location) {
        this.autoFillLocation('location');
      }
    }, 300);
    if (formGroupname !== '') {
      if (this[formGroupname].valid) {
        if (formGroupname !== 'coverAdditional') {
          this.next(nextstepname, previousStepname);
        } else {
          if (this[formGroupname].value === 'yes') {
            this.next(nextstepname, previousStepname);
          } else {
            setTimeout(() => {
              this.proceedPaypal();
            }, 500);
            this.next('stepfiveTeen', previousStepname);
          }
        }
        if (formGroupname === 'serviceFee') {
          this.savequotes({
            step11: {
              service_fee: {
                Price: this[formGroupname].value,
                name: ''
              }
            }
          }).then((value: any) => {
            const Index = _.findIndex(this.mulitplePlanArray, { _id: value.data._id });
            console.log(value.data);
            if (Index === -1) {
              this.mulitplePlanArray.push(value.data);
            }
            console.log(this.mulitplePlanArray);
          });

        }
        if (formGroupname === 'propertypewecover') {
          this.savequotes({
            step5: {
              propertyType_name: this[formGroupname].value.title,
              propertyType: this[formGroupname].value._id
            }
          });
        } else if (formGroupname === 'propertySizeweCover') {
          this.savequotes({
            step6: {
              propertySize_name: this[formGroupname].value.title,
              propertySize: this[formGroupname].value._id
            }
          });
          this.event.setLoaderEmmit(true);
        }
      } else {
        this[formGroupname].markAllAsTouched();
      }
    } else {
      this.next(nextstepname, previousStepname);
      const totalcost = (this.planDetail.itemList[0]?.info.cost_per_plan +
        this.planDetail.totaladdedprice + this.planDetail.totalOptionalItemsCost +
        this.planDetail.totaladdedCostForCoverage + this.planDetail.totalCategorycoverage);

      const totalcoverage = (this.planDetail?.totalAddedCoverage + this.planDetail?.coveragefee +
        this.planDetail?.optionalCoverage +
        (this.planDetail?.addCoverageAmount ? this.planDetail?.addCoverageAmount : 0));
      if (previousStepname === 'stepFour') {
        if (this.planDetail) {
          const arraytopass = [];
          const tempobj = {};
          let duplicateItemkeyName;
          duplicateItemkeyName = ['addedcosttotal', 'additionalunitdefaultvalue',
            'count', 'coveredunit', 'covrageValue', 'defaultCoverage', 'defaultCoverage', 'totalCoverageValue', 'totalCoverageValue',
            'title'];
          this.planDetail.itemList[0].info.covered_item_list.forEach(itemelement => {
            const itemobj = {
              addedcosttotal: itemelement.addedcosttotal, additionalunitdefaultvalue: itemelement.additionalunitdefaultvalue,
              category_decrease: itemelement.category_decrease, category_increase: itemelement.category_increase,
              coverageValueForDuplicatesec: itemelement.coverageValueForDuplicatesec,
              coverageaddedcostForDuplicates: itemelement.coverageaddedcostForDuplicates,
              coveredunit: itemelement.coveredunit, covrageValue: itemelement.covrageValue,
              defaultCoverage: itemelement.defaultCoverage, quantity: itemelement.quantity,
              totalCoverageValue: itemelement.totalCoverageValue, totalincreseCoverageValue: itemelement.totalincreseCoverageValue,
              title: itemelement.covered_item_id.title,
              increseCoverageFee: itemelement.increseCoverageFee, type: itemelement.covered_item_id.type, dublicateItemlist: []
            };
            if (itemelement.dublicateItemlist && itemelement.dublicateItemlist.length > 0) {
              itemelement.dublicateItemlist.forEach(duplicateelement => {
                if (itemobj.title ===
                  (duplicateelement.covered_item_id ? duplicateelement.covered_item_id.title : duplicateelement.title)) {
                  for (const [iterator, val] of duplicateItemkeyName.entries()) {
                    tempobj[duplicateItemkeyName[iterator]] = duplicateelement[duplicateItemkeyName[iterator]];
                    if (duplicateItemkeyName[iterator] === 'title') {
                      tempobj[duplicateItemkeyName[iterator]] = duplicateelement.covered_item_id ?
                        duplicateelement.covered_item_id.title : duplicateelement.title;
                    }
                  }
                  itemobj.dublicateItemlist.push(JSON.parse(JSON.stringify(tempobj)));
                }
              });
            }
            arraytopass.push(itemobj);
          });
          this.savequotes({ step8: { covered_item_list: arraytopass }, total_cost: totalcost, total_coverage: totalcoverage });
        }
      } else if (previousStepname === 'stepSix') {
        const coveragearr = [];
        this.planDetail.coverageAddedItemList.forEach(coverage => {
          const coverageobj = {
            count: coverage.count, title: coverage.covered_item_id && coverage.covered_item_id.title ?
              coverage.covered_item_id.title : coverage.covered_item[0].title,
            coveredunit: coverage.coveredunit,
            covrageValue: coverage.covrageValue, defaultCoverage: coverage.defaultCoverage,
            increseCoverageFee: coverage.increseCoverageFee, price: coverage.price,
            quantity: coverage.quantity, totalCoverageValue: coverage.totalCoverageValue,
            totalincreseCoverageValue: coverage.totalincreseCoverageValue, type: ''
          };
          if (coverage.isOptional) {
            coverageobj.type = 'optional';
          }
          if (coverage.type) {
            coverageobj.type = coverage.type;
          }
          coveragearr.push(coverageobj);
        });
        this.savequotes({ step12: { coverage_selection: coveragearr }, total_cost: totalcost, total_coverage: totalcoverage });
      } else if (previousStepname === 'stepSeven') {
        const categoryArray = [];
        this.planDetail.categorycoverageAddedItemList.forEach(categoryelement => {
          const categoryobj = {
            defaultcategoryCoverage: categoryelement.defaultcategoryCoverage,
            title: categoryelement.category[0].name,
            categoryCoverageamount: categoryelement.categoryCoverageamount,
            totalCalculatedCost: categoryelement.totalCalculatedCost,
          };
          categoryArray.push(categoryobj);
        });
        this.savequotes({ step10: { category_covered_item: categoryArray }, total_cost: totalcost, total_coverage: totalcoverage });
      }
    }
    if (formGroupname === 'propertySizeweCover') {
      this.getPlanList();
    }
  }
  // Continue 3
  planselected(nextstepname, previousStepname) {
    if (this.planList.length > 0) {
      this.planList.map(item => {
        if (item.isSelected) {
          this.savequotes({
            step7: {
              title: item.title,
              plan_id: item._id,
              isSelected: item.isSelected,
              price: Number(item.property_pricing[0].info.cost_per_plan)
            }
          });
          this.next(nextstepname, previousStepname);
        }
      });
    }
  }
  // Continue 5
  continuetoCoveredCategory(nextstepname, previousStepname, formGroupname) {
    if (this.planDetail.optional_item.length > 0) {
      const index = this.planDetail.category_covered_item.findIndex(each =>
        (each.category.length > 0 ? each.category[0].name.trim().toLowerCase() : '') ===
        (this.planDetail.optional_item[0].category.length > 0 ?
          this.planDetail.optional_item[0].category[0].name.trim().toLowerCase() : '')
      );
      if (index === -1 && this.planDetail.optionalItemcoverageCategory.length > 0) {
        if (this.planDetail.optional_item[0].category.length > 0) {
          this.planDetail.category_covered_item.push(
            {
              category: this.planDetail.optional_item[0].category,
              defaultcategoryCoverage: 0
            }
          );
        }
      } else if (this.planDetail.optionalItemcoverageCategory.length === 0) {
        if (index !== -1) {
          this.planDetail.category_covered_item.splice(index, 1);
        }
      }
    }
    if (this.cartEditdata) {
      if (this.cartEditdata.step10.category_covered_item.length > 0) {
        this.cartEditdata.step10.category_covered_item.forEach(cartCCi => {
          this.planDetail.category_covered_item.map(ccI => {
            if (cartCCi.title === ccI.category[0].name) {
              ccI.defaultcategoryCoverage = cartCCi.defaultcategoryCoverage;
              ccI.categoryCoverageamount = cartCCi.categoryCoverageamount;
              ccI.totalCalculatedCost = cartCCi.totalCalculatedCost;
            }
          });
        });
        this.planDetail.categorycoverageAddedItemList = this.planDetail.category_covered_item;
        this.planDetail.totalCategorycoverage = this.planDetail.category_covered_item.reduce((acccost, curcost) =>
          acccost + Number(curcost.totalCalculatedCost ? curcost.totalCalculatedCost : 0), 0);
        this.planDetail.totalAddedCoverageAmount = this.planDetail.category_covered_item.reduce((acccost, curcost) =>
          acccost + Number(curcost.defaultcategoryCoverage), 0);
      }
    }

    if (formGroupname !== '') {
    } else {
      this.next(nextstepname, previousStepname);
      if (previousStepname === 'stepFive') {
        const arraytopass = [];
        const tempobj = {};
        let duplicateItemkeyName;
        duplicateItemkeyName = ['addedcosttotal', 'additionalunitdefaultvalue',
          'count', 'coveredunit', 'covrageValue', 'defaultCoverage', 'quantity', 'totalCoverageValue',
          'title', 'totalincreseCoverageValue', 'maximum_coverage_increase_fee', 'maximum_coverage_decrease_fee'];
        this.planDetail.optionalItemcoverageCategory.forEach(itemelement => {
          const itemobj = {
            addedcosttotal: itemelement.addedcosttotal, additionalunitdefaultvalue: itemelement.additionalunitdefaultvalue,
            category_decrease: itemelement.category_decrease, category_increase: itemelement.category_increase,
            coverageValueForDuplicatesec: itemelement.coverageValueForDuplicatesec,
            coverageaddedcostForDuplicates: itemelement.coverageaddedcostForDuplicates,
            coveredunit: itemelement.coveredunit, covrageValue: itemelement.covrageValue,
            defaultCoverage: itemelement.defaultCoverage, quantity: itemelement.quantity,
            totalCoverageValue: itemelement.totalCoverageValue, totalincreseCoverageValue: itemelement.totalincreseCoverageValue,
            title: itemelement.covered_item[0].title, dublicateItemlist: []
          };
          let count = 0;
          itemelement.dublicateItemlist.forEach(duplicateelement => {
            if (itemobj.title === (duplicateelement.covered_item ? duplicateelement.covered_item[0].title : duplicateelement.title)) {
              for (const [iterator, val] of duplicateItemkeyName.entries()) {
                tempobj[duplicateItemkeyName[iterator]] = duplicateelement[duplicateItemkeyName[iterator]];
                if (duplicateItemkeyName[iterator] === 'title') {
                  tempobj[duplicateItemkeyName[iterator]] = duplicateelement.covered_item ?
                    duplicateelement.covered_item[0].title : duplicateelement.title;
                }
                if (duplicateItemkeyName[iterator] === 'count') {
                  tempobj[duplicateItemkeyName[iterator]] = (count + 1);
                  count++;
                }
                if (duplicateItemkeyName[iterator] === 'maximum_coverage_increase_fee') {
                  tempobj[duplicateItemkeyName[iterator]] = duplicateelement.covered_item ?
                    duplicateelement.covered_item[0].maximum_coverage_increase_fee : duplicateelement.maximum_coverage_increase_fee;
                }
                if (duplicateItemkeyName[iterator] === 'maximum_coverage_decrease_fee') {
                  tempobj[duplicateItemkeyName[iterator]] = duplicateelement.covered_item ?
                    duplicateelement.covered_item[0].maximum_coverage_decrease_fee : duplicateelement.maximum_coverage_decrease_fee;
                }
              }
              itemobj.dublicateItemlist.push(JSON.parse(JSON.stringify(tempobj)));
            }
          });
          arraytopass.push(itemobj);
        });
        const totalcost = (this.planDetail.itemList[0]?.info.cost_per_plan +
          this.planDetail.totaladdedprice + this.planDetail.totalOptionalItemsCost + this.planDetail.totaladdedCostForCoverage);
        const totalcoverage = (this.planDetail?.totalAddedCoverage + this.planDetail?.coveragefee +
          this.planDetail?.optionalCoverage +
          (this.planDetail?.addCoverageAmount ? this.planDetail?.addCoverageAmount : 0));
        this.savequotes({ step9: { optional_item: arraytopass }, total_cost: totalcost, total_coverage: totalcoverage });
      }
    }
  }
  updatelocation(type) {
    this.autoFillLocation(type);
  }
  selectplan(selectplan) {
    this.planList = this.planList.map(item => {
      if (item._id === selectplan._id) {
        item.isSelected = true;
        item.isProceed = true;
      } else {
        item.isSelected = false;
      }
      return item;
    });
    this.getPlanDetail(selectplan._id);
    this.planListModification(this.planList);
  }

  next(nextStep, previousStep) {
    this.viewmoreforbottombox = false;
    this.plansummary = {
      plan1stpanelState: false, plan2ndpanelState: false,
      plan3rdpanelState: false, plan4thpanelState: false,
      plan5thpanelState: false, plan6thpanelState: false,
      plan7thpanelState: false
    };
    this.gotoTop();
    if (this.planDetail) {
      if (this.planDetail.optionalItemcoverageCategory && this.planDetail.optionalItemcoverageCategory.length > 0) {
        this.planDetail.optionalItemcoverageCategory.map(optionalItems => {
          if (optionalItems.dublicateItemlist && optionalItems.dublicateItemlist.length > 0) {
            optionalItems.dublicateItemlist.map(optionalduplicateItems => {
              optionalduplicateItems.ispanelOpen = false;
            });
          }
        });
      }
      if (this.planDetail.itemList) {
        this.planDetail.itemList.map(items => {
          items.info.covered_item_list.map(coveredItems => {
            coveredItems.ispanelOpen = false;
            if (coveredItems.dublicateItemlist.length > 0) {
              coveredItems.dublicateItemlist.map(dplicateitems => {
                dplicateitems.ispanelOpen = false;
              });
            }
          });
        });
      }
      if (this.planDetail.optional_item.length > 0) {
        this.planDetail.optional_item.map(items => {
          items.ispanelOpen = false;
        });
      }
      this.planDetail.category_covered_item.map(items => {
        items.ispanelOpen = false;
      });
    }
    this.stepProcess[nextStep] = true;
    this.stepProcess[previousStep] = false;
  }
  backfrompaymentdetail() {
    if (this.coverAdditional.value === 'yes') {
      this.back('stepTen', 'stepeleven');
    } else {
      this.back('stepTen', 'stepfiveTeen');
    }
  }
  backtopropertytype() {
    this.event.setLoaderEmmit(false);
    if (this.propertypewecover.value.title === 'Single Family' || this.propertypewecover.value.title === 'Condominium' ||
      this.propertypewecover.value.title === 'Townhouse') {
      this.back('stepTwo', 'stepThree');
    } else {
      this.back('stepOne', 'stepThree');
    }
  }
  back(previousStep, nextStep) {
    this.viewmoreforbottombox = false;
    this.plansummary = {
      plan1stpanelState: false, plan2ndpanelState: false,
      plan3rdpanelState: false, plan4thpanelState: false,
      plan5thpanelState: false, plan6thpanelState: false,
      plan7thpanelState: false
    };
    this.gotoTop();
    if (this.planDetail) {
      if (this.planDetail.optionalItemcoverageCategory && this.planDetail.optionalItemcoverageCategory.length > 0) {
        this.planDetail.optionalItemcoverageCategory.map(optionalItems => {
          optionalItems.dublicateItemlist.map(optionalduplicateItems => {
            optionalduplicateItems.ispanelOpen = false;
          });
        });
      }
      this.planDetail.itemList.map(items => {
        items.info.covered_item_list.map(coveredItems => {
          coveredItems.ispanelOpen = false;
          if (coveredItems.dublicateItemlist.length > 0) {
            coveredItems.dublicateItemlist.map(dplicateitems => {
              dplicateitems.ispanelOpen = false;
            });
          }
        });
      });
      this.planDetail.optional_item.map(items => {
        items.ispanelOpen = false;
      });
      this.planDetail.category_covered_item.map(items => {
        items.ispanelOpen = false;
      });
    }
    this.stepProcess[nextStep] = false;
    this.stepProcess[previousStep] = true;
  }
  getaListingData() {
    return new Promise<void>((resolve, rejects) => {
      this.api.get('plan-property-type/list').toPromise().then((res: any) => {
        if (res && this.api.isExist(res.data)) {
          if (res.data.length > 0) {
            this.propertyType = res.data;
            const index = this.propertyType.findIndex(indx => indx.title.toLowerCase() === 'single family');
            this.arraymove(this.propertyType, index, 0);
          } else {
            this.propertyType = undefined;
          }
        }
      }).then(() => {
        this.api.get('plan-property-size/list').toPromise().then((res: any) => {
          if (res && this.api.isExist(res.data)) {
            if (res.data.length > 0) {
              this.propertySize = res.data;
            } else {
              this.propertySize = undefined;
            }
          } else {
            this.propertySize = undefined;
          }
        }).then(() => {
          this.patchData();
        });
      });
    });

  }
  getPlanDetail(planId) {
    return new Promise<void>((resolve, reject) => {
      this.api.get(`plan/${planId}`).toPromise().then((res: any) => {
        if (res && this.api.isExist(res.data)) {
          this.planDetail = res.data;
          this.planDetail.itemcanberemove = Number(this.planDetail.item_removal);
          const tempstatearr = [];
          res.data.state_data.forEach(state => {
            if (state.state.length !== 0) {
              const tempstateobj = {
                additional_cost: state.additional_cost,
                salex_tax: state.salex_tax,
                state_name: state.state[0].title,
                state_id: state.state_id,
                surcharge: state.surcharge,
                state_type: state.state[0].type
              };
              tempstatearr.push(tempstateobj);
            }
          });
          this.savequotes({ step13: { state_data: tempstatearr } });
          resolve();
        } else {
          this.planDetail = undefined;
          resolve();
        }
      }).then(() => {
        this.getCovereditemList(planId);
      });
    });
  }
  getCovereditemList(planId) {
    const data = {
      _id: planId,
      property_type_id: this.propertypewecover.value._id,
      property_size_id: this.propertySizeweCover.value ? this.propertySizeweCover.value._id : '5fe1fab1707ef30db84c1bce'
    };
    this.api.post(`plan/details`, data).subscribe((res: any) => {
      if (res && this.api.isExist(res.data)) {
        this.planDetail.itemList = [];
        this.planDetail.itemList = res.data.property_pricing;
        this.planDetail.itemList[0].info.covered_item_list = this.planDetail.itemList[0].info.covered_item_list.filter(item =>
          item.covered_item_id.type !== 'optional');
        this.planDetail.totalAddedItems = 0;
        this.planDetail.totaladdedprice = 0;
        this.planDetail.totalOptionalItems = 0;
        this.planDetail.totalAddedCoverage = 0 + Number(this.planDetail.itemList[0].info.maximum_coverage_per_unit ?
          this.planDetail.itemList[0].info.maximum_coverage_per_unit : this.planDetail.maximum_aggregated_coverage);
        this.planDetail.optionalCoverage = 0;
        this.planDetail.totalitemCoverage = 0;
        this.planDetail.totalOptionalItemsCost = 0;
        this.planDetail.totaladdedCostForCoverage = 0;
        this.planDetail.totalAddedCoverageAmount = 0;
        this.planDetail.totalCategorycoverage = 0;
        this.planDetail.coveragefee = 0;
        this.planDetail.optionalItemcoverageCategory = [];
        this.planDetail.coverageAddedItemList = [];
        this.planDetail.categorycoverageAddedItemList = [];
        this.planDetail.state_data = this.planDetail.state_data.filter(each => each.state.length > 0);
        if (this.storage.getcheckoutdata()) {
          const index = this.planDetail.state_data.findIndex(state =>
            state.state[0].title.toLowerCase() ===
            (this.storage.getcheckoutdata() ? this.storage.getcheckoutdata()[0].step1.property_state.toLowerCase() : ''));
          if (index !== -1) {
            this.planDetail.state_data = this.planDetail.state_data[index];
          } else {
            this.planDetail.state_data = {};
          }
        }
        this.planDetail.itemList[0].info.cost_per_plan = Number(this.planDetail.itemList[0].info.cost_per_plan);
        this.planDetail.itemList.map(items => {
          items.info.covered_item_list.map(coveredItems => {
            if (this.planDetail.plan_type === 'custom') {
              coveredItems.quantity = 0;
            }
            if (coveredItems.covered_item_id.type === 'appliance') {
              this.planDetail.isShowappliance = true;
            }
            if (coveredItems.covered_item_id.type === 'system') {
              this.planDetail.isShowsystem = true;
            }
            const coveredItem = coveredItems.covered_item_id.coverage_limit.split('.');
            if (coveredItem) {
              const matches = coveredItem[0].match(/\d+/g);
              if (matches) {
                coveredItems.covrageValue = Number(matches[0] + (matches[1] ? matches[1] : ''));
              }
            }
            coveredItems.totalCoverageValue = 0;
            coveredItems.coveredunit = coveredItems.quantity;
            coveredItems.additionalunitdefaultvalue = 0;
            coveredItems.addedcosttotal = 0;
            coveredItems.defaultCoverage = 0;
            coveredItems.totalincreseCoverageValue = 0;
            coveredItems.coverageValueForDuplicatesec = 0;
            coveredItems.coverageaddedcostForDuplicates = 0;
            coveredItems.dublicateItemlist = [];
            if ((coveredItems.additionalunitdefaultvalue + coveredItems.coveredunit) >= 1) {
              for (let coveredindex = 0; coveredindex < coveredItems.coveredunit; coveredindex++) {
                const objtopush = {
                  addedcosttotal: coveredItems.addedcosttotal, additionalunitdefaultvalue: coveredItems.additionalunitdefaultvalue,
                  category_decrease: coveredItems.category_decrease, category_increase: coveredItems.category_increase,
                  covered_item_id: coveredItems.covered_item_id, coveredunit: coveredItems.coveredunit,
                  covrageValue: coveredItems.covrageValue, defaultCoverage: coveredItems.defaultCoverage,
                  discount_four: coveredItems.discount_four, discount_more: coveredItems.discount_more,
                  discount_three: coveredItems.discount_three, discount_two: coveredItems.discount_two,
                  price: coveredItems.price, quantity: coveredItems.quantity,
                  totalCoverageValue: coveredItems.totalCoverageValue, totalincreseCoverageValue: coveredItems.totalincreseCoverageValue,
                  _id: coveredItems._id, count: JSON.stringify((coveredindex + 1))
                };
                coveredItems.dublicateItemlist.push(objtopush);
              }
            }
          });
        });

        // ==============================================================================
        this.planDetail.optional_item.map(optionalitems => {
          if (optionalitems.covered_item[0]) {
            const coveredItem = optionalitems.covered_item[0].coverage_limit.split('.');
            if (coveredItem) {
              const matches = coveredItem[0].match(/\d+/g);
              if (matches) {
                optionalitems.covrageValue = Number(matches[0] + (matches[1] ? matches[1] : ''));
              }
            }
          }
          optionalitems.totalCoverageValue = 0;
          optionalitems.coveredunit = 0;
          optionalitems.additionalunitdefaultvalue = 0;
          optionalitems.addedcosttotal = 0;
          optionalitems.defaultCoverage = 0;
          optionalitems.totalincreseCoverageValue = 0;
          optionalitems.increseCoverageFee = 0;
          optionalitems.dublicateItemlist = [];
        });
        this.planDetail.totalCoveredUnit = this.planDetail.itemList[0].info.covered_item_list.reduce((acc, cur) =>
          acc + Number(cur.quantity + cur.additionalunitdefaultvalue), 0);
        this.planDetail.optional_item = this.planDetail.optional_item.filter(item => item.covered_item.length > 0);
        this.planDetail.category_covered_item = this.planDetail.category_covered_item.filter(item => item.category.length > 0);
        this.planDetail.category_covered_item = this.planDetail.category_covered_item.map(catogeryCoverage => {
          catogeryCoverage.defaultcategoryCoverage = 0;
          return catogeryCoverage;
        });
      } else {
      }
      this.patchcovereditemlist(this.planDetail, this.planDetail.optional_item);
    });
  }
  patchcovereditemlist(planDetail, optionalitem) {
    if (this.cartEditdata) {
      const objkeyarr = ['addedcosttotal', 'additionalunitdefaultvalue',
        'coverageValueForDuplicatesec', 'coverageaddedcostForDuplicates', 'coveredunit', 'covrageValue', 'defaultCoverage',
        'quantity', 'totalCoverageValue', 'totalincreseCoverageValue', 'dublicateItemlist',
        'maximum_allowed_increase', 'maximum_allowed_decrease', 'increseCoverageFee'];
      const coverageSelection = this.cartEditdata.step12.coverage_selection;
      this.cartEditdata.step12.coverage_selection = this.cartEditdata.step12.coverage_selection.map(c => {
        if (c.type === '') {
          c.covered_item_id = {};
          c.covered_item_id.title = c.title;
        } else if (c.type === 'optional') {
          c.covered_item = [{}];
          c.covered_item[0].title = c.title;
        }
        return c;
      });
      this.planDetail.coverageAddedItemList = this.cartEditdata.step12.coverage_selection;
      planDetail.itemList[0].info.covered_item_list = planDetail.itemList[0].info.covered_item_list.map(coveredelement => {
        this.cartEditdata.step8.covered_item_list.map(cartcoveredelement => {
          if (coveredelement.covered_item_id.title === cartcoveredelement.title) {
            for (const [index, val] of objkeyarr.entries()) {
              coveredelement[objkeyarr[index]] = cartcoveredelement[objkeyarr[index]];
            }
          }
        });
        if (coveredelement.dublicateItemlist.length > 0) {
          coveredelement.dublicateItemlist.map(duplicate => {
            if (coveredelement.covered_item_id) {
              duplicate.maximum_allowed_increase = coveredelement.covered_item_id.maximum_allowed_increase;
              duplicate.maximum_allowed_decrease = coveredelement.covered_item_id.maximum_allowed_decrease;
              duplicate.maximum_coverage_decrease_fee = coveredelement.covered_item_id.maximum_coverage_decrease_fee;
              duplicate.maximum_coverage_increase_fee = coveredelement.covered_item_id.maximum_coverage_increase_fee;
            }
          });
        }
        coverageSelection.forEach(coverage => {
          if (coverage.title === coveredelement.covered_item_id.title) {
            if (coverage.type === '') {
              if ((coveredelement.coveredunit + coveredelement.additionalunitdefaultvalue) === 1) {
                coveredelement.defaultCoverage = coverage.defaultCoverage;
                coveredelement.totalincreseCoverageValue = coverage.totalincreseCoverageValue;
              }
              coveredelement.dublicateItemlist.forEach(duplicate => {
                if ((duplicate.title + duplicate.count) === (coverage.title + coverage.count)) {
                  duplicate.defaultCoverage = coverage.defaultCoverage;
                  duplicate.totalincreseCoverageValue = coverage.totalincreseCoverageValue;
                }
              });
            }
          }
        });
        return coveredelement;
      });

      optionalitem = optionalitem.map(optional => {
        this.cartEditdata.step9.optional_item.map(cartoptionallement => {
          if (optional.covered_item[0].title === cartoptionallement.title) {
            for (const [index, val] of objkeyarr.entries()) {
              optional[objkeyarr[index]] = cartoptionallement[objkeyarr[index]];
            }
            if (optional.dublicateItemlist.length > 0) {
              optional.dublicateItemlist.map(duplicate => {
                if (optional.covered_item) {
                  duplicate.maximum_allowed_increase = optional.covered_item[0].maximum_allowed_increase;
                  duplicate.maximum_allowed_decrease = optional.covered_item[0].maximum_allowed_decrease;
                }
              });
            }
            const itemindex = _.findIndex(this.planDetail.optionalItemcoverageCategory, { title: optional.covered_item[0].title });
            if (itemindex === -1) {
              this.planDetail.optionalItemcoverageCategory.push(optional);
            }
          }
        });
        if (coverageSelection.length > 0) {
          coverageSelection.forEach(coverageelement => {
            if (coverageelement.type === 'optional') {
              if (coverageelement.title === optional.covered_item[0].title) {
                if ((optional.coveredunit + optional.additionalunitdefaultvalue) === 1) {
                  optional.defaultCoverage = coverageelement.defaultCoverage;
                  optional.increseCoverageFee = coverageelement.increseCoverageFee;
                  optional.totalincreseCoverageValue = coverageelement.totalincreseCoverageValue;
                }
                optional.dublicateItemlist.forEach(duplicate => {
                  if ((duplicate.title + duplicate.count) === (coverageelement.title + coverageelement.count)) {
                    duplicate.defaultCoverage = coverageelement.defaultCoverage;
                    duplicate.increseCoverageFee = coverageelement.increseCoverageFee;
                    duplicate.totalincreseCoverageValue = coverageelement.totalincreseCoverageValue;
                  }
                });
              }
            }
          });
        }
        return optional;
      });
      this.planDetail.totalAddedItems = planDetail.itemList[0].info.covered_item_list.reduce((acc, cur) =>
        acc + Number(cur.additionalunitdefaultvalue), 0);
      this.planDetail.totaladdedprice = planDetail.itemList[0].info.covered_item_list.reduce((acccost, curcost) =>
        acccost + Number(curcost.addedcosttotal), 0);
      this.planDetail.totalAddedCoverage = Number(this.planDetail.itemList[0].info.maximum_coverage_per_unit ?
        this.planDetail.itemList[0].info.maximum_coverage_per_unit : this.planDetail.maximum_aggregated_coverage)
        +
        this.planDetail.itemList[0].info.covered_item_list.reduce((acccost, curcost) =>
          acccost + Number(curcost.totalCoverageValue), 0);
      this.planDetail.totalOptionalItems = this.planDetail.optional_item.reduce((acc, cur) =>
        acc + Number(cur.additionalunitdefaultvalue), 0);
      this.planDetail.totalOptionalItemsCost = this.planDetail.optional_item.reduce((acc, cur) =>
        acc + Number(cur.addedcosttotal), 0);
      this.calculateaddedcoverageamount();
      this.calculateCostForCoverage();
    }
  }
  // >>> Functions for calculation on adding and removing the items
  addremoveitem(item, type) {
    if (type === 'dec') {
      if ((item.additionalunitdefaultvalue + item.coveredunit) > 0 &&
        this.planDetail.itemcanberemove > 0) {
        item.additionalunitdefaultvalue = item.additionalunitdefaultvalue - 1;
        if (item.additionalunitdefaultvalue < 0) {
          this.planDetail.itemcanberemove -= 1;
        }
      } else if (item.additionalunitdefaultvalue > 0) {
        item.additionalunitdefaultvalue = item.additionalunitdefaultvalue - 1;
      }
      this.createduplicatedata(item, 'dec');
    } else {
      item.additionalunitdefaultvalue = item.additionalunitdefaultvalue + 1;
      if (item.additionalunitdefaultvalue <= 0 && this.planDetail.itemcanberemove < Number(this.planDetail.item_removal)) {
        this.planDetail.itemcanberemove += 1;
      }
      this.createduplicatedata(item, 'inc');
    }
    if (item.additionalunitdefaultvalue >= 0) {
      item.totalCoverageValue = ((item.covrageValue * item.additionalunitdefaultvalue)
        * Number(this.planDetail.automated_aggregated_increase)) / 100;
    }
    if (item.additionalunitdefaultvalue < 0) {
      item.totalCoverageValue = ((item.covrageValue * item.additionalunitdefaultvalue) *
        Number(this.planDetail.automated_aggregated_decrease)) / 100;
    }
    this.totaladdedcost(item);
    if (this.planDetail) {
      if (this.planDetail.itemList) {
        if (this.planDetail.itemList[0].info) {
          this.planDetail.totalAddedItems = this.planDetail.itemList[0].info.covered_item_list.reduce((acc, cur) =>
            acc + Number(cur.additionalunitdefaultvalue), 0);
          this.planDetail.totaladdedprice = this.planDetail.itemList[0].info.covered_item_list.reduce((acccost, curcost) =>
            acccost + Number(curcost.addedcosttotal), 0);
          this.planDetail.totalAddedCoverage = Number(this.planDetail.itemList[0].info.maximum_coverage_per_unit ?
            this.planDetail.itemList[0].info.maximum_coverage_per_unit : this.planDetail.maximum_aggregated_coverage)
            +
            this.planDetail.itemList[0].info.covered_item_list.reduce((acccost, curcost) =>
              acccost + Number(curcost.totalCoverageValue), 0);
        }
      }
    }
    // ===================================================================================
  }
  createduplicatedata(item?, type?) {
    if (type === 'inc') {
      if (this.planDetail.itemList[0].info.covered_item_list) {
        this.planDetail.itemList[0].info.covered_item_list.map((coveredList: any) => {
          if (item.covered_item_id.title === coveredList.covered_item_id.title) {
            const objtopush = {
              addedcosttotal: item.addedcosttotal, additionalunitdefaultvalue: item.additionalunitdefaultvalue,
              category_decrease: item.category_decrease, category_increase: item.category_increase,
              covered_item_id: item.covered_item_id, coveredunit: item.coveredunit,
              covrageValue: item.covrageValue, defaultCoverage: item.defaultCoverage,
              discount_four: item.discount_four, discount_more: item.discount_more,
              discount_three: item.discount_three, discount_two: item.discount_two,
              price: item.price, quantity: item.quantity,
              totalCoverageValue: item.totalCoverageValue, totalincreseCoverageValue: item.totalincreseCoverageValue,
              _id: item._id, count: JSON.stringify(item.additionalunitdefaultvalue + item.coveredunit)
            };
            if ((item.additionalunitdefaultvalue + item.coveredunit) >= 0) {
              coveredList.dublicateItemlist.push(objtopush);
            }
          }
        });
      }
    } else {
      if (this.planDetail.itemList[0].info.covered_item_list) {
        this.planDetail.itemList[0].info.covered_item_list.map((coveredList: any) => {
          if (item.covered_item_id.title === coveredList.covered_item_id.title) {
            if ((item.additionalunitdefaultvalue + item.coveredunit) >= 0) {
              coveredList.dublicateItemlist.splice((coveredList.dublicateItemlist.length - 1), 1);
            }
          }
        });
      }
    }

  }

  // Functions for calculation on adding and removing on type the value on input
  onChangeEventforQty(item, event) {
    if (event.target.value !== '') {
      item.additionalunitdefaultvalue = Number(event.target.value);
    } else {
      item.additionalunitdefaultvalue = 0;
    }
  }
  totaladdedcost(item) {
    if (item.additionalunitdefaultvalue < 0) {
      item.addedcosttotal = item.covered_item_id.item_removal_price * item.additionalunitdefaultvalue;
    } else {
      item.addedcosttotal = item.price * item.additionalunitdefaultvalue;
    }
    return item.price * item.additionalunitdefaultvalue;
  }
  addremoveOptionalitems(item, type) {
    if (type === 'dec') {
      if (item.additionalunitdefaultvalue > 0) {
        item.additionalunitdefaultvalue = item.additionalunitdefaultvalue - 1;
      }
    } else {
      item.additionalunitdefaultvalue = item.additionalunitdefaultvalue + 1;
    }
    // ================================================================
    const index = this.planDetail.optionalItemcoverageCategory.findIndex(each => each.covered_item[0].title === item.covered_item[0].title);
    if (index === -1 && item.additionalunitdefaultvalue > 0) {
      item.coverageValueForDuplicatesec = 0;
      item.coverageaddedcostForDuplicates = 0;
      this.planDetail.optionalItemcoverageCategory.push(item);
    } else {
      if ((item.coveredunit + item.additionalunitdefaultvalue) === 0) {
        if (index !== -1) {
          this.planDetail.coverageAddedItemList = this.planDetail.coverageAddedItemList.filter(each => each.covered_item[0].title !==
            this.planDetail.optionalItemcoverageCategory[index].covered_item[0].title);
          this.planDetail.optionalItemcoverageCategory.splice(index, 1);
        }
      }
    }
    if (type === 'dec') {
      this.planDetail.optionalItemcoverageCategory.map((optionalitemList: any) => {
        if (item.covered_item[0].title === optionalitemList.covered_item[0].title) {
          const lastremoveitem = optionalitemList.dublicateItemlist[optionalitemList.dublicateItemlist.length - 1];
          this.planDetail.coverageAddedItemList.map((addedItems, addedItemsindex) => {
            if ((lastremoveitem.covered_item[0].title + '*' + lastremoveitem.count) ===
              (addedItems.covered_item[0] ? addedItems.covered_item[0].title
                : addedItems.covered_item_id.title) + (addedItems.count ? '*' + addedItems.count : '')) {
              this.planDetail.coverageAddedItemList.splice(addedItemsindex, 1);
            }
          });
          if ((item.additionalunitdefaultvalue + item.coveredunit) >= 0) {
            optionalitemList.dublicateItemlist.splice((optionalitemList.dublicateItemlist.length - 1), 1);
          }
        }
      });
    } else {
      if (this.planDetail.optionalItemcoverageCategory.length > 0) {
        this.planDetail.optionalItemcoverageCategory.map((optionalitemList: any) => {
          if (item.covered_item[0].title === optionalitemList.covered_item[0].title) {
            const objtopush = {
              addedcosttotal: item.addedcosttotal, additionalunitdefaultvalue: item.additionalunitdefaultvalue,
              covered_item: item.covered_item, coveredunit: item.coveredunit,
              covrageValue: item.covrageValue, defaultCoverage: item.defaultCoverage,
              quantity: item.quantity,
              totalCoverageValue: item.totalCoverageValue, totalincreseCoverageValue: item.totalincreseCoverageValue,
              _id: item._id, count: JSON.stringify(item.additionalunitdefaultvalue + item.coveredunit)
            };
            if ((item.additionalunitdefaultvalue + item.coveredunit) >= 0) {
              if (optionalitemList.dublicateItemlist.length > 0) {
                const itemindex = optionalitemList.dublicateItemlist.findIndex(each => (each.covered_item[0].title + '*' + each.count)
                  !== (objtopush.covered_item[0].title + '*' + objtopush.count));
                if (itemindex !== -1) {
                  optionalitemList.dublicateItemlist.push(objtopush);
                }
              } else {
                optionalitemList.dublicateItemlist.push(objtopush);
              }
            }
          }
        });
      }
    }
    // ================================================================
    if (item.additionalunitdefaultvalue >= 0) {
      item.totalCoverageValue = ((item.covrageValue * item.additionalunitdefaultvalue)
        * Number(this.planDetail.automated_aggregated_increase)) / 100;
    }
    item.addedcosttotal = item.quantity * item.additionalunitdefaultvalue;
    this.planDetail.totalOptionalItems = this.planDetail.optional_item.reduce((acc, cur) =>
      acc + Number(cur.additionalunitdefaultvalue), 0);
    this.planDetail.totalOptionalItemsCost = this.planDetail.optional_item.reduce((acc, cur) =>
      acc + Number(cur.addedcosttotal), 0);
  }

  addTotaloptionalCoverage() {
    this.planDetail.optionalCoverage = this.planDetail.optional_item.reduce((acccost, curcost) =>
      acccost + Number(curcost.totalCoverageValue), 0);
    return this.planDetail.optionalCoverage;
  }
  // >>>>>Functions for calculation on adding and removing the items >>>>>>
  // =========================================================================================
  // >>>Functions for calculation on adding and removing Coverage
  incrementCovrage(item, type) {
    if (!item.covered_item_id) {
      item.covered_item_id = {};
      item.covered_item_id.title = item.title;
      item.covered_item_id.maximum_allowed_decrease = item.maximum_allowed_decrease;
      item.covered_item_id.maximum_allowed_increase = item.maximum_allowed_increase;
      item.covered_item_id.maximum_coverage_increase_fee = item.maximum_coverage_increase_fee;
      item.covered_item_id.maximum_coverage_decrease_fee = item.maximum_coverage_decrease_fee;
    }
    if (type === 'dec') {
      if (item.defaultCoverage > (-item.covered_item_id.maximum_allowed_decrease)) {
        item.defaultCoverage = item.defaultCoverage - 100;
      }
    } else {
      if (item.defaultCoverage < (item.covered_item_id.maximum_allowed_decrease)) {
        item.defaultCoverage = item.defaultCoverage + 100;
      }
    }
    // ========================================================
    item.totalincreseCoverageValue = (item.defaultCoverage *
      (item.defaultCoverage > 0 ?
        item?.covered_item_id.maximum_coverage_increase_fee : item?.covered_item_id.maximum_coverage_decrease_fee)) / 100;

    item.increseCoverageFee = (item.defaultCoverage *
      (item.defaultCoverage > 0 ?
        this.planDetail.automated_aggregated_increase : this.planDetail.automated_aggregated_decrease)) / 100;
    // ==============================================
    // ========================================================
    this.calculateaddedcoverageamount();
    this.calculateCostForCoverage();
    // ==============================================
    let addCoverageforaplliances = 0;
    let addCoverageforaplliancesduplicate = 0;
    let addCoverageforsystem = 0;
    let addCoverageforsystemduplicate = 0;
    this.planDetail.itemList[0].info.covered_item_list.map(itemforCoverage => {
      if (itemforCoverage.covered_item_id.type === 'appliance') {
        if (itemforCoverage.increseCoverageFee) {
          addCoverageforaplliances += itemforCoverage.increseCoverageFee;
        }
      }
      if (itemforCoverage.covered_item_id.type === 'system') {
        if (itemforCoverage.increseCoverageFee) {
          addCoverageforsystem += itemforCoverage.increseCoverageFee;
        }
      }
      if (itemforCoverage.dublicateItemlist.length > 0) {
        itemforCoverage.dublicateItemlist.map(itemforCoverageforduplicate => {
          if (itemforCoverage.covered_item_id.type === 'appliance') {
            if (itemforCoverageforduplicate.increseCoverageFee) {
              addCoverageforaplliancesduplicate += itemforCoverageforduplicate.increseCoverageFee;
            }
          }
          if (itemforCoverage.covered_item_id.type === 'system') {
            if (itemforCoverageforduplicate.increseCoverageFee) {
              addCoverageforsystemduplicate += itemforCoverageforduplicate.increseCoverageFee;
            }
          }
        });
      }
    });
    this.planDetail.totaladdedCostForapllianceCoverage = (addCoverageforaplliances + addCoverageforaplliancesduplicate);
    this.planDetail.totaladdedCostForsystemCoverage = (addCoverageforsystem + addCoverageforsystemduplicate);
    // ========================================================
    this.addSelectedValue(item);
    // ========================================================
  }
  addSelectedValue(item) {
    let index;
    if (item.count) {
      index = this.planDetail.coverageAddedItemList.findIndex(each =>
        (each.covered_item_id ? each.covered_item_id.title : each.covered_item[0].title) + '*' + (each.count ? each.count : '')
        === item.covered_item_id.title + '*' + item.count);
    } else {
      index = this.planDetail.coverageAddedItemList.findIndex(each =>
        (each.covered_item_id ? each.covered_item_id.title : each.covered_item[0].title) === item.covered_item_id.title);
    }
    if (index === -1) {
      this.planDetail.coverageAddedItemList.push(item);
    } else {
      if ((item.defaultCoverage) === 0) {
        if (index !== -1) {
          this.planDetail.coverageAddedItemList.splice(index, 1);
        }
      }
    }
  }

  calculateCostForCoverage(): any {
    let tempcoverageaddedValue = 0;
    let tempcoveragefeeaddedValue = 0;
    this.planDetail.itemList[0].info.covered_item_list.map(coverageItems => {
      if (coverageItems.totalincreseCoverageValue) {
        tempcoverageaddedValue += coverageItems.totalincreseCoverageValue;
      }
      if (coverageItems.increseCoverageFee) {
        tempcoveragefeeaddedValue += coverageItems.increseCoverageFee;
      }
      if (coverageItems.dublicateItemlist.length > 0) {
        coverageItems.dublicateItemlist.map(covereageduplicateitems => {
          if (covereageduplicateitems.totalincreseCoverageValue) {
            tempcoverageaddedValue += covereageduplicateitems.totalincreseCoverageValue;
          }
          if (covereageduplicateitems.increseCoverageFee) {
            tempcoveragefeeaddedValue += covereageduplicateitems.increseCoverageFee;
          }
        });
      }
    });
    // ========================================================================
    this.planDetail.optionalItemcoverageCategory.map(optionalItems => {
      if (optionalItems.totalincreseCoverageValue) {
        tempcoverageaddedValue += optionalItems.totalincreseCoverageValue;
      }
      if (optionalItems.dublicateItemlist.length > 0) {
        optionalItems.dublicateItemlist.map(optionalduplicateitems => {
          if (optionalduplicateitems.totalincreseCoverageValue) {
            tempcoverageaddedValue += optionalduplicateitems.totalincreseCoverageValue;
          }
        });
        if (optionalItems.increseCoverageFee) {
          tempcoveragefeeaddedValue += optionalItems.increseCoverageFee;
        }
        optionalItems.dublicateItemlist.map(optionalduplicateitem => {
          if (optionalduplicateitem.increseCoverageFee) {
            tempcoveragefeeaddedValue += optionalduplicateitem.increseCoverageFee;
          }
        });
      }
    });
    this.planDetail.totaladdedCostForCoverage = tempcoverageaddedValue;
    this.planDetail.coveragefee = tempcoveragefeeaddedValue;
    console.log(this.planDetail.coveragefee);
    // =========================================================================
  }
  calculateaddedcoverageamount(): any {
    let tempcoverageamount = 0;
    const newArray = this.planDetail.itemList[0].info.covered_item_list.concat(this.planDetail.optionalItemcoverageCategory);
    console.log(newArray);
    if (newArray.length > 0) {
      newArray.map(items => {
        if (items.defaultCoverage) {
          tempcoverageamount += items.defaultCoverage;
        }
        if (items.dublicateItemlist.length > 0) {
          items.dublicateItemlist.map(covereageduplicateitems => {
            if (covereageduplicateitems.defaultCoverage) {
              tempcoverageamount += covereageduplicateitems.defaultCoverage;
            }
          });
        }
      });
    }
    this.planDetail.totalitemCoverage = tempcoverageamount;
  }
  incrementCovrageforOptional(item, type) {
    if (!item.covered_item) {
      item.covered_item = [{}];
      item.covered_item[0].title = item.title;
      item.covered_item[0].maximum_allowed_decrease = item.maximum_allowed_decrease;
      item.covered_item[0].maximum_allowed_increase = item.maximum_allowed_increase;
      item.covered_item[0].maximum_coverage_increase_fee = item.maximum_coverage_increase_fee;
      item.covered_item[0].maximum_coverage_decrease_fee = item.maximum_coverage_decrease_fee;
    }
    if (type === 'dec') {
      if (item.defaultCoverage > (-item.covered_item[0].maximum_allowed_decrease)) {
        item.defaultCoverage = item.defaultCoverage - 100;
      }
    } else {
      if (item.defaultCoverage < (item.covered_item[0].maximum_allowed_increase)) {
        item.defaultCoverage = item.defaultCoverage + 100;
      }
    }
    // ==============================================================
    // ==============================================
    item.totalincreseCoverageValue = (item.defaultCoverage *
      (item.defaultCoverage > 0 ?
        (item?.covered_item[0].maximum_coverage_increase_fee) : (item?.covered_item[0].maximum_coverage_decrease_fee))) / 100;

    item.increseCoverageFee = (item.defaultCoverage *
      (item.defaultCoverage > 0 ?
        this.planDetail.automated_aggregated_increase : this.planDetail.automated_aggregated_decrease)) / 100;
    // ==============================================
    let addCoverageforOptional = 0;
    let addCoverageforOptionalduplicate = 0;
    this.planDetail.optionalItemcoverageCategory.map(categoryItems => {
      categoryItems.coverageaddedcostForDuplicates = categoryItems.dublicateItemlist.reduce((acccost, curcost) =>
        acccost + Number(curcost.increseCoverageFee), 0);
      categoryItems.coverageValueForDuplicatesec = (categoryItems.dublicateItemlist.reduce((acccost, curcost) =>
        acccost + Number(curcost.defaultCoverage), 0));
      if (categoryItems.increseCoverageFee) {
        addCoverageforOptional += categoryItems.increseCoverageFee;
      }
      if (categoryItems.dublicateItemlist.length > 0) {
        categoryItems.dublicateItemlist.map(itemforCoverageforduplicate => {
          if (itemforCoverageforduplicate.increseCoverageFee) {
            addCoverageforOptionalduplicate += itemforCoverageforduplicate.increseCoverageFee;
          }
        });
      }
    });

    this.planDetail.totaladdedCostForOptionalCoverage = (addCoverageforOptional + addCoverageforOptionalduplicate);
    this.calculateaddedcoverageamount();
    this.calculateCostForCoverage();
    // ==============================================================
    let index;
    if (item.count) {
      index = this.planDetail.coverageAddedItemList.findIndex(each =>
        (((each.covered_item_id && each.covered_item_id.title) ? each.covered_item_id.title :
          each.covered_item[0].title) + '*' + each.count)
        === (item.covered_item[0].title + '*' + item.count));
    } else {
      index = this.planDetail.coverageAddedItemList.findIndex(each =>
        (each.covered_item_id && each.covered_item_id.title ? each.covered_item_id.title :
          each.covered_item[0].title) === (item.covered_item[0].title));
    }
    if (index === -1) {
      item.isOptional = true;
      this.planDetail.coverageAddedItemList.push(item);
    } else {
      if ((item.defaultCoverage) === 0) {
        if (index !== -1) {
          this.planDetail.coverageAddedItemList.splice(index, 1);
        }
      }
    }
    // ==============================================================
  }
  // Functions for calculation on adding and removing on type the value on input
  onTypeCoverageValue(item, event) {
    if (!_.isNaN((Number(event.target.value))) && event.target.value !== ''
      && Number(event.target.value) <= Number(item.covered_item_id.maximum_allowed_increase)) {
      item.defaultCoverage = Number(event.target.value);
    } else {
      item.defaultCoverage = 0;
    }
    item.totalincreseCoverageValue = (item.defaultCoverage > 0 ?
      item?.covered_item_id.maximum_coverage_increase_fee : item?.covered_item_id.maximum_coverage_decrease_fee) / 100;
    item.increseCoverageFee = (item.defaultCoverage *
      (item.defaultCoverage > 0 ?
        this.planDetail.automated_aggregated_increase : this.planDetail.automated_aggregated_decrease)) / 100;
    this.calculateaddedcoverageamount();
    this.calculateCostForCoverage();
    this.addSelectedValue(item);
  }
  // >>>> Functions for calculation on adding and removing the Coverage >>>>>

  incrementCatgoryCovrage(item, type) {
    if (type === 'dec') {
      if (item.defaultcategoryCoverage > 0) {
        item.defaultcategoryCoverage = item.defaultcategoryCoverage - 100;
      } else {
        if ((item.category[0].category_coverage_decrease_fee)
          && (item.defaultcategoryCoverage > (-item.category[0].maximum_category_coverage_decrase))) {
          item.defaultcategoryCoverage = item.defaultcategoryCoverage - 100;
        }
      }
    } else {
      if (item.defaultcategoryCoverage < item.category[0].maximum_category_coverage_increase) {
        item.defaultcategoryCoverage = item.defaultcategoryCoverage + 100;
      }
    }
    item.totalCalculatedCost = ((item.defaultcategoryCoverage) *
      (item.defaultcategoryCoverage > 0 ? item.category[0].category_coverage_increase_fee :
        item.category[0].category_coverage_decrease_fee)) / 100;
    item.categoryCoverageamount = ((item.defaultcategoryCoverage) *
      (item.defaultcategoryCoverage > 0 ?
        (item.category[0].automated_category_increase ?
          item.category[0].automated_category_increase : this.planDetail.automated_aggregated_increase) :
        (item.category[0].automated_category_decrease ?
          item.category[0].automated_category_decrease : this.planDetail.automated_aggregated_decrease))) / 100;
    this.planDetail.totalCategorycoverage = this.planDetail.category_covered_item.reduce((acccost, curcost) =>
      acccost + Number(curcost.totalCalculatedCost ? curcost.totalCalculatedCost : 0), 0);
    this.planDetail.totalAddedCoverageAmount = this.planDetail.category_covered_item.reduce((acccost, curcost) =>
      acccost + Number(curcost.defaultcategoryCoverage), 0);
    this.planDetail.addCoverageAmount = this.planDetail.category_covered_item.reduce(
      (acccost, curcost) => acccost + Number(curcost.categoryCoverageamount ? curcost.categoryCoverageamount : 0), 0);
    // ========================================================
    const index = this.planDetail.categorycoverageAddedItemList.findIndex(each =>
      each.category[0].name.trim().toLowerCase() === item.category[0].name.trim().toLowerCase());
    if (index === -1 && (item.defaultcategoryCoverage) !== 0) {
      this.planDetail.categorycoverageAddedItemList.push(item);
    } else {
      if ((item.defaultcategoryCoverage) === 0) {
        if (index !== -1) {
          this.planDetail.categorycoverageAddedItemList.splice(index, 1);
        }
      }
    }
    // ========================================================
  }

  totalappliacesCategorycoverage(item) {
    let add = 0;
    this.planDetail.itemList[0].info.covered_item_list.map((acccost) => {
      if (acccost.covered_item_id.type === 'appliance') {
        add += acccost.totalCoverageValue;
      }
    });
    return (item.category[0].maximum_category_coverage + add +
      (this.planDetail.totaladdedCostForapllianceCoverage ? this.planDetail.totaladdedCostForapllianceCoverage : 0));
  }
  totaloptionalCategorycoverage(item) {
    let add = 0;
    let restrictForcoverage = 0;
    this.planDetail.optional_item.map((acccost) => {
      add += acccost.totalCoverageValue;
    });
    this.planDetail.optionalItemcoverageCategory.map(optionalitem => {
      restrictForcoverage += optionalitem.additionalunitdefaultvalue;
    });
    if (restrictForcoverage < 6) {
      return item.category[0].maximum_category_coverage;
    } else {
      return (item.category[0].maximum_category_coverage + add + (this.planDetail.totaladdedCostForOptionalCoverage ?
        this.planDetail.totaladdedCostForOptionalCoverage : 0));
    }
  }
  totalsystemCategorycoverage(item) {
    let add = 0;
    this.planDetail.itemList[0].info.covered_item_list.map((acccost) => {
      if (acccost.covered_item_id.type === 'system') {
        add += acccost.totalCoverageValue;
      }
    });
    return (item.category[0].maximum_category_coverage + add + (this.planDetail.totaladdedCostForsystemCoverage ?
      this.planDetail.totaladdedCostForsystemCoverage : 0));
  }
  getPlanList() {
    const data = {
      property_type_id: this.propertypewecover.value._id,
      property_size_id: this.propertySizeweCover.value ? this.propertySizeweCover.value._id : '5fe1fab1707ef30db84c1bce'
    };
    this.api.post('plan/list', data).subscribe((res: any) => {
      if (res && this.api.isExist(res.data)) {
        if (res.data.length > 0) {
          this.planList = res.data;
          this.planList = this.planList.sort((a, b) => {
            if (a.sort_order !== null && b.sort_order !== null) {
              return a.sort_order - b.sort_order;
            }
          });
          this.planList.map(item => {
            item.isSelected = false;
            if (item.property_pricing.length > 0) {
              item.property_pricing[0].info.cost_per_plan = parseFloat(item.property_pricing[0].info.cost_per_plan).toFixed(2);
            }
            if (this.cartEditdata) {
              if (item.title.toLowerCase() === this.cartEditdata.step7.title.toLowerCase()) {
                item.isSelected = true;
                this.getPlanDetail(item._id);
              }
            }
          });
          this.planList = this.planList.filter(item => item.available_checkout === 'yes');
          this.planListModification(this.planList);
        } else {
          this.planList = undefined;
        }
      } else {
        this.planList = undefined;
      }
    });
  }
  planListModification(planList?) {
    this.PlanCustomarr.firstTwoplan = [];
    this.PlanCustomarr.restOfthePlan = [];
    this.PlanCustomarr.thirdPlan = [];
    for (let i = 0; i < 2; i++) {
      if (planList[i]) {
        this.PlanCustomarr.firstTwoplan.push(planList[i]);
      }
    }
    for (let i = 2; i < 3; i++) {
      if (planList[i]) {
        this.PlanCustomarr.thirdPlan.push(planList[i]);
      }
    }
    for (let i = 3; i < planList.length; i++) {
      if (planList[i]) {
        this.PlanCustomarr.restOfthePlan.push(planList[i]);
      }
    }
  }
  arraymove(arr, fromIndex, toIndex) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
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
          this.addressForm.setValue({
            street_address: '',
            apt: '',
            zipcode: '',
            city: '',
            state: ''
          });
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < place.address_components.length; i++) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < place.address_components[i].types.length; j++) {
              if (place.address_components[i].types[j] === 'route') {
                this.addressForm.patchValue({ street_address: place.name });
              }

              if (place.address_components[i].types[j] === 'postal_code') {
                this.addressForm.patchValue({ zipcode: place.address_components[i].long_name });
              }
              // tslint:disable-next-line:max-line-length

              if (place.address_components[i].types[j] === 'locality') {
                this.addressForm.patchValue({ city: place.address_components[i].long_name });
              }
              if (place.address_components[i].types[j] === 'sublocality_level_1') {
                this.addressForm.patchValue({ city: place.address_components[i].long_name });
              }
              if (place.address_components[i].types[j] === 'sublocality') {
                this.addressForm.patchValue({ city: place.address_components[i].long_name });
              }
              if (place.address_components[i].types[j] === 'administrative_area_level_1') {
                this.addressForm.patchValue({ state: place.address_components[i].long_name });
              }
            }
          }
          this.newFullAddres = place.formatted_address;
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
        });
      });
    });
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
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolsscheck();
    this.onmousemove();
  }

  onmousemove() {
    $(window).scroll(() => {
      $('.movabelsection').css({ top: ($(window).scrollTop()) + 'px' });
      if ($(window).scrollTop() > 1280) {
        $('.movabelsection').css({ position: 'relative' });
      } else {
        $('.movabelsection').css({ position: 'absolute' });
      }
    });
    $(window).scroll(() => {
      $('.movabelsectionnxt').css({ top: ($(window).scrollTop() - 2076) + 'px' });
      if ($(window).scrollTop() > 2750) {
        $('.movabelsectionnxt').css({ position: 'relative' });
      }
      if ($(window).scrollTop() < 2155) {
        $('.movabelsectionnxt').css({ position: 'relative' });
      } else {
        $('.movabelsectionnxt').css({ position: 'absolute' });
      }
    });
  }
  transformtonumber(val) {
    return Number(val);
  }

  async savequotes(value) {
    return new Promise((resolve, rejects) => {
      const api = this.api.post(`quote/update/${this.quoteId}`, value);
      api.subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            resolve(res);
          }
        },
        error: (err) => { },
        complete: () => { }
      });
    });
  }

  saveCarddetail() {
    if (this.cardDetail.valid) {
      // this.api.alert('Card details saved successfully', 'success');
      // this.cardDetail.reset();
    } else {
      this.cardDetail.markAllAsTouched();
    }
  }

  proceedPaypal() {
    let orderId;
    // paypal_sdk.Buttons({
    //   style: {
    //     layout: 'horizontal',
    //     shape: 'rect',
    //     size: 'small'
    //   },
    //   createOrder(data, actions) {
    //     console.log(101, data, actions);
    //     return actions.order.create({
    //       purchase_units: [{
    //         amount: {
    //           currency_code: 'USD',
    //           value: '1.00'
    //         }
    //       }]
    //     });
    //   },
    //   onApprove(data, actions) {
    //     console.log(111, data, actions);
    //     return actions.order.capture().then((details) => {
    //       console.log(details);
    // window.location.href = '/order-success.html';
    //     });
    //   }
    // }).render('#paypal-button-container');
    // If this returns false or the card fields aren't visible, see Step #1.


    if (paypal_sdk.HostedFields.isEligible()) {
      // Renders card fields
      paypal_sdk.HostedFields.render({
        // Call your server to set up the transaction
        createOrder: () => {
          return fetch('https://eliteerp-api.dedicateddevelopers.us/frontend/order/placeorder', {
            method: 'post'
          }).then((res) => {
            console.log(res);
            return res.json();
          }).then((orderData) => {
            console.log(orderData);
            orderId = orderData.data.id;
            return orderId;
          });
        },
        styles: {
          '.valid': {
            color: 'green'
          },
          '.invalid': {
            color: 'red'
          },
        },
        fields: {
          number: {
            container: '#card-number',
            selector: '#card-number',
            placeholder: '4111 1111 1111 1111',
            value: '4111 1111 1111 1111',
          },
          cvv: {
            container: '#cvv',
            selector: '#cvv',
            placeholder: '123',
            value: '123',
          },
          expirationDate: {
            container: '#expiration-date',
            selector: '#expiration-date',
            placeholder: 'MM/YY',
            value: '01/25',
          }
        }
      }).then((cardFields) => {
        document.querySelector('#new-card-form').addEventListener('submit', (event) => {
          event.preventDefault();
          this.isPaypal = true;
          cardFields.submit({
            cardholderName: 'Nathan',
            // billingAddress: {
            // Street address, line 1
            //   streetAddress: 'Arizona',
            //   extendedAddress: 'Arizona',
            //   region: 'Arizona',
            //   locality: 'Arizona',
            // Postal Code
            //   postalCode: '85006',
            // Country Code
            // countryCodeAlpha2: document.getElementById('card-billing-address-country').value
            //   countryCodeAlpha2: 'US'
            // }
          }).then((ddd) => {
            console.log('eopoe', ddd);
            // Payment was successful! Show a notification or redirect to another page.
            // window.location.replace('/order-success.html?orderId=' + ddd.orderId);
            this.continue('stepsixTeen', 'stepfiveTeen', '');
            this.isPaypal = false;
          }).catch((err) => {
            if (err) {
              this.isPaypal = false;
              alert('Payment could not be captured! ' + JSON.stringify(err));
            }
          });
        });
      });
    } else {
      // Hides card fields if the merchant isn't eligible
    }
  }

  saveNewQuote(nextstepname, previousStepname, formGroupname) {
    if (formGroupname === 'addressForm') {
      if (this.allStates.length > 0) {
        if (this[formGroupname].valid) {
          this.allStates.forEach(state => {
            if (state.title.toLowerCase() === this.addressForm.controls.state.value.toLowerCase()) {
              this.isStateAvailable = true;
            }
          });
        }
      }
      if (this[formGroupname].valid) {
        if (this.isStateAvailable) {
          console.log(this[formGroupname].value);
          const data = {
            from_quote_id: this.quoteId,
            property_street_address: this.newFullAddres,
            property_apartment: this.addressForm.value.street_address,
            property_zip_code: this.addressForm.value.zipcode,
            property_city: this.addressForm.value.city,
            property_state: this.addressForm.value.state
          };
          this.api.post('quote/save-other', data).subscribe(res => {
            if (res.status === 200) {
              this.newquotedata = res.data;
              this.next(nextstepname, previousStepname);
            }
          });
        } else {
          this.api.alert(`We do not offer services in ${this.addressForm.controls.state.value}.`, 'warning');
        }
      } else {
        this[formGroupname].markAllAsTouched();
      }
    }
  }
  continueWithNewProperty() {
    if (this.propertypewecover.value.title === 'Single Family' || this.propertypewecover.value.title === 'Condominium' ||
      this.propertypewecover.value.title === 'Townhouse') {
      this.continue('stepthirteen', 'stepTwelve', '');
    } else {
      this.continue('stepfourteen', 'stepTwelve', '');
    }
  }
  ContineFromNewPropertyselection() {
    if (this.newquotedata) {
      if (this.propertypewecover.value.title.toLowerCase() === this.newquotedata.step5.propertyType_name.toLowerCase()
        && this.propertySizeweCover.value.title.toLowerCase() === this.newquotedata.step6.propertySize_name.toLowerCase()) {
        this.continue('stepfourteen', 'stepthirteen', '');
      } else {
        this.continue('stepThree', 'stepthirteen', '');
        this.getPlanList();
        this.quoteId = this.newquotedata._id;
      }
    }
  }
  continueWithnewPropertTypeAndSize() {
    console.log(this.keepPlanSelectionSame.value);
    if (this.keepPlanSelectionSame.value === 'yes') {
      this.createClone();
    } else {
      this.continue('stepThree', 'stepthirteen', '');
      this.getPlanList();
      this.quoteId = this.newquotedata._id;
    }
  }
  createClone() {
    this.api.post(`quote/update-other/${this.newquotedata._id}`, { from_quote_id: this.quoteId, isSame: true }).subscribe(res => {
      if (res.status === 200) {
        const Index = _.findIndex(this.mulitplePlanArray, { _id: res.data._id });
        console.log(res.data);
        if (Index === -1) {
          this.mulitplePlanArray.push(res.data);
        }
        this.next('stepfiveTeen', 'stepfourteen');
        console.log(this.mulitplePlanArray);
        setTimeout(() => {
          this.proceedPaypal();
        }, 500);
      }
    }, err => {
      if (err) {
        this.api.alert('Somthing went wrong', 'error');
      }
    });
  }
  grandTotal(
    additionalcost, surcharge, salextax, totalOptionalItemsCost,
    costperplan, totaladdedprice, totalCategorycoverage, totaladdedCostForCoverage,
    serviceFee
  ) {
    let totalvalue = Number(totalOptionalItemsCost) + Number(costperplan)
      + Number(totaladdedprice) + Number(totalCategorycoverage) + Number(totaladdedCostForCoverage)
      + Number(serviceFee ? serviceFee : 0);
    const percentsurcharge = Number(((totalvalue * Number(surcharge ? surcharge : 0)) / 100).toFixed(2));
    const percentsalextax = Number(((totalvalue * Number(salextax ? salextax : 0)) / 100).toFixed(2));
    totalvalue = Number((totalvalue + percentsurcharge + percentsalextax + Number(additionalcost ? additionalcost : 0)).toFixed(2));
    return { totalvalue, percentsurcharge, percentsalextax }
  };
}
  // calculateTotalAmount() {
  //   if (this.mulitplePlanArray.length > 0) {
  //     this.mulitplePlanArray.filter(val => {
  //       let totalvalue = Number(val.totalOptionalItemsCost) + Number(val.step7.price)
  //         + Number(val.totaladdedprice) + Number(val.totalCategorycoverage) + Number(val.totaladdedCostForCoverage)
  //         + Number(this.serviceFee.value ? this.serviceFee.value : 0);
  //       const percentsurcharge = (totalvalue * Number(val.state_data.surcharge ? val.state_data.surcharge : 0)) / 100;
  //       const percentsalextax = (totalvalue * Number(val.state_data?.salex_tax ? val.state_data?.salex_tax : 0)) / 100;
  //       totalvalue = totalvalue + percentsurcharge + percentsalextax + 
  // Number(val.state_data.additional_cost ? val.state_data.additional_cost : 0);
  //       console.log(totalvalue);
  //       return totalvalue = + totalvalue;
  //     });
  //   }
  // }
