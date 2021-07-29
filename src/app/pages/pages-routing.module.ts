import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { LandingComponent } from './landing/landing.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { CCPAComponent } from './ccpa/ccpa.component';
import { LicenseCompaniesComponent } from './license-companies/license-companies.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { AgreementComponent } from './agreement/agreement.component';
import { ContactComponent } from './contact/contact.component';
import { FileaclaimComponent } from './fileaclaim/fileaclaim.component';
import { ErrorComponent } from './error/error.component';
import { FeedbackformComponent } from './feedbackform/feedbackform.component';
import { HomeComponent } from './home/home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { BuyitemsComponent } from './buyitems/buyitems.component';
import { CartComponent } from './cart/cart.component';



const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'commin-soon',
    component: ComingSoonComponent
  },
  {
    path: 'terms-of-service',
    component: TermsAndConditionsComponent
  },
  {
    path: 'privacy-statement',
    component: PrivacyPolicyComponent
  },
  {
    path: 'cookie-policy',
    component: CookiePolicyComponent
  },
  {
    path: 'ccpa-notice',
    component: CCPAComponent
  },
  {
    path: 'state-artical',
    component: LicenseCompaniesComponent
  },
  {
    path: 'site-map',
    component: SitemapComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'agreement',
    component: AgreementComponent
  }, {
    path: 'file-a-claim',
    component: FileaclaimComponent

  }, {
    path: 'error',
    component: ErrorComponent

  },
  {
    path: 'feedbackform',
    component: FeedbackformComponent

  },
  {
    path: 'buy-home-warranties',
    component: CheckoutComponent

  }, {
    path: 'checkout',
    component: BuyitemsComponent

  },
  {
    path: 'home-warranty-quotes',
    component: CartComponent

  },
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./cms-pages/cms-pages.module').then(m => m.CmsPagesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
