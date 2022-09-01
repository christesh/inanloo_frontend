import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalComponent } from './portal.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MaterialExampleModule } from '../material.module';
import { PortalRoutingModule } from "./portal-routing.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from "@angular/router";
import { CustomerprofileComponent } from './customerprofile/customerprofile.component';

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: CustomerprofileComponent },

];
@NgModule({
  exports: [
    CommonModule,
    // SidebarDirective,
   
    SidenavComponent
    
    
],
  imports: [
    CommonModule,
    MaterialExampleModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    PortalComponent,
    SidenavComponent,
    DashboardComponent,
    CustomerprofileComponent
    // SidebarDirective,
   
  ]
})
export class PortalModule { }
