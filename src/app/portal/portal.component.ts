import { Component, OnInit ,ViewChild,AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit {
  @ViewChild('sidenav', {static: true}) public sidenav: any;
  constructor(private router: Router) { }
  isShowing:boolean;
  ngOnInit() {
    this.router.navigate(['/portal/profile']);
  }
  ngAfterViewInit(){
    this.isShowing=true;
  }
  closeside(){
   this.isShowing=false;
  }
}
