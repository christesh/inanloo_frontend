import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit {
  customer: boolean = true;
  interval:number=3000;
  images = [700, 800, 807].map((n) => `https://picsum.photos/id/${n}/900/500`);
  constructor(
    private router: Router,
    config: NgbCarouselConfig
  ) {
    config.interval = 2000;
    config.keyboard = true;
    config.pauseOnHover = true;
   }
    slides = [
    {'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}, 
    {'image': 'https://gsr.dev/material2-carousel/assets/demo.png'},
    {'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}, 
    {'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}, 
    {'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}
  ];
  ngOnInit() {
    var userCat = localStorage.getItem('userCat')!
    if (userCat == "مشتری")
      this.customer = true
    else
      this.customer = false
    
  }
  order() {
    this.router.navigate(['home/order']);
  }
}
