import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerProfileComponent } from './customerProfile/customerProfile.component';
import { MaterialExampleModule } from '../../material.module';
import { TechnicianProfileComponent } from './technicianProfile/technicianProfile.component';
import { Routes, RouterModule } from '@angular/router';
import { ProfilesRoutingModule } from './profiles.routing';

const appRoutes1: Routes = [
  { path: 'customer',  component: CustomerProfileComponent},
  { path: 'technician',  component: TechnicianProfileComponent }]

@NgModule({
  declarations: [
    // CustomerProfileComponent,
    // TechnicianProfileComponent,
 
],
  imports: [
    CommonModule,
    MaterialExampleModule,
    // ProfilesRoutingModule,
    RouterModule.forChild(appRoutes1)
  ],
  
    
    
})
export class ProfilesModule { }
