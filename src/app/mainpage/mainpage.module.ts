import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainpageComponent } from './mainpage.component';
import { MatCardModule } from '@angular/material/card';
import {MaterialExampleModule} from '../material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { OrderpageComponent } from './orderpage/orderpage.component';
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const appRoutes: Routes = [
  { path: 'order', component: OrderpageComponent },
  
];
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MaterialExampleModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    MainpageComponent,
    NavbarComponent,
    FooterComponent,
    OrderpageComponent
  ]
})
export class MainpageModule { }
