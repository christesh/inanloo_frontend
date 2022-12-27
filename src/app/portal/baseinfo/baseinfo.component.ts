import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServicesService } from 'src/app/api-services.service';
import { CookieService } from 'ngx-cookie-service';
import { Province } from 'src/app/mainpage/profiles/profile';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { faL } from '@fortawesome/free-solid-svg-icons';

export interface DialogData {
  userdata: { id: string, titleName: string, titr: string, itemName: string };
}
@Component({
  selector: 'app-baseinfo',
  templateUrl: './baseinfo.component.html',
  styleUrls: ['./baseinfo.component.css']
})
export class BaseinfoComponent implements OnInit {
  createProvinceshow: boolean = false;
  createCountyshow: boolean = false;
  createCityshow: boolean = false;
  createRegionshow: boolean = false;
  createNeighbourhoodshow: boolean = false;
  private formSubmitAttempt!: boolean;
  province: Province[] = []
  provinceForm = new FormGroup({     // {5}
    provinceName: new FormControl('', Validators.required),
    countyName: new FormControl('', Validators.required),
    cityName: new FormControl('', Validators.required),
    regionName: new FormControl('', Validators.required),
    neighbourhoodName: new FormControl('', Validators.required)
  })
  constructor(
    private api: ApiServicesService,
    private tokencookies: CookieService,
    public createUser: MatDialog,
  ) { }
  ngOnInit() {
    this.FillTable()
  }
  FillTable() {
    var token = this.tokencookies.get('T')
    this.api.getRegins(token).subscribe(
      res => {
       // console.log(res)
        this.province = res;
      },
      err => {
       console.log(err)
      })
  }

  isFieldInvalid(field: string) { // {6}
    return (
      (!this.provinceForm.get(field)?.valid && this.provinceForm.get(field)?.touched) ||
      (this.provinceForm.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  ////pronince///
  createProvince() {
    this.createProvinceshow = true;
  }
  saveProvince() {
    var token = this.tokencookies.get('T');
    var pname = this.provinceForm.controls.provinceName.value
    this.api.createprovince(token, pname!).subscribe(
      res => {
       // console.log(res)
        this.createProvinceshow = false;
        this.FillTable()
      },
      err => {

      }
    )
  }
  cancelProvince() {
    this.createProvinceshow = false;
  }
  editProvince(p: any) {
    var data = { id: p.id, titleName: p.provinceName, titr: "ویرایش استان", itemName: "استان" }
    const dialogRef = this.createUser.open(EditItemDialog, {
      width: '400px',
      height: 'auto',
      data: { userdata: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save") {
        var provincenewname=result.item
        var token=this.tokencookies.get('T')
        this.api.editprovince(token,provincenewname,p.id).subscribe(
          res=>
          {
           // console.log(res)
            this.FillTable();
          },
          err=>
          {
           console.log(err)
          }
        )
      }
    });
  }
  deleteProvince(p: any) {
    var name = p.provinceName
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-success'
      },
    })
    swalWithBootstrapButtons.fire({
      title: 'حذف استان',
      text: "آیا از حذف استان «" + name + "» اطمینان دارید؟",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '!آره, حذفش کن',
      cancelButtonText: 'نه، بی خیال'
    }).then((result) => {
      if (result.isConfirmed) {
        var token = this.tokencookies.get('T')
        this.api.deleteprovince(token, p.id).subscribe(
          res => {
           // console.log(res)
            Swal.fire({
              title: name,
              text: '!با موفقیت حذف شد',
              icon: 'success',
              confirmButtonText: '!متوجه شدم',
            }
            )
            this.FillTable()
          },
          err => {
           console.log(err)
          }
        )
      }
    })
  }

