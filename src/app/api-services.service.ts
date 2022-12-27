import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  private baseurl = environment.API_URL;

  // private baseurl = "https://api-is.mersa-group.ir";
  // private baseurl = "http://localhost:8000";
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

    const body = { mobile: mob }
    return this.http.post(this.baseurl + '/personal/sendsms/', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  ForgetSendSms(mob: string | null | undefined, uid: string): Observable<any> {
    const body = { mobile: mob, uid: uid };
    return this.http.post(this.baseurl + '/personal/ForgetSendSms/', body, {
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
   // console.log(body)
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
    return this.http.get(this.baseurl + '/baseinfo/getregions/', {
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
  gettechniciansdetails(token: string, userid: string): Observable<any> {
    const body = { userID: userid }
    return this.http.post(this.baseurl + '/personal/gettechniciansdetails/', body, {
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
   // console.log(body)
    return this.http.post(this.baseurl + '/personal/editcompanymembers/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json'
      })
    });

  }
  registerCompanyMember(token: string, user: string, pass: string, fname: string, lname: string, nationalid: string, group: string, usercategory: number, mobile: string): Observable<any> {
    const body = { username: user, password: pass, fname: fname, lname: lname, nationalid: nationalid, group: group, usercategory: usercategory.toString(), mobile: mobile };
   // console.log(body)
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
  createMemberGroup(token: string, groupname: string, per: any): Observable<any> {
    const body = { groupname: groupname, permissions: per }
    return this.http.post(this.baseurl + '/personal/createmembergroup/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editMemberGroup(token: string, groupid: string, groupname: string, per: any): Observable<any> {
    const body = { groupname: groupname, groupid: groupid, permissions: per }
    return this.http.post(this.baseurl + '/personal/editmembergroup/', body, {
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
  createcounty(token: string, coname: string, pid: string): Observable<any> {
    const body = { countyname: coname, provinceid: pid }
    return this.http.post(this.baseurl + '/baseinfo/createcounty/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createcity(token: string, cname: string, coid: string): Observable<any> {
    const body = { cityname: cname, countyid: coid }
    return this.http.post(this.baseurl + '/baseinfo/createcity/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createregion(token: string, rname: string, cid: string): Observable<any> {
    const body = { regionname: rname, cityid: cid }
    return this.http.post(this.baseurl + '/baseinfo/createregion/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createneighbourhood(token: string, nname: string, rid: string): Observable<any> {
    const body = { neighbourhoodname: nname, regionid: rid }
    return this.http.post(this.baseurl + '/baseinfo/createneighbourhood/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editprovince(token: string, pname: string, pid: string): Observable<any> {
    const body = { pname: pname, pid: pid }
    return this.http.post(this.baseurl + '/baseinfo/editprovince/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editcounty(token: string, coname: string, coid: string): Observable<any> {
    const body = { coname: coname, coid: coid }
    return this.http.post(this.baseurl + '/baseinfo/editcounty/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editcity(token: string, cname: string, cid: string): Observable<any> {
    const body = { cname: cname, cid: cid }
    return this.http.post(this.baseurl + '/baseinfo/editcity/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editregion(token: string, rname: string, rid: string): Observable<any> {
    const body = { rname: rname, rid: rid }
    return this.http.post(this.baseurl + '/baseinfo/editregion/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editneighbourhood(token: string, nname: string, nid: string): Observable<any> {
    const body = { nname: nname, nid: nid }
    return this.http.post(this.baseurl + '/baseinfo/editneighbourhood/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deleteprovince(token: string, pid: string): Observable<any> {
    const body = { pid: pid }
    return this.http.post(this.baseurl + '/baseinfo/deleteprovince/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deletecounty(token: string, coid: string): Observable<any> {
    const body = { coid: coid }
    return this.http.post(this.baseurl + '/baseinfo/deletecounty/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deletecity(token: string, cid: string): Observable<any> {
    const body = { cid: cid }
    return this.http.post(this.baseurl + '/baseinfo/deletecity/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deleteregion(token: string, rid: string): Observable<any> {
    const body = { rid: rid }
    return this.http.post(this.baseurl + '/baseinfo/deleteregion/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deleteneighbourhood(token: string, nid: string): Observable<any> {
    const body = { nid: nid }
    return this.http.post(this.baseurl + '/baseinfo/deleteneighbourhood/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createAppliance(token: string, aname: string): Observable<any> {
    const body = { appliancename: aname }
    return this.http.post(this.baseurl + '/baseinfo/createappliance/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editAppliance(token: string, aname: string, aid: string): Observable<any> {
    const body = { aname: aname, aid: aid }
    return this.http.post(this.baseurl + '/baseinfo/editappliance/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deleteAppliance(token: string, aid: string): Observable<any> {
    const body = { aid: aid }
    return this.http.post(this.baseurl + '/baseinfo/deleteappliance/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createBrand(token: string, bname: string, bid: string): Observable<any> {
    const body = { bname: bname, bid: bid }
    return this.http.post(this.baseurl + '/baseinfo/createbrand/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editBrand(token: string, bname: string, bid: string): Observable<any> {
    const body = { bname: bname, bid: bid }
    return this.http.post(this.baseurl + '/baseinfo/editbrand/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deleteBrand(token: string, bid: string): Observable<any> {
    const body = { bid: bid }
    return this.http.post(this.baseurl + '/baseinfo/deletebrand/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createModel(token: string, mname: string, mid: string): Observable<any> {
    const body = { mname: mname, mid: mid }
    return this.http.post(this.baseurl + '/baseinfo/createmodel/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editModel(token: string, mname: string, mid: string): Observable<any> {
    const body = { mname: mname, mid: mid }
    return this.http.post(this.baseurl + '/baseinfo/editmodel/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deleteModel(token: string, mid: string): Observable<any> {
    const body = { mid: mid }
    return this.http.post(this.baseurl + '/baseinfo/deletemodel/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createappliancecategoryproblem(token: string, appcat: string, ptitle: string, pdes: string, pkind: string, lp: string, hp: string): Observable<any> {
    const body = {
      appliance: appcat,
      title: ptitle,
      description: pdes,
      kind: pkind,
      lowprice: lp,
      highprice: hp
    }
    return this.http.post(this.baseurl + '/baseinfo/createappliancecategoryproblem/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }

  editappliancecategoryproblem(token: string, id: string, ptitle: string, pdes: string, pkind: string, lp: string, hp: string): Observable<any> {
    const body = {
      id: id,
      title: ptitle,
      description: pdes,
      kind: pkind,
      lowprice: lp,
      highprice: hp
    }
    return this.http.post(this.baseurl + '/baseinfo/editappliancecategoryproblem/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deleteappliancecategoryproblem(token: string, pid: string): Observable<any> {
    const body = {
      id: pid,
    }
    return this.http.post(this.baseurl + '/baseinfo/deleteappliancecategoryproblem/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createappliancecategorychecklist(token: string, appcat: string, chtitle: string, chdes: string): Observable<any> {
    const body = {
      appliance: appcat,
      title: chtitle,
      description: chdes,
    }
    return this.http.post(this.baseurl + '/baseinfo/createappliancecategorychecklist/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }

  editappliancecategorychecklist(token: string, id: string, chtitle: string, chdes: string): Observable<any> {
    const body = {
      id: id,
      title: chtitle,
      description: chdes
    }
    return this.http.post(this.baseurl + '/baseinfo/editappliancecategorychecklist/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  deleteappliancecategorycheckliast(token: string, pid: string): Observable<any> {
    const body = {
      id: pid,
    }
    return this.http.post(this.baseurl + '/baseinfo/deleteappliancecategorychecklist/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createbrandproblem(token: string, brand: string, ptitle: string, pdes: string, pkind: string, lp: string, hp: string): Observable<any> {
    const body = {
      brand: brand,
      title: ptitle,
      description: pdes,
      kind: pkind,
      lowprice: lp,
      highprice: hp
    }
    return this.http.post(this.baseurl + '/baseinfo/createbrandproblem/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editbrandproblem(token: string, id: string, ptitle: string, pdes: string, pkind: string, lp: string, hp: string): Observable<any> {
    const body = {
      id: id,
      title: ptitle,
      description: pdes,
      kind: pkind,
      lowprice: lp,
      highprice: hp
    }
    return this.http.post(this.baseurl + '/baseinfo/editbrandproblem/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }

  deletebrandproblem(token: string, pid: string): Observable<any> {
    const body = {
      id: pid,
    }
    return this.http.post(this.baseurl + '/baseinfo/deletebrandproblem/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }

  createmodelproblem(token: string, brand: string, ptitle: string, pdes: string, pkind: string, lp: string, hp: string): Observable<any> {
    const body = {
      brand: brand,
      title: ptitle,
      description: pdes,
      kind: pkind,
      lowprice: lp,
      highprice: hp
    }
    return this.http.post(this.baseurl + '/baseinfo/createmodelproblem/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  editmodelproblem(token: string, id: string, ptitle: string, pdes: string, pkind: string, lp: string, hp: string): Observable<any> {
    const body = {
      id: id,
      title: ptitle,
      description: pdes,
      kind: pkind,
      lowprice: lp,
      highprice: hp
    }
    return this.http.post(this.baseurl + '/baseinfo/editmodelproblem/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }

  deletemodelproblem(token: string, pid: string): Observable<any> {
    const body = {
      id: pid,
    }
    return this.http.post(this.baseurl + '/baseinfo/deletemodelproblem/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  getallcustomersdetails(token: string): Observable<any> {
    return this.http.get(this.baseurl + '/personal/getallcustomersdetails/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  CreateCustomerAddress(token: string, body: any): Observable<any> {
    return this.http.post(this.baseurl + '/personal/createcustomeraddress/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  EditCustomerAddress(token: string, body: any): Observable<any> {

    return this.http.post(this.baseurl + '/personal/editcustomeraddress/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  DeleteCustomerAddress(token: string, addid: any): Observable<any> {
    const body = { addid: addid }
    return this.http.post(this.baseurl + '/personal/deletecustomeraddress/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createorder(token: string, order: any): Observable<any> {
    const body = { order: order};
    return this.http.post(this.baseurl + '/order/createorder/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createFCMdevice(token: string, tokenfcm: any, userid: string): Observable<any> {
    const body = { tokenFcm: tokenfcm, userId: userid };
    return this.http.post(this.baseurl + '/baseinfo/createFCMdevice/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  createcustomerappliance(token: string, uid: any, aid: string, serial: string): Observable<any> {
    const body = { cid: uid, aid: aid, aserial: serial };
    return this.http.post(this.baseurl + '/order/createcustomerappliance/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  getcustomerorders(token: string, cid: any): Observable<any> {
    const body = { cid: cid };
    return this.http.post(this.baseurl + '/order/getcustomerorders/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }
  changepass(user: string, pass: string): Observable<any> {
    const body = { uid: user, pass: pass };
    return this.http.post(this.baseurl + '/personal/changepass/', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',

      })
    });
  }
  getproblemkind(token: string): Observable<any> {

    return this.http.get(this.baseurl + '/baseinfo/getproblemkind/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    })
  }

  setlog(token: string, action: string): Observable<any> {
    const body = { action: action };
    return this.http.post(this.baseurl + '/baseinfo/setlog/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  deletetechnicianskill(token: string, skillsid: string,): Observable<any> {
    const body = { skillsid: skillsid };
    return this.http.post(this.baseurl + '/personal/deletetechnicianskill/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }

  createtechniciandistricts(token: string, techid: string, districts: any): Observable<any> {
    const body = { techid: techid, districts: districts };
    return this.http.post(this.baseurl + '/personal/createtechniciandistricts/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }

  deletetechniciandistrict(token: string, districtsid: string): Observable<any> {
    const body = { districtsid: districtsid };
    return this.http.post(this.baseurl + '/personal/deletetechniciandistrict/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  createtechnicianskills(token: string, techid: string, skills: any): Observable<any> {
    const body = { techid: techid, skills: skills };
    return this.http.post(this.baseurl + '/personal/createtechnicianskills/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  gettechniciandistricts(token: string, techid: string): Observable<any> {
    const body = { techid: techid };
    return this.http.post(this.baseurl + '/personal/gettechniciandistricts/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  gettechnicianskills(token: string, techid: string): Observable<any> {
    const body = { techid: techid };
    return this.http.post(this.baseurl + '/personal/gettechnicianskills/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  editprofile(token: string, uid: string, fname: string, lname: string, nid: string, bdate: string): Observable<any> {
    const body = { uid: uid, fname: fname, lname: lname, nid: nid, bdate: bdate };
    return this.http.post(this.baseurl + '/personal/editprofile/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  saveusersmobile(token: string, uid: string, mobiles: string[]): Observable<any> {
    const body = { uid: uid, mobiles: mobiles };
    return this.http.post(this.baseurl + '/personal/saveusersmobile/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  saveuserstel(token: string, uid: string, tels: string[]): Observable<any> {
    const body = { uid: uid, tels: tels };
    return this.http.post(this.baseurl + '/personal/saveuserstel/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  edittechnicianfav(token: string, uid: string, fav: string): Observable<any> {
    const body = { uid: uid, fav: fav };
    return this.http.post(this.baseurl + '/personal/edittechnicianfav/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  edittechnicianrank(token: string, uid: string, rank: string): Observable<any> {
    const body = { uid: uid, rank: rank };
    return this.http.post(this.baseurl + '/personal/edittechnicianrank/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  edittechnicianactivation(token: string, uid: string, act: boolean): Observable<any> {
    const body = { uid: uid, act: act };
    return this.http.post(this.baseurl + '/personal/edittechnicianactivation/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  edittechnicianstatus(token: string, uid: string, status: string): Observable<any> {
    const body = { uid: uid, status: status };
    return this.http.post(this.baseurl + '/personal/edittechnicianstatus/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  setfillprofileture(token: string, uid: string): Observable<any> {
    const body = { uid: uid, };
    return this.http.post(this.baseurl + '/personal/setfillprofileture/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  setfillprofilefalse(token: string, uid: string): Observable<any> {
    const body = { uid: uid, };
    return this.http.post(this.baseurl + '/personal/setfillprofilefalse/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getalluserorders(token: string, userID: string): Observable<any> {
    const body = { userID: userID, };
    return this.http.post(this.baseurl + '/order/getalluserorders/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getallorders(token: string): Observable<any> {
    return this.http.get(this.baseurl + '/order/getallorders/',  {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getuserstatusorders(token: string, userID: string, status:string): Observable<any> {
    const body = { userID: userID,status:status };
    return this.http.post(this.baseurl + '/order/getuserstatusorders/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getalltechorders(token: string, techID: string): Observable<any> {
    const body = { techID: techID, };
    return this.http.post(this.baseurl + '/order/getalltechorders/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  gettechstatusorders(token: string, techID: string,status:string): Observable<any> {
    const body = { techID: techID,status:status };
    return this.http.post(this.baseurl + '/order/gettechstatusorders/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getuserchatstatus(token: string, uid: any): Observable<any> {
    const body = { uid: uid };
    return this.http.post(this.baseurl + '/support/getuserchatstatus/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  connectedusers(token: string): Observable<any> {
  
    return this.http.get(this.baseurl + '/support/connectedusers/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  sendmessages(token: string, receiverid:string,messageText:string): Observable<any> {
    const body = { receiverid:receiverid,messageText:messageText };
    return this.http.post(this.baseurl + '/support/sendmessages/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getusermessages(token: string, rid:string): Observable<any> {
    const body = { rid:rid };
    return this.http.post(this.baseurl + '/support/getusermessages/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  setactiveuser(token: string): Observable<any> {
    return this.http.get(this.baseurl + '/support/setactiveuser/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  setdeactiveuser(token: string): Observable<any> {
    return this.http.get(this.baseurl + '/support/setdeactiveuser/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getdatetimenow(token: string): Observable<any> {
    return this.http.get(this.baseurl + '/support/getdatetimenow/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  sendmessagenotification(token: string,senderID:string,reciverID:string,message:string): Observable<any> {
    const body = { senderID:senderID,reciverID:reciverID,message:message };
    return this.http.post(this.baseurl + '/order/sendmessagenotification/',body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getorder(token: string, orderID: string): Observable<any> {
    const body = { orderID: orderID, };
    return this.http.post(this.baseurl + '/order/getorder/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  setguaranteeaccept(token: string, orderID: string,Gval:boolean): Observable<any> {
    const body = { orderID: orderID,Gval:Gval };
    return this.http.post(this.baseurl + '/order/setguaranteeaccept/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getsurveyquestions(token: string,sKind:string): Observable<any> {
    const body = { sKind: sKind };
    return this.http.post(this.baseurl + '/support/getsurveyquestions/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  savesurvey(token: string,Qans:any): Observable<any> {
    const body = { Qans: Qans };
    return this.http.post(this.baseurl + '/support/savesurvey/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getordersurvey(token: string,orderID:string): Observable<any> {
    const body = { orderID: orderID };
    return this.http.post(this.baseurl + '/support/getordersurvey/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  acceptorder(token: string,orderID:string): Observable<any> {
    const body = { orderID: orderID };
    return this.http.post(this.baseurl + '/order/acceptorder/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  rejectorder(token: string,orderID:string): Observable<any> {
    const body = { orderID: orderID };
    return this.http.post(this.baseurl + '/order/rejectorder/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  gettechoffers(token: string,techID:string): Observable<any> {
    const body = { techID: techID };
    return this.http.post(this.baseurl + '/order/gettechoffers/', body, {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
  getuserorderstech(token: string): Observable<any> {
  
    return this.http.get(this.baseurl + '/order/getuserorderstech/', {
      headers: new HttpHeaders({
        'Authorization': 'Token  ' + token,
        'Content-Type': 'application/json',
      })
    });
  }
}

