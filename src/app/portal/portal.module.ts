import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalComponent } from './portal.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MaterialExampleModule } from '../material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from "@angular/router";
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { AccountingComponent } from './Accounting/Accounting.component';
import { AppliencemanagementComponent } from './appliencemanagement/appliencemanagement.component';
import { BaseinfoComponent } from './baseinfo/baseinfo.component';
import { SettingComponent } from './setting/setting.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CreateUserDialog } from './usermanagement/usermanagement.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UsergroupComponent } from './usergroup/usergroup.component';
import { CreateUserGroupDialog } from './usergroup/usergroup.component';
import { EditItemDialog } from './baseinfo/baseinfo.component';
import { EditApplianceItemDialog } from './appliencemanagement/appliencemanagement.component';
import { CreateProblemDialog } from './appliencemanagement/appliencemanagement.component';
import lottie from 'lottie-web';
import { defineLordIconElement } from 'lord-icon-element';
import * as CanvasJSAngularChart from '../../assets/chart/canvasjs.angular.component';
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;
import { NgChartsModule } from 'ng2-charts';
import { StafforderComponent } from './stafforder/stafforder.component';
import { MainpageModule } from '../mainpage/mainpage.module';
import { SignUPCustomerDialog } from './stafforder/stafforder.component';
import { CreateChecklistDialog } from './appliencemanagement/appliencemanagement.component';


import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { TicketingComponent } from './ticketing/ticketing.component';

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'users',
    component: UsermanagementComponent,
  },
  {
    path: 'usersgroup',
    component: UsergroupComponent,
  },
  {
    path: 'geo',
    component: BaseinfoComponent,
  },
  {
    path: 'appliance',
    component: AppliencemanagementComponent,
  },
  {
    path: 'orderbystaff',
    component: StafforderComponent,
  },
  {
    path: 'chatbox',
    component: TicketingComponent
  }
];
@NgModule({
  exports: [
    CommonModule,
    SidenavComponent,
  ],
  imports: [
   
    MainpageModule,
    NgChartsModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2SmartTableModule,
    CommonModule,
    MaterialExampleModule,
    RouterModule.forChild(appRoutes),
    PerfectScrollbarModule
  ],
  declarations: [
    CreateChecklistDialog,
    SignUPCustomerDialog,
    StafforderComponent,
    CanvasJSChart,
    CreateProblemDialog,
    EditApplianceItemDialog,
    EditItemDialog,
    CreateUserGroupDialog,
    UsergroupComponent,
    PortalComponent,
    SidenavComponent,
    DashboardComponent,
    WarehouseComponent,
    SettingComponent,
    BaseinfoComponent,
    AppliencemanagementComponent,
    AccountingComponent,
    UsermanagementComponent,
    CreateUserDialog,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PortalModule {
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }
}
