import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainpageComponent } from './mainpage.component';
import { MatCardModule } from '@angular/material/card';
import {MaterialExampleModule} from '../material.module'
@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MaterialExampleModule
  ],
  declarations: [MainpageComponent]
})
export class MainpageModule { }
