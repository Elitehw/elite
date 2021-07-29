import { AboutusComponent } from './aboutus/aboutus.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyerSellerComponent } from './buyer-seller/buyer-seller.component';
import { AffiliatesComponent } from './affiliates/affiliates.component';
import { CertifiedserviceproviderComponent } from './certifiedserviceprovider/certifiedserviceprovider.component';
import { RealestateComponent } from './realestate/realestate.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { TitleagenciesComponent } from './titleagencies/titleagencies.component';
import { ArticlesComponent } from './articles/articles.component';
import { MainarticleComponent } from './mainarticle/mainarticle.component';
import { ElitestateComponent } from './elitestate/elitestate.component';
import { WhyeliteComponent } from './whyelite/whyelite.component';
import { ElectronicsComponent } from './electronics/electronics.component';
import { ApplianceComponent } from './appliance/appliance.component';
import { ExteriorsComponent } from './exteriors/exteriors.component';
import { SystemComponent } from './system/system.component';
import { CompareplanComponent } from './compareplan/compareplan.component';
import { CustomizeComponent } from './customize/customize.component';
import { CompleteComponent } from './complete/complete.component';
import { StatewecoverComponent } from './statewecover/statewecover.component';
import { MaintenanceAndRepairsComponent } from './maintenance-and-repairs/maintenance-and-repairs.component';
import { GuideComponent } from './guide/guide.component';
import { QaPageComponent } from './qa-page/qa-page.component';


const routes: Routes = [
  {
    path: 'homeowners-warranty',
    component: AboutusComponent
  },
  {
    path: 'home-buyers-and-sellers',
    component: BuyerSellerComponent
  }, {
    path: 'affiliates',
    component: AffiliatesComponent
  }, {
    path: 'service-providers',
    component: CertifiedserviceproviderComponent
  }, {
    path: 'real-estate-professionals',
    component: RealestateComponent
  }, {
    path: 'suppliers',
    component: SuppliersComponent
  }, {
    path: 'title-agencies',
    component: TitleagenciesComponent
  }, {
    path: 'articles',
    component: ArticlesComponent
  }
  , {
    path: 'homeowner-hub',
    component: MainarticleComponent
  }, {
    path: 'state/:name',
    component: ElitestateComponent
  }, {
    // why elite
    path: 'the-best-home-warranties',
    component: WhyeliteComponent
  }, {
    path: 'elite-electronics',
    component: ElectronicsComponent
  }, {
    path: 'elite-appliances',
    component: ApplianceComponent
  }, {
    path: 'elite-exterior',
    component: ExteriorsComponent
  }
  , {
    path: 'elite-systems',
    component: SystemComponent
  }, {
    path: 'compare-home-warranty-plans',
    component: CompareplanComponent
  }, {
    path: 'customize-your-own',
    component: CustomizeComponent
  }
  , {
    path: 'elite-complete',
    component: CompleteComponent
  }
  , {
    path: 'home-warranty-coverage-map',
    component: StatewecoverComponent
  }, {
    path: 'maintenance-and-repairs',
    component: MaintenanceAndRepairsComponent
  }, {
    path: 'home-warranty-guide',
    component: GuideComponent
  }, {
    path: 'home-warranties-questions-and-answers',
    component: QaPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsPagesRoutingModule { }
