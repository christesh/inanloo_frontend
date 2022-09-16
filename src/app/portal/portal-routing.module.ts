import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';


const portalRoutes: Routes = [
  {
    path: 'portal/dashboard',
    component: DashboardComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(portalRoutes)],
  exports: [RouterModule]
})

export class PortalRoutingModule {
}
