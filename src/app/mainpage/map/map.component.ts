import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as $ from 'jquery';
import { LngLatLike } from 'mapbox-gl';
import { NavigationControl, Map } from 'mapbox-gl';
import { ApiServicesService } from 'src/app/api-services.service';
interface MapGeo{
  lat:number;
  long:number;
}
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  @Input() geometry:any[];
  @Input() enable: boolean;
  @Input() lat: any;
  @Input() long: any;
  @Output() newMapEvent = new EventEmitter<MapGeo>();
  @Input() width: string;
  @Input() height: string;
  constructor(private api: ApiServicesService) { }
  branchData:any[]=[]
  clickpoint: LngLatLike=[31,31];
  address:string="";
  interact: boolean = false;
  title = "mapir-angular-test";
  center: LngLatLike=[31,31];
  apiKey: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY1YjQxNGI0YjA0NWRhYjU5MDI0NjNiOTc1ZWQ5Y2JlNTIwMTg2NWJkMDc5ZTJiZTFkMTdlYTlkNjlmYjU2ODgwM2M2YTNjZDlmZDM4NjQ3In0.eyJhdWQiOiIxODg3NiIsImp0aSI6ImY1YjQxNGI0YjA0NWRhYjU5MDI0NjNiOTc1ZWQ5Y2JlNTIwMTg2NWJkMDc5ZTJiZTFkMTdlYTlkNjlmYjU2ODgwM2M2YTNjZDlmZDM4NjQ3IiwiaWF0IjoxNjU4ODUwMzk1LCJuYmYiOjE2NTg4NTAzOTUsImV4cCI6MTY2MTQ0MjM5NSwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.BBTA6uG2NU-Mk29jtZ6AapmJSfKp0k5GduBg-zyTESv1Vfoi0Mya6-E9HgiAmgsjtpK2JkNeWIAlBnw3bAo4wM1gwOvfKGR3Ngrs-QVKFQTfJ5batCu8NMcf1Kj5mL3o9xrH_YNInvgXO_D5XNk48sQ0rufjWy-AF-zsznx4bihluF5oyIU4Rwae6UaANMXpB7sLjkLB4ijw0kCaQ_Cj0fUe_KlX6Ymial4RUJ_ngk1uNdacjuJ0V2HpW-5cKuYiINKnxOD3WBZXN4bqhRrTcje6D0dwVU1y9zHjXDzeGwOUa7mayfXG2sQoO6eVkYg7X1MNELpcl-yGr3O_FfZPnQ";
  ngOnInit() {

    this.interact = this.enable;
    this.clickpoint = [ Number(this.long),Number(this.lat),]
    this.center =  [ Number(this.long),Number(this.lat)] 
    // this.clickpoint = [ 51.33699011667957, 35.77076096275786,]
    // this.center = [ 51.33699011667957, 35.77076096275786,]
    this.geometry= [{
      "coordinates": [
        [
          [
            51.33699011667957,
            35.77076096275786
          ],
          [
            51.337479339892525,
            35.76639453331079
          ],
          [
            51.331853272951605,
            35.75091162471527
          ],
          [
            51.34848686216944,
            35.75101088372354
          ],
          [
            51.349343002790505,
            35.756767694413796
          ],
          [
            51.34542921709175,
            35.77135636638209
          ],
          [
            51.33699011667957,
            35.77076096275786
          ]
        ]
      ],
      "type": "Polygon"
    }];  
    this.branchData=this.geometry;
  }

  mapClicked(e: any) {
    if ("lngLat" in e) this.clickpoint = [e.lngLat.lng, e.lngLat.lat]
    var mapGeo:MapGeo={lat:e.lngLat.lat,long:e.lngLat.lng}
    this.newMapEvent.emit(mapGeo);
    // this.api.getMapAddress(this.apiKey, e.lngLat.lat, e.lngLat.lng).subscribe(
    //   res => {
    //     console.log(res)
    //     this.address=res['address']
    //   },
    //   err => {
    //     console.log(err)
    //   }
    // )
  }

  dragged(e: any) {
    console.log(e._lngLat);
  }

}