import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiServicesService } from 'src/app/api-services.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private router: Router,
    private api: ApiServicesService
  ) { }
  public personname = "مسیح"
  public isauth: boolean = false
  female: boolean = false;
  male: boolean = false;
  navbarOpen = false;
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  userId: string;
  ngOnInit(): void {
    this.male = true;
    this.userId = localStorage.getItem('userID')!

  }
  profile() {
    this.router.navigate(['home/profile/customer']);
  }
  tech() {
    this.router.navigate(['home/profile/technician']);
  }
  signout() {
    this.api.logout().subscribe(
      res => {
        this.router.navigate(['']);
      },
      err => {
        console.log(err)
      }
    )
  }
}
