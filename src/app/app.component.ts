import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'default';
  public payPalConfig?: IPayPalConfig;
  showSuccess: boolean;
  showCancel: boolean;
  showError: boolean;
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private http: HttpClient,
  ) {

  }
  ngOnInit() {
    this.iconRegistry();
    this.initConfig();
    this.getPaypalAccesToken();
  }


  iconRegistry() {
    this.matIconRegistry.addSvgIcon(
      'certified-service',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/certified-service.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'real-estate',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/real-estate.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'titles-agencies',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/titles-agencies.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'affiliates',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/affiliates.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'vendors',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/vendors.svg')
    );
  }
  private initConfig(clientID?: string): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'AbG5H6JO65inuWYF6r1RPyX9IDQoW4_QD8tWUDXq6usbbvuNogM9TN5sbdZqJf5LbUdrOBvfOxWiWq-p',
      // tslint:disable-next-line:no-angle-bracket-type-assertion
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '9.99',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '9.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: '9.99',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        // this.event.setLoaderEmmit(true);
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data: any) => {
        let statustype: boolean;
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        if (data.status === 'COMPLETED') {
          statustype = true;
        } else {
          statustype = false;
        }
        const orderData = {
          order_id: '1',
          plan_id: '1234',
          status: 'success'
        };
        // console.log(orderData);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        // console.log('OnError', err);
      },
      onClick: (data, actions) => {
        // this.event.setLoaderEmmit(false);
        console.log('onClick', data, actions);
      },
    };
  }
  //   <script
  //   src="https://www.paypal.com/sdk/js?components=buttons,hosted-fields&client-id=''=true"
  //   data-client-token=""
  //   data-namespace="paypal_sdk">
  // </script>
  getPaypalAccesToken() {
    this.http.get('https://eliteerp-api.dedicateddevelopers.us/frontend/order/getaccesstoken').subscribe((res: any) => {
      if (res) {
        this.loadScriptforPaypal(res.data);
      }
    });
  }
  public loadScriptforPaypal(data) {
    // tslint:disable-next-line: max-line-length
    const url = 'https://www.paypal.com/sdk/js?components=buttons,hosted-fields&client-id=AT5gNZMOIzeG9aeJW582kIZz-dGCijDbyiTUPeVrMTlEL01Cb-0FYPoV0boYw2Z2pkPaNM6F4EmYSMeS&debug=true'
    const node = document.createElement('script');
    node.src = url;
    node.setAttribute('data-namespace', 'paypal_sdk');
    node.setAttribute('data-client-token', data);
    document.getElementsByTagName('head')[0].appendChild(node);
  }

}
