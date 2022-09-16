import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.navigate(['home/profile/customer']);
  }

}
