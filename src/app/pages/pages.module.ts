import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { MaterialModule } from '../material.module';
import { ModalModule } from '../modal/modal.module';
import { LoaderModule } from '../loader/loader.module';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { LandingComponent } from './landing/landing.component';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AgmCoreModule } from '@agm/core';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { CCPAComponent } from './ccpa/ccpa.component';
import { LicenseCompaniesComponent } from './license-companies/license-companies.component';
import { SharedModule } from '../shared/shared.module';
import { SitemapComponent } from './sitemap/sitemap.component';
import { AgreementComponent } from './agreement/agreement.component';
import { ContactComponent } from './contact/contact.component';
import { FileaclaimComponent } from './fileaclaim/fileaclaim.component';
import { ErrorComponent } from './error/error.component';
import { FeedbackformComponent } from './feedbackform/feedbackform.component';
import { HomeComponent } from './home/home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { BuyitemsComponent } from './buyitems/buyitems.component';
import { TestSectionComponent } from './test-section/test-section.component';
import { CartComponent } from './cart/cart.component';




@NgModule({
  declarations: [
    ComingSoonComponent,
    LandingComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    CookiePolicyComponent,
    CCPAComponent,
    LicenseCompaniesComponent,
    SitemapComponent,
    AgreementComponent,
    ContactComponent,
    FileaclaimComponent,
    ErrorComponent,
    FeedbackformComponent,
    HomeComponent,
    CheckoutComponent,
    BuyitemsComponent,
    TestSectionComponent,
    CartComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
    ModalModule,
    LoaderModule,
    SharedModule,
    SlickCarouselModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    NgxMaskModule,
    AgmCoreModule
  ],
  entryComponents: [LandingComponent],
  bootstrap: [LandingComponent],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class PagesModule { }
