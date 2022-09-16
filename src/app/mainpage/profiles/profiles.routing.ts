import { Routes, RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CustomerProfileComponent } from './customerProfile/customerProfile.component';
import { TechnicianProfileComponent } from './technicianProfile/technicianProfile.component';
export const PROFILE_ROUTES: Routes = [
  {
    path: 'profile',
    //  loadChildren: () => import('./profiles.module').then(m => m.ProfilesModule)
    children: [
      { 
        path: "customer", component: CustomerProfileComponent 
      },
      {
        path: "technician", component: TechnicianProfileComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(PROFILE_ROUTES)],
  exports: [RouterModule]
})

export class ProfilesRoutingModule {
}
