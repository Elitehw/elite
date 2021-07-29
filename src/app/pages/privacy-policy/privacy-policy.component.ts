import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { privacystatement } from '../../metainfo';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  privacyPolicyData: any;
  formType: string;
  privacystatementmetainfo = privacystatement;
  constructor(
    private apiService: ApiService,
    private event: EventService,
    private router: Router,
    private meta: Meta
  ) {
    this.updatemetaInfo(this.privacystatementmetainfo);
  }


  ngOnInit(): void {
    this.getPrivacyPolicy();
    setTimeout(() => {
      AOS.init();
    }, 4000);
  }
  updatemetaInfo(metainfo) {
    this.meta.updateTag({ name: 'description', content: metainfo.description });
    this.meta.updateTag({ name: 'title', content: metainfo.title });
    this.apiService.setpAgetitle(metainfo.title);
  }
  getPrivacyPolicy() {
    this.apiService.get('cms/privacy-policy').subscribe((res: any) => {
      if (res) {
        this.privacyPolicyData = res.data;
      }
    });
  }
  scrollToDiv(tabname, formType: string) {
    this.formType = formType;
    this.event.setHeaderEmmit(formType);
    if (this.router.url !== '/landing') {
      this.router.navigate(['/landing']);
    }
  }






























  // validateForm(stepper: any, formGroupName: any, manualStepperCount: number, nextGroupname: any) {
  // if (this.storageService.GetFormStatusByUser() === 'Editable') {
  //   if (this[formGroupName].valid) {
  //     this[nextGroupname].patchValue(this.storageService.getcspStepData().formData);
  //     if (this.insuranceInfoForm.controls.contractor_licence_upload.value) {
  //       if (!this.insuranceInfoForm.controls.contractor_licence_upload.value[0].name) {
  //         this.insuranceInfoForm.controls.contractor_licence_upload.setValue(null);
  //       }
  //     }
  //     if (this.insuranceInfoForm.controls.policy_document.value) {
  //       if (!this.insuranceInfoForm.controls.policy_document.value[0].name) {
  //         this.insuranceInfoForm.controls.policy_document.setValue(null);
  //       }
  //     }

  //     if (manualStepperCount === 9) {
  //       if (Object.keys(this.formData).length > 0) {
  //         this.formData = Object.assign({}, this.formData, this[formGroupName].value);
  //       } else {
  //         this.formData = this[formGroupName].value;
  //       }
  //       this.submitForm(this.formData).then(() => {
  //         stepper.next();
  //         this.selectedInddex = manualStepperCount;
  //       });
  //     } else {
  //       if (Object.keys(this.formData).length > 0) {
  //         this.formData = Object.assign({}, this.formData, this[formGroupName].value);
  //       } else {
  //         this.formData = this[formGroupName].value;
  //       }
  //       this.selectedInddex = manualStepperCount;
  //       if (this.storageService.getcspStepData()) {
  //         if (Object.keys(this.storageService.getcspStepData().formData).length > 0) {
  //           const collectformdata = Object.assign({}, this.storageService.getcspStepData().formData, this.formData);
  //           const Collectdata = {
  //             formData: collectformdata,
  //             // tslint:disable-next-line:no-string-literal
  //             selectedInddex: stepper['_selectedIndex'],
  //             formGroupName,
  //             formType: this.formType
  //           };
  //           this.storageService.setcspStepData(Collectdata);
  //           console.log(this.storageService.getcspStepData());
  //         }
  //         console.log(this.formData);
  //       } else {
  //         const collectformdata = this.formData;
  //         const Collectdata = {
  //           formData: collectformdata,
  //           // tslint:disable-next-line:no-string-literal
  //           selectedInddex: stepper['_selectedIndex'],
  //           formGroupName,
  //           formType: this.formType
  //         };
  //         this.storageService.setcspStepData(Collectdata);
  //       }
  //       stepper.next();
  //     }
  //   } else {
  //     if (formGroupName === 'insuranceInfoForm') {
  //       if (this[formGroupName].controls.contractor_licence_upload.invalid) {
  //         this.apiService.alert('Please upload contractor licence document!', 'info');
  //       } else if (this[formGroupName].controls.policy_document.invalid) {
  //         this.apiService.alert('Please upload general liability insurance policy document!', 'info');
  //       }
  //     }
  //     Object.keys(this[formGroupName].controls).forEach(key => {
  //       this[formGroupName].get(key).markAsTouched({ onlySelf: true });
  //     });
  //   }

  // } else {
  //   this.previousMatStepperData = stepper;
  //   if (this[formGroupName].valid) {
  //     if (manualStepperCount === 9) {
  //       if (Object.keys(this.formData).length > 0) {
  //         this.formData = Object.assign({}, this.formData, this[formGroupName].value);
  //       } else {
  //         this.formData = this[formGroupName].value;
  //       }
  //       this.submitForm(this.formData).then(() => {
  //         stepper.next();
  //         this.selectedInddex = manualStepperCount;
  //       });
  //     } else {
  //       if (Object.keys(this.formData).length > 0) {
  //         this.formData = Object.assign({}, this.formData, this[formGroupName].value);
  //       } else {
  //         this.formData = this[formGroupName].value;
  //       }
  //       this.selectedInddex = manualStepperCount;
  //       if (this.storageService.getcspStepData()) {
  //         if (Object.keys(this.storageService.getcspStepData().formData).length > 0) {
  //           const collectformdata = Object.assign({}, this.storageService.getcspStepData().formData, this.formData);
  //           const Collectdata = {
  //             formData: collectformdata,
  //             // tslint:disable-next-line:no-string-literal
  //             selectedInddex: stepper['_selectedIndex'],
  //             formGroupName,
  //             formType: this.formType
  //           };
  //           this.storageService.setcspStepData(Collectdata);
  //           console.log(Collectdata);
  //         }
  //       } else {
  //         const collectformdata = this.formData;
  //         const Collectdata = {
  //           formData: collectformdata,
  //           // tslint:disable-next-line:no-string-literal
  //           selectedInddex: stepper['_selectedIndex'],
  //           formGroupName,
  //           formType: this.formType
  //         };
  //         this.storageService.setcspStepData(Collectdata);
  //       }
  //       stepper.next();
  //     }
  //   } else {
  //     if (formGroupName === 'insuranceInfoForm') {
  //       if (this[formGroupName].controls.contractor_licence_upload.invalid) {
  //         this.apiService.alert('Please upload contractor licence document!', 'info');
  //       } else if (this[formGroupName].controls.policy_document.invalid) {
  //         this.apiService.alert('Please upload general liability insurance policy document!', 'info');
  //       }
  //     }
  //     Object.keys(this[formGroupName].controls).forEach(key => {
  //       this[formGroupName].get(key).markAsTouched({ onlySelf: true });
  //     });
  //   }
  // }
  //   }
}



