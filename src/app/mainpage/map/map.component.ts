import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { LngLatLike } from 'mapbox-gl';
import { NavigationControl, Map } from 'mapbox-gl';
import { ApiServicesService } from 'src/app/api-services.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  constructor(private api: ApiServicesService) { }
  clickpoint: LngLatLike;

  title = "mapir-angular-test";
  center: LngLatLike;

  apiKey: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY1YjQxNGI0YjA0NWRhYjU5MDI0NjNiOTc1ZWQ5Y2JlNTIwMTg2NWJkMDc5ZTJiZTFkMTdlYTlkNjlmYjU2ODgwM2M2YTNjZDlmZDM4NjQ3In0.eyJhdWQiOiIxODg3NiIsImp0aSI6ImY1YjQxNGI0YjA0NWRhYjU5MDI0NjNiOTc1ZWQ5Y2JlNTIwMTg2NWJkMDc5ZTJiZTFkMTdlYTlkNjlmYjU2ODgwM2M2YTNjZDlmZDM4NjQ3IiwiaWF0IjoxNjU4ODUwMzk1LCJuYmYiOjE2NTg4NTAzOTUsImV4cCI6MTY2MTQ0MjM5NSwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.BBTA6uG2NU-Mk29jtZ6AapmJSfKp0k5GduBg-zyTESv1Vfoi0Mya6-E9HgiAmgsjtpK2JkNeWIAlBnw3bAo4wM1gwOvfKGR3Ngrs-QVKFQTfJ5batCu8NMcf1Kj5mL3o9xrH_YNInvgXO_D5XNk48sQ0rufjWy-AF-zsznx4bihluF5oyIU4Rwae6UaANMXpB7sLjkLB4ijw0kCaQ_Cj0fUe_KlX6Ymial4RUJ_ngk1uNdacjuJ0V2HpW-5cKuYiINKnxOD3WBZXN4bqhRrTcje6D0dwVU1y9zHjXDzeGwOUa7mayfXG2sQoO6eVkYg7X1MNELpcl-yGr3O_FfZPnQ";
  ngOnInit() {
    this.clickpoint = [51.367918, 35.712706]
    this.center = [51.367918, 35.712706]
  }
  mapClicked(e: any) {
    if ("lngLat" in e) this.clickpoint = [e.lngLat.lng, e.lngLat.lat]
    this.api.getMapAddress(this.apiKey, e.lngLat.lat, e.lngLat.lng).subscribe(
      res => {
        console.log(res)
      },
      err => {
        console.log(err)
      }
    )
  }

  dragged(e: any) {
    console.log(e._lngLat);
  }

}