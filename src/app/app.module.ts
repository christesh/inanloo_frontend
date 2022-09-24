import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from "./app-routing.module";
import { ForgetPassDialog, LoginboxComponent, SignUPDialog } from './login/loginbox/loginbox.component';
import { ApiServicesService } from './api-services.service';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialExampleModule } from './material.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxMaskModule, IConfig } from 'ngx-mask'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginboxComponent,
    SignUPDialog,
    ForgetPassDialog

  ],
  imports: [
    NgxMaskModule.forRoot(),
    NgxMatSelectSearchModule,
    FlexLayoutModule,
    MaterialExampleModule,
    BrowserAnimationsModule,
    AccordionModule.forRoot(),
    MatButtonModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatNativeDateModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

  ],

  providers: [ApiServicesService,
  ],
  bootstrap: [AppComponent],


})
export class AppModule {

}
