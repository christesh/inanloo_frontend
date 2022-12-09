import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerProfileComponent } from './customerProfile/customerProfile.component';
import { MaterialExampleModule } from '../../material.module';
import { TechnicianProfileComponent } from './technicianProfile/technicianProfile.component';
import { Routes, RouterModule } from '@angular/router';
import { ProfilesRoutingModule } from './profiles.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';


const appRoutes1: Routes = [
  { path: 'customer',  component: CustomerProfileComponent},
  { path: 'technician',  component: TechnicianProfileComponent }]

@NgModule({
  declarations: [
    // CustomerProfileComponent,
    // TechnicianProfileComponent,

 
],
  imports: [
    // FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialExampleModule,
    // ProfilesRoutingModule,
    RouterModule.forChild(appRoutes1)
  ],
  
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}}
  ]
    
})
export class ProfilesModule { }
