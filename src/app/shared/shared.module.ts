import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { FaqComponent } from './faq/faq.component';
import { SortPipe, ToNumberPipe } from './pipes/sort.pipe';
import { NumbersOnly } from './pipes/numberonly.directive';
import { PhonePipe } from './pipes/phone.pipe';


@NgModule({
  declarations: [HeaderComponent, FooterComponent, MapComponent, FaqComponent, SortPipe, ToNumberPipe, NumbersOnly, PhonePipe],
  exports: [HeaderComponent, FooterComponent, MapComponent, FaqComponent, SortPipe, ToNumberPipe, NumbersOnly, PhonePipe],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
