import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerprofileComponent } from './customerprofile/customerprofile.component';

const portalRoutes: Routes = [
  {
    path: 'portal/dashboard',
    component: DashboardComponent,
  },
  {
    path: 'portal/profile',
    component: CustomerprofileComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(portalRoutes)],
  exports: [RouterModule]
})

export class PortalRoutingModule {
}