  ////county///
  createCounty() {
    this.createCountyshow = true;
  }
  saveCounty(p: any) {
   // console.log(p)
    var token = this.tokencookies.get('T');
    var coname = this.provinceForm.controls.countyName.value
    this.api.createcounty(token, coname!,p.id).subscribe(
      res => {
       // console.log(res)
        this.createCountyshow = false;
        this.FillTable()
      },
      err => {

      }
    )
  }
  cancelCounty() {
    this.createCountyshow = false;
  }
  editCounty(county: any) {
    var data = { id: county.id, titleName: county.countyName, titr: "ویرایش شهرستان", itemName: "شهرستان" }
    const dialogRef = this.createUser.open(EditItemDialog, {
      width: '400px',
      height: 'auto',
      data: { userdata: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save") {
        var countynewname=result.item
        var token=this.tokencookies.get('T')
        this.api.editcounty(token,countynewname,county.id).subscribe(
          res=>
          {
           // console.log(res)
            this.FillTable();
          },
          err=>
          {
           console.log(err)
          }
        )
      }
    });
  }
  deleteCounty(p: any) {
    var name = p.countyName
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-success'
      },
    })
    swalWithBootstrapButtons.fire({
      title: 'حذف شهرستان',
      text: "آیا از حذف شهرستان «" + name + "» اطمینان دارید؟",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '!آره, حذفش کن',
      cancelButtonText: 'نه، بی خیال'
    }).then((result) => {
      if (result.isConfirmed) {
        var token = this.tokencookies.get('T')
        this.api.deletecounty(token, p.id).subscribe(
          res => {
           // console.log(res)
            Swal.fire({
              title: name,
              text: '!با موفقیت حذف شد',
              icon: 'success',
              confirmButtonText: '!متوجه شدم',
            }
            )
            this.FillTable()
          },
          err => {
           console.log(err)
          }
        )
      }
    })
  }


  ////city///
  createCity() {
    this.createCityshow = true;
  }
  saveCity(county: any) {
   // console.log(county)
    var token = this.tokencookies.get('T');
    var cname = this.provinceForm.controls.cityName.value
    this.api.createcity(token, cname!,county.id).subscribe(
      res => {
       // console.log(res)
        this.createCityshow = false;
        this.FillTable()
      },
      err => {

      }
    )
  }
 
  cancelCity() {
    this.createCityshow = false;
  }
  editCity(city: any) {
    var data = { id: city.id, titleName: city.cityName, titr: "ویرایش شهر", itemName: "شهر" }
    const dialogRef = this.createUser.open(EditItemDialog, {
      width: '400px',
      height: 'auto',
      data: { userdata: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save") {
        var citynewname=result.item
        var token=this.tokencookies.get('T')
        this.api.editcity(token,citynewname,city.id).subscribe(
          res=>
          {
           // console.log(res)
            this.FillTable();
          },
          err=>
          {
           console.log(err)
          }
        )
      }
    });
  }
  deleteCity(p: any) {
    var name = p.cityName
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-success'
      },
    })
    swalWithBootstrapButtons.fire({
      title: 'حذف شهر',
      text: "آیا از حذف شهر «" + name + "» اطمینان دارید؟",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '!آره, حذفش کن',
      cancelButtonText: 'نه، بی خیال'
    }).then((result) => {
      if (result.isConfirmed) {
        var token = this.tokencookies.get('T')
        this.api.deletecity(token, p.id).subscribe(
          res => {
           // console.log(res)
            Swal.fire({
              title: name,
              text: '!با موفقیت حذف شد',
              icon: 'success',
              confirmButtonText: '!متوجه شدم',
            }
            )
            this.FillTable()
          },
          err => {
           console.log(err)
          }
        )
      }
    })
  }


  ////region///
  createRegion() {
    this.createRegionshow = true;
  }
  saveRegion(city: any) {
   // console.log(city)
    var token = this.tokencookies.get('T');
    var rname = this.provinceForm.controls.regionName.value
    this.api.createregion(token, rname!,city.id).subscribe(
      res => {
       // console.log(res)
        this.createRegionshow = false;
        this.FillTable()
      },
      err => {

      }
    )
  }
  cancelRegion() {
    this.createRegionshow = false;
  }
  editRegion(region: any) {
    var data = { id: region.id, titleName: region.regionName, titr: "ویرایش منطقه", itemName: "منطقه" }
    const dialogRef = this.createUser.open(EditItemDialog, {
      width: '400px',
      height: 'auto',
      data: { userdata: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save") {
        var regionnewname=result.item
        var token=this.tokencookies.get('T')
        this.api.editregion(token,regionnewname,region.id).subscribe(
          res=>
          {
           // console.log(res)
            this.FillTable();
          },
          err=>
          {
           console.log(err)
          }
        )
      }
    });
  }
  deleteRegion(p: any) {
    var name = p.regionName
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-success'
      },
    })
    swalWithBootstrapButtons.fire({
      title: 'حذف منطقه',
      text: "آیا از حذف منطقه «" + name + "» اطمینان دارید؟",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '!آره, حذفش کن',
      cancelButtonText: 'نه، بی خیال'
    }).then((result) => {
      if (result.isConfirmed) {
        var token = this.tokencookies.get('T')
        this.api.deleteregion(token, p.id).subscribe(
          res => {
           // console.log(res)
            Swal.fire({
              title: name,
              text: '!با موفقیت حذف شد',
              icon: 'success',
              confirmButtonText: '!متوجه شدم',
            }
            )
            this.FillTable()
          },
          err => {
           console.log(err)
          }
        )
      }
    })
  }
  ///Neighbourhood///
  createNeighbourhood() {
    this.createNeighbourhoodshow = true;
  }
  saveNeighbourhood(region: any) {
   // console.log(region)
    var token = this.tokencookies.get('T');
    var nname = this.provinceForm.controls.neighbourhoodName.value
    this.api.createneighbourhood(token, nname!,region.id).subscribe(
      res => {
       // console.log(res)
        this.createNeighbourhoodshow = false;
        this.FillTable()
      },
      err => {

      }
    )
  }
  cancelNeighbourhood() {
    this.createNeighbourhoodshow = false;
  }
  editNeighbourhood(neighbourhood: any) {
    var data = { id: neighbourhood.id, titleName: neighbourhood.neighbourhoodName, titr: "ویرایش محله", itemName: "محله" }
    const dialogRef = this.createUser.open(EditItemDialog, {
      width: '400px',
      height: 'auto',
      data: { userdata: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save") {
        var neighbourhoodnewname=result.item
        var token=this.tokencookies.get('T')
        this.api.editneighbourhood(token,neighbourhoodnewname,neighbourhood.id).subscribe(
          res=>
          {
           // console.log(res)
            this.FillTable();
          },
          err=>
          {
           console.log(err)
          }
        )
      }
    });
  }
  deleteNeighbourhood(p: any) {
    var name = p.neighbourhoodName
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-success'
      },
    })
    swalWithBootstrapButtons.fire({
      title: 'حذف محله',
      text: "» اطمینان دارید؟" + name + "آیا از حذف محله «",
    
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '!آره, حذفش کن',
      cancelButtonText: 'نه، بی خیال'
    }).then((result) => {
      if (result.isConfirmed) {
        var token = this.tokencookies.get('T')
        this.api.deleteneighbourhood(token, p.id).subscribe(
          res => {
           // console.log(res)
            Swal.fire({
              title: name,
              text: '!با موفقیت حذف شد',
              icon: 'success',
              confirmButtonText: '!متوجه شدم',
            }
            )
            this.FillTable()
          },
          err => {
           console.log(err)
          }
        )
      }
    })
  }

}





@Component({
  selector: 'edit-item-Dialog',
  templateUrl: 'editItem.html',
  styleUrls: ['./baseinfo.component.css']
})
export class EditItemDialog implements OnInit {
  titr: string;
  title: string;
  private formSubmitAttempt!: boolean;
  form = new FormGroup({
    itemTitle: new FormControl('', Validators.required),
  })
  constructor(
    private api: ApiServicesService,
    private tokencookie: CookieService,
    public dialogRef: MatDialogRef<EditItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
  ngOnInit(): void {
   // console.log(this.data.userdata)
    this.form.controls.itemTitle.patchValue(this.data.userdata.titleName);
    this.form.controls.itemTitle.markAsDirty();
    this.title = this.data.userdata.itemName;
    this.titr = this.data.userdata.titr;
  }
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  create() {


    var data: { btn: string,item:string } = { btn: "save", item:this.form.controls.itemTitle.value! }
    this.dialogRef.close(data);

  }
  close() {
    var data: { btn: string } = { btn: "cancel" }
    this.dialogRef.close(data);
  }
}

