import { Component, OnInit ,Input} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerProfile, Address, Mobile, Telephone, Counties, Province, Cities, Regions, Nighbourhoods } from '../profiles/profile';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViewportScroller } from "@angular/common";
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { MatStepper } from "@angular/material/stepper";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { pluck } from "rxjs/operators";
import { faLessThanEqual, faListSquares } from '@fortawesome/free-solid-svg-icons';
import { MatTable } from '@angular/material/table';
import * as moment from 'jalali-moment';
import { Jalali } from 'jalali-ts';
import { IDatepickerTheme } from 'ng-persian-datepicker';
import Swal from 'sweetalert2';

import { ApiServicesService } from 'src/app/api-services.service';
import { CookieService } from 'ngx-cookie-service';
import { GlobalvarService } from 'src/app/globalvar.service';

@Component({
  selector: 'app-editaddress',
  templateUrl: './editaddress.component.html',
  styleUrls: ['./editaddress.component.css']
})
export class EditaddressComponent implements OnInit {
  @Input() initprovince: Province[];
  province: Province[] = []
  shahrestan: Counties[] = []
  city: Cities[] = []
  region: Regions[] = [];
  neighbourhood: Nighbourhoods[] = []
  mapEnable: boolean = true;
  mainstreet: string = "";
  substreet: string = "";
  lane: string = "";
  building: string = "";
  no: string = "";
  unit: string = "";
  floor: string = "";
  address: Address[] = []
  showMap: boolean = false;
  maplat: number = 51.367918;
  maplong: number = 35.712706;
  shownewaddress: boolean = false;
  constructor() { }

  ngOnInit() {
    this.province=this.initprovince
  }
  selectprovince(event: any) {
    console.log(event)
    this.shahrestan = event.value.counties;
    this.city = []
    this.region = []
    this.neighbourhood = []
  }
  selectshahrestan(event: any) {
    console.log(event)
    this.city = event.value.cities;
    this.region = []
    this.neighbourhood = []
  }
  selectcity(event: any) {
    console.log(event)
    this.region = event.value.regions;
    this.neighbourhood = []
  }
  selectregion(event: any) {
    console.log(event)
    this.neighbourhood = event.value.neighbourhoods;
  }
  selectneighbour(event: any) {
    console.log(event)
  }
  showmap() {
    this.showMap = true;
  }
  saveaddress() {

  }
  canceladdress() {
    this.shownewaddress = false;
  }
}
