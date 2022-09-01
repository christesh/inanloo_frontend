import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ApiServicesService } from '../api-services.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // {1}
  private formSubmitAttempt: boolean = false; // {2}
  public theme1: boolean = false;
  public theme2: boolean = true;

  public childComponentLoaded: boolean = false;
  loadChildComponent() {
    this.childComponentLoaded = true
    this.loginshow = false;
  }

  constructor(
    private fb: FormBuilder,
    private api: ApiServicesService,      // {3}

  ) { }
  public news: { title: string, shortcontent: string, content: string }[] = []
  loginshow: boolean = true;
  public applink = ""
  public mainpage: boolean = false
  public aboutus: boolean = false
  public contactus: boolean = false
  ngOnInit() {
    this.loginshow = true;
    this.theme2= true;
    this.mainpage = true;
    this.aboutus = false;
    this.contactus = false;


  }
  about() {
    this.mainpage = false;
    this.aboutus = true;
    this.contactus = false;
  }
  contact() {
    this.mainpage = false;
    this.aboutus = false;
    this.contactus = true;
  }
  mainp() {
    this.mainpage = true;
    this.aboutus = false;
    this.contactus = false;
  }

  modalClosed(isClosed: Event) {
    this.childComponentLoaded = false;
    this.loginshow = true;
  }
  onSubmit() {
    // if (this.form.valid) {
    //   this.authService.signinUser('masih','123'); // {7}
    // }
    // this.formSubmitAttempt = true;             // {8}
  }


}
