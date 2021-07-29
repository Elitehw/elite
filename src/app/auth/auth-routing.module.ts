import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthComponent } from './auth.component';
import { MemberloginComponent } from './memberlogin/memberlogin.component';
import { PartnerloginComponent } from './partnerlogin/partnerlogin.component';
const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'member-login',
        component: MemberloginComponent
      },
      {
        path: 'partners-login',
        component: PartnerloginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: '',
        redirectTo: '/member-login',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
