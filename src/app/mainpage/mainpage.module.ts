// import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainpageComponent } from './mainpage.component';
import { MatCardModule } from '@angular/material/card';
import { MaterialExampleModule } from '../material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { OrderpageComponent } from './orderpage/orderpage.component';
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { defineLordIconElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { MapComponent } from './map/map.component';
import { NgxMapboxGLModule } from 'mapir-angular-component';
const appRoutes: Routes = [
  { path: 'order', component: OrderpageComponent },


];
@NgModule({
  imports: [
    NgxMapboxGLModule,
    NgbModule,
    PopoverModule,
    NgPersianDatepickerModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MaterialExampleModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    MapComponent,
    MainpageComponent,
    NavbarComponent,
    FooterComponent,
    OrderpageComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainpageModule {
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }
}
