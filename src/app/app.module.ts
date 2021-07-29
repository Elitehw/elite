import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { LoaderModule } from './loader/loader.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderInterceptor } from './interceptor/interceptor';
import { ServicesModule } from './services/services.module';
import { CookieService } from 'ngx-cookie-service';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AgmCoreModule } from '@agm/core';
import { RouterModule } from '@angular/router';
import { NgxPayPalModule } from 'ngx-paypal';

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    LoaderModule,
    NgxPayPalModule,
    HttpClientModule,
    NgxMaskModule.forRoot(maskConfig),
    AgmCoreModule.forRoot({
      // AIzaSyDQ2vDFd6CPlnHBmm6stExZxGHDnSQTbN8 - Original
      // AIzaSyBGCvMX_dToRgRkog9hvf3WB4FXUzN0428 - Demo
      // AIzaSyD_Y1rqX4OYQl9CxhkcX_Bhy0hAs2dysgg
      // AIzaSyDCsOo3KN1Qd002h3BKqu1AHiSKg_RFxAE - client generated key
      apiKey: 'AIzaSyDCsOo3KN1Qd002h3BKqu1AHiSKg_RFxAE',
      libraries: ['places']
    }),
  ],
  exports: [RouterModule],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
