import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component'

import { PortalComponent } from "./portal/portal.component";
import { MainpageComponent } from "./mainpage/mainpage.component";

import { PORTAL_ROUTES } from "./routes/portal.routes";
import { MAINPAGE_ROUTES } from "./routes/mainpage.routes";


const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'home',
    component: MainpageComponent,
  },
  {
    path: 'portal',
    component: PortalComponent,
    
  },
  {
    path: 'logout',
    component: LoginComponent
  },
  
  { path: '', component: PortalComponent, data: { title: 'full Views' }, children: PORTAL_ROUTES },
   { path: '', component: MainpageComponent, data: { title: 'content Views' }, children: MAINPAGE_ROUTES },
  {
    path: '**',
    redirectTo: 'pages/error'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
