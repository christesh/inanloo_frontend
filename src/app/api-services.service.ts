import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  // private baseurl= environment.API_URL;

  // private baseurl = "https://api-is.mersa-group.ir";
  private baseurl = "http://localhost:8000";
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getMapAddress(apikey: string, lat: string, lon: string): Observable<any> {
    return this.http.get("https://map.ir/reverse?lat=" + lat + "&lon=" + lon, {
      headers: new HttpHeaders({
        'x-api-key': apikey
      })
    });
  }
  loginWithUser(user: string, pass: string): Observable<any> {
    const body = { username: user, password: pass }
    return this.http.post(this.baseurl + '/api/v1/rest-auth/login/', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  login(mob: string): Observable<any> {
    const body = { username: mob, password: mob }
    return this.http.post(this.baseurl + '/api/v1/rest-auth/login/', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  logout(): Observable<any> {

    return this.http.post(this.baseurl + '/api/v1/rest-auth/logout/', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  sendsms(mob: string | null | undefined): Observable<any> {
    const body = { mobile: mob };
    return this.http.post(this.baseurl + '/personal/sendsms/', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  justsms(mobile: string): Observable<any> {
    const body = { mobile: mobile };
    return this.http.post(this.baseurl + '/personal/justsms/', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  register(mob: string, fname: string, lname: string, nationalid: string, usercategory: number): Observable<any> {
    const body = { username: mob, fname: fname, lname: lname, nationalid: nationalid, usercategory: usercategory.toString() };
    console.log(body)
    return this.http.post(this.baseurl + '/personal/register/', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });

  }

  GetPersonCategories(): Observable<any> {
    //this.httpHeaders1.append('Authorization','Token b237ebb38a864aa445987beb7b31d4fc49b09abc');
    return this.http.get(this.baseurl + '/personal/GetPersonCategories/', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });

  }
  checksms(code: string, mobile: string | null | undefined): Observable<any> {
    //this.httpHeaders1.append('Authorization','Token b237ebb38a864aa445987beb7b31d4fc49b09abc');
    const body = { code: code, mobile: mobile };
    return this.http.post(this.baseurl + '/personal/checksms/', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });

  }
  ceratedesignjson(modelName: string, version: string, fieldsjson: any): Observable<any> {
    const body = { modelName: modelName, modelTitle: version, fieldsJson: fieldsjson };
    return this.http.post(this.baseurl + '/baseinfo/CreateDesignJson/', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }
  getalldesignjson(): Observable<any> {
    return this.http.get(this.baseurl + '/baseinfo/GetAllDesignJson/', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',

      })
    });
  }
  getAllApplience(token: string): Observable<any> {
    return this.http.get(this.baseurl + '/baseinfo/getapplience/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getProblems(token: string, catid: string, brandid: string, modelid: string): Observable<any> {
    const body = { categoryID: catid, brandID: brandid, modelID: modelid };
    return this.http.post(this.baseurl + '/baseinfo/getproblems/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getRegins(token: string): Observable<any> {
    return this.http.get(this.baseurl + '/baseinfo/getregins/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getCustomersDetails(token: string, userid: string): Observable<any> {
    const body = { userID: userid }
    return this.http.post(this.baseurl + '/personal/getcustomersdetails/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  getPersonDetails(token: string): Observable<any> {

    return this.http.get(this.baseurl + '/personal/getpersondetails/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  getPersonAuth(token: string): Observable<any> {
    return this.http.get(this.baseurl + '/personal/getpersonauth/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }

  getAllCompanyMembers(token: string): Observable<any> {
    return this.http.get(this.baseurl + '/personal/getallcompanymemebers/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editCompanyMember(token: string, user: string, fname: string, lname: string, nationalid: string, group: string, mobile: string): Observable<any> {
    const body = { userid: user, fname: fname, lname: lname, nationalid: nationalid, group: group, mobile: mobile };
    console.log(body)
    return this.http.post(this.baseurl + '/personal/editcompanymembers/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json'
      })
    });

  }
  registerCompanyMember(token: string, user: string, pass: string, fname: string, lname: string, nationalid: string, group: string, usercategory: number, mobile: string): Observable<any> {
    const body = { username: user, password: pass, fname: fname, lname: lname, nationalid: nationalid, group: group, usercategory: usercategory.toString(), mobile: mobile };
    console.log(body)
    return this.http.post(this.baseurl + '/personal/registercompanymembers/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json'
      })
    });

  }
  getAllMemberGroup(token: string): Observable<any> {
    return this.http.get(this.baseurl + '/personal/getallmembergroup/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json'
      })
    });
  }
  deleteCompanyMember(token: string, userid: string): Observable<any> {
    const body = { userID: userid }
    return this.http.post(this.baseurl + '/personal/deletecompanymember/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  getAllPermissions(token: string): Observable<any> {
    return this.http.get(this.baseurl + '/personal/getallpermissions/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createMemberGroup(token:string,groupname:string,per:any): Observable<any>
  {
    const body = { groupname: groupname,permissions:per }
    return this.http.post(this.baseurl + '/personal/createmembergroup/',body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editMemberGroup(token:string,groupid:string, groupname:string,per:any): Observable<any>
  {
    const body = { groupname: groupname,groupid:groupid,permissions:per }
    return this.http.post(this.baseurl + '/personal/editmembergroup/',body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deleteMembersGroup(token: string, userid: string): Observable<any> {
    const body = { userID: userid }
    return this.http.post(this.baseurl + '/personal/deletemembersgroup/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createprovince(token: string, pname: string): Observable<any> {
    const body = { provincename: pname }
    return this.http.post(this.baseurl + '/baseinfo/createprovince/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createcounty(token: string, coname: string,pid:string): Observable<any> {
    const body = { countyname: coname,provinceid:pid }
    return this.http.post(this.baseurl + '/baseinfo/createcounty/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createcity(token: string, cname: string,coid:string): Observable<any> {
    const body = { cityname: cname,countyid:coid }
    return this.http.post(this.baseurl + '/baseinfo/createcity/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createregion(token: string, rname: string,cid:string): Observable<any> {
    const body = { regionname: rname,cityid:cid }
    return this.http.post(this.baseurl + '/baseinfo/createregion/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createneighbourhood(token: string, nname: string,rid:string): Observable<any> {
    const body = { neighbourhoodname: nname,regionid:rid }
    return this.http.post(this.baseurl + '/baseinfo/createneighbourhood/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editprovince(token: string, pname: string,pid:string): Observable<any> {
    const body = { pname: pname,pid:pid }
    return this.http.post(this.baseurl + '/baseinfo/editprovince/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editcounty(token: string, coname: string,coid:string): Observable<any> {
    const body = { coname: coname,coid:coid }
    return this.http.post(this.baseurl + '/baseinfo/editcounty/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editcity(token: string, cname: string,cid:string): Observable<any> {
    const body = { cname: cname,cid:cid }
    return this.http.post(this.baseurl + '/baseinfo/editcity/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editregion(token: string, rname: string,rid:string): Observable<any> {
    const body = { rname: rname,rid:rid }
    return this.http.post(this.baseurl + '/baseinfo/editregion/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editneighbourhood(token: string, nname: string,nid:string): Observable<any> {
    const body = { nname: nname,nid:nid }
    return this.http.post(this.baseurl + '/baseinfo/editneighbourhood/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deleteprovince(token: string,pid:string): Observable<any> {
    const body = { pid:pid }
    return this.http.post(this.baseurl + '/baseinfo/deleteprovince/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deletecounty(token: string, coid:string): Observable<any> {
    const body = { coid:coid }
    return this.http.post(this.baseurl + '/baseinfo/deletecounty/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deletecity(token: string, cid:string): Observable<any> {
    const body = { cid:cid }
    return this.http.post(this.baseurl + '/baseinfo/deletecity/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deleteregion(token: string, rid:string): Observable<any> {
    const body = {rid:rid }
    return this.http.post(this.baseurl + '/baseinfo/deleteregion/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deleteneighbourhood(token: string, nid:string): Observable<any> {
    const body = {nid:nid }
    return this.http.post(this.baseurl + '/baseinfo/deleteneighbourhood/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
}

