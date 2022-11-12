import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiServicesService } from 'src/app/api-services.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  constructor(private router: Router,
    private api:ApiServicesService,
    private tokencookie:CookieService ){ }

  ngOnInit() {
    var token=this.tokencookie.get('T');
    this.api.getPersonAuth(token).subscribe(
      res => {
        localStorage.setItem('userID', res[0]['person'])
        if(res[0]['category__name']=='مشتری')
            this.router.navigate(['home/profile/customer'])
        if(res[0]['category__name']=='تکنسین' && res[0]['fillProfile']==false)
            this.router.navigate(['home/profile/technician'])
      },
      err => {
        console.log(err)
       
      }
    )
    
  }

}
