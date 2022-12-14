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
import { ProfilesComponent } from './profiles/profiles.component';
import { HomeComponent } from './home/home.component';
import { PROFILE_ROUTES } from './profiles/profiles.routing'
import { TestComponent } from './test/test.component';
import { CustomerProfileComponent } from './profiles/customerProfile/customerProfile.component';
import { TechnicianProfileComponent } from './profiles/technicianProfile/technicianProfile.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { EditaddressComponent } from './editaddress/editaddress.component';
import { EditAddressDialog } from './orderpage/orderpage.component';
import { EditAddressDialogProfile } from './profiles/customerProfile/customerProfile.component';
import { TechEditAddressDialogProfile } from './profiles/technicianProfile/technicianProfile.component';
import { OrdersComponent } from './orders/orders.component';
import { SurveyComponent } from './survey/survey.component';
import { TicketingComponent } from '../portal/ticketing/ticketing.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ChatComponent } from '../Chat/Chat.component';
import { WalletComponent } from './wallet/wallet.component';
import { OrderdetailsComponent } from './orderdetails/orderdetails.component';

// import { NgxChatUiModule } from '@ngx-chat-ui/libs/ngx-chat-ui';
const appRoutes: Routes = [
  { path:'home',component:HomeComponent },
  { path: 'order', component: OrderpageComponent },
  { path: 'orderslist', component: OrdersComponent },
  { path: 'support', component: TicketingComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'orderDetails', component: OrderdetailsComponent },
  {
    path: 'profile', component: ProfilesComponent, children: [
      {
        path: 'customer', component: CustomerProfileComponent
      },
      {
        path: 'technician', component: TechnicianProfileComponent
      }
    ]
  },
  // { path: '', component: ProfilesComponent, data: { title: 'content Views' }, children: PROFILE_ROUTES },

];
@NgModule({

  imports: [
    // NgxChatUiModule,
    Ng2SmartTableModule,
    NgSelectModule,
    Ng2ImgMaxModule,
    MatInputModule,
    MatFormFieldModule,
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
    OrderdetailsComponent,
    WalletComponent,
    OrdersComponent,
    SurveyComponent,
    TechEditAddressDialogProfile,
    EditAddressDialogProfile,
    EditAddressDialog,
    EditaddressComponent,
    HomeComponent,
    MapComponent,
    MainpageComponent,
    NavbarComponent,
    FooterComponent,
    OrderpageComponent,
    ProfilesComponent,
    TestComponent,
    CustomerProfileComponent,
    TechnicianProfileComponent,
  ],
  exports: [
    OrderpageComponent,
    CustomerProfileComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainpageModule {
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }
}