// validateForm(stepper: MatStepper, formGroupName: any, manualStepperCount: number, nextGroupname: any) {
//   this.previousMatStepperData = stepper;
//   if (this[formGroupName].valid) {
//     if (manualStepperCount === 9) {
//       if (Object.keys(this.formData).length > 0) {
//         this.formData = Object.assign({}, this.formData, this[formGroupName].value);
//       } else {
//         this.formData = this[formGroupName].value;
//       }
//       this.submitForm(this.formData).then(() => {
//         stepper.next();
//         this.selectedInddex = manualStepperCount;
//       });
//     } else {
//       if (Object.keys(this.formData).length > 0) {
//         this.formData = Object.assign({}, this.formData, this[formGroupName].value);
//       } else {
//         this.formData = this[formGroupName].value;
//       }
// this.setstepDatatocookie(this.formData, formGroupName)

//       stepper.next();
//     }
//   } else {
//     if (formGroupName === 'insuranceInfoForm') {
//       if (this[formGroupName].controls.contractor_licence_upload.invalid) {
//         this.apiService.alert('Please upload contractor licence document!', 'info');
//       } else if (this[formGroupName].controls.policy_document.invalid) {
//         this.apiService.alert('Please upload general liability insurance policy document!', 'info');
//       }
//     }
//     Object.keys(this[formGroupName].controls).forEach(key => {
//       this[formGroupName].get(key).markAsTouched({ onlySelf: true });
//     });
//   }
// }
