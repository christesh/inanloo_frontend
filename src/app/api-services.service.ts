import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  private baseurl= environment.API_URL;
  // baseurl = "http://localhost:8000";
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  sendsms(mob:string |null |undefined): Observable<any> {
    const body = { mobile: mob };
    console.log(body)
    return this.http.post(this.baseurl + '/personal/sendsms/',body,{headers: new HttpHeaders({
      'Content-Type':  'application/json' 
    })});   
  }

  justsms(mobile:string): Observable<any>{
    const body = { mobile: mobile };
    return this.http.post(this.baseurl + '/personal/justsms/',body,{headers: new HttpHeaders({
      'Content-Type':  'application/json' 
    })});
  }
  register(mob:string,fname:string,lname:string,nationalid:string,usercategory:number): Observable<any> {
    const body = { username: mob,fname:fname,lname:lname,nationalid:nationalid,usercategory:usercategory };
    return this.http.post(this.baseurl + '/personal/register/',body,{headers: new HttpHeaders({
      'Content-Type':  'application/json' 
    })});
   
  }

  GetPersonCategories(): Observable<any> {
    //this.httpHeaders1.append('Authorization','Token b237ebb38a864aa445987beb7b31d4fc49b09abc');
    return this.http.get(this.baseurl + '/personal/GetPersonCategories/',{headers: new HttpHeaders({
      'Content-Type':  'application/json' 
    })});
   
  }
  checksms(code:string,mobile:string | null | undefined): Observable<any> {
    //this.httpHeaders1.append('Authorization','Token b237ebb38a864aa445987beb7b31d4fc49b09abc');
    const body = { code: code ,mobile:mobile};
    return this.http.post(this.baseurl + '/personal/checksms/',body,{headers: new HttpHeaders({
      'Content-Type':  'application/json' 
    })});
   
  }
  ceratedesignjson(modelName: string,version:string,  fieldsjson:any): Observable<any>{
    
    const body = { modelName: modelName,modelTitle:version, fieldsJson:fieldsjson};
    return this.http.post(this.baseurl + '/baseinfo/CreateDesignJson/',body,{headers: new HttpHeaders({
      'Content-Type':  'application/json',     
    })}); 
  }
  getalldesignjson(): Observable<any> {
    return this.http.get(this.baseurl + '/baseinfo/GetAllDesignJson/', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        
      })
    });
  }

}

