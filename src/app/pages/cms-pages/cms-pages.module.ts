import { AgmCoreModule } from '@agm/core';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsPagesRoutingModule } from './cms-pages-routing.module';
import { AboutusComponent } from './aboutus/aboutus.component';
import { MaterialModule } from 'src/app/material.module';
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
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomizeComponent } from './customize/customize.component';
import { CompleteComponent } from './complete/complete.component';
import { StatewecoverComponent } from './statewecover/statewecover.component';
import { MaintenanceAndRepairsComponent } from './maintenance-and-repairs/maintenance-and-repairs.component';
import { GuideComponent } from './guide/guide.component';
import { QaPageComponent } from './qa-page/qa-page.component';



@NgModule({
  declarations: [AboutusComponent,
    BuyerSellerComponent,
    AffiliatesComponent,
    CertifiedserviceproviderComponent,
    RealestateComponent,
    SuppliersComponent,
    TitleagenciesComponent,
    ArticlesComponent,
    MainarticleComponent,
    ElitestateComponent,
    WhyeliteComponent,
    ElectronicsComponent,
    ApplianceComponent,
    ExteriorsComponent,
    SystemComponent,
    CompareplanComponent,
    CustomizeComponent,
    CompleteComponent,
    StatewecoverComponent,
    MaintenanceAndRepairsComponent,
    GuideComponent,
    QaPageComponent],
  imports: [
    CommonModule,
    CmsPagesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaskModule,
    FormsModule,
    AgmCoreModule,
    SharedModule
  ]
})
export class CmsPagesModule { }
