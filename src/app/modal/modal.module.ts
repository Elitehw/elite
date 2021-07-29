import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default/default.component';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [
    DefaultComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  entryComponents: [
    DefaultComponent
  ]
})
export class ModalModule { }
