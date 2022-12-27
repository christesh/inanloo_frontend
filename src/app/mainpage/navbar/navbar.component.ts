import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { escapeSelector } from 'jquery';
import { LocalDataSource } from 'ng2-smart-table';
import { CookieService } from 'ngx-cookie-service';
import { ApiServicesService } from 'src/app/api-services.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  // encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit {

  constructor(
    private router: Router,
    private api: ApiServicesService,
    private tokencoockie: CookieService
  ) { }
  public personname = "مسیح"
  public isauth: boolean = false
  female: boolean = false;
  male: boolean = false;
  customer: boolean = false;
  navbarOpen = false;
  userCat = ""
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  userId: string;

  ngOnInit(): void {
    this.male = true;
    this.userId = localStorage.getItem('personID')!
    this.userCat = localStorage.getItem('userCat')!
    if (this.userCat == "مشتری") {
      this.customer = true;
    }
    else {

      this.customer = false;
    }
  }
  profile() {
    if (this.userCat == "مشتری") {
      this.router.navigate(['home/profile/customer']);
    }
    else {
      this.router.navigate(['home/profile/technician']);
    }
    this.navbarOpen = !this.navbarOpen;
  }
  support() {
    // this.router.navigate(['home/support']);
    this.router.navigate(['home/chat']);
  }
  tech() {
    this.router.navigate(['home/profile/technician']);
  }
  orderlists() {
    this.router.navigate(['home/orderslist']);
    this.navbarOpen = !this.navbarOpen;
  }
  wallet() {
    this.router.navigate(['home/wallet']);
    this.navbarOpen = !this.navbarOpen;
  }
  signout() {
    var token = this.tokencoockie.get('T')
    this.api.setdeactiveuser(token).subscribe(
      res => {
       // console.log(res)
        this.api.logout().subscribe(
          res => {
            this.router.navigate(['']);
            this.navbarOpen = !this.navbarOpen;
          },
          err => {
           console.log(err)
          }
        )
      },
      err => {
       console.log(err)
      }
    )
  }
}
