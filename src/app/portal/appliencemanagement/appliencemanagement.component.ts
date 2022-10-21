import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServicesService } from 'src/app/api-services.service';
import { CookieService } from 'ngx-cookie-service';
import { Province } from 'src/app/mainpage/profiles/profile';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { Applience, Problem } from 'src/app/mainpage/orderpage/Order';
import { LocalDataSource } from 'ng2-smart-table';

export interface DialogData {
  userdata: { id: string, titleName: string, titr: string, itemName: string };
  problemData: { appid: string, problemId: string, problemTitle: string, lowPrice: string, highPrice: string, description: string, titleOfDialog: string, buttonTitle: string }
}

@Component({
  selector: 'app-appliencemanagement',
  templateUrl: './appliencemanagement.component.html',
  styleUrls: ['./appliencemanagement.component.css']
})
export class AppliencemanagementComponent implements OnInit {
  image: File[] = [];
  urls: any = [];
  brandurls: any = [];
  applience: Applience[] = []
  createAppliancehow: boolean = false;
  createBrandshow: boolean = false;
  createModelshow: boolean = false;
  selectedsubtasks: Problem[] = [];
  totlalowprice: number = 0;
  totlahighprice: number = 0;
  private formSubmitAttempt!: boolean;
  province: Province[] = [];
  hasPictuer: boolean = false;
  applianceTablevalues: LocalDataSource[] = [];
  brandTablevalues: LocalDataSource[][] = [];
  problemTableSetting: any;
  picbaseurl = "E:/home/mersagro/public_html/media/"
  applianceForm = new FormGroup({     // {5}
    appllianceName: new FormControl('', Validators.required),
    brandName: new FormControl('', Validators.required),
    modelName: new FormControl('', Validators.required),
    regionName: new FormControl('', Validators.required),
    neighbourhoodName: new FormControl('', Validators.required)
  })
  constructor(
    private api: ApiServicesService,
    private tokencookies: CookieService,
    public createUser: MatDialog,
  ) { }
  ngOnInit() {
    this.problemTableSetting = {
      editable: false,
      pager: {
        display: true,
        perPage: 50
      },
      actions: {
        columnTitle: "عملیات",
        add: false,
        edit: false,
        delete: false,
        position: 'left',
        custom: [
          { name: 'editrecord', title: '&nbsp;&nbsp;<i class="fa  fa-pencil" ></i>' },
          { name: 'deleterecord', title: '&nbsp;&nbsp;<i class="fa  fa-trash" ></i>' }]
      },

      columns: {
        title: {
          title: "مشکل",
          filter: false,
        },
        lowprice: {
          title: "کمترین هزینه",
          filter: false,
        },
        highprice: {
          title: "بیشترین هزینه",
          filter: false,
        },

      },
      attr: {
        class: "table table-responsive"
      },
      noDataMessage: "هیچ اطلاعاتی یافت نشد"
    };
    this.FillTable()
  }
  FillTable() {
    var token = this.tokencookies.get('T')

    this.api.getAllApplience(token).subscribe(
      res => {
        this.applience = res;

        for (let i = 0; i < res.length; i++) {
          this.applience[i].pic = this.picbaseurl + this.applience[i].pic
          var appproblem = []
          for (let j = 0; j < res[i]['appCatProblem'].length; j++) {
            appproblem.push({ ID: res[i]['appCatProblem'][j]['id'], title: res[i]['appCatProblem'][j]['problemTitle'], description: res[i]['appCatProblem'][j]['problemDescription'], checked: false, lowprice: res[i]['appCatProblem'][j]['lowPrice'], highprice: res[i]['appCatProblem'][j]['highPrice'] })
          }
          this.applience[i].appProblems = new LocalDataSource(appproblem)
          for (let k = 0; k < res[i]['brands'].length; k++) {
            var brand = res[i]['brands'][k];
            var barndproblem = []
            for (let l = 0; l < brand['brandProblem'].length; l++) {
              barndproblem.push({ ID: brand['brandProblem'][l]['id'], title: brand['brandProblem'][l]['problemTitle'], description: brand['brandProblem'][l]['problemDescription'], checked: false, lowprice: brand['brandProblem'][l]['lowPrice'], highprice: brand['brandProblem'][l]['highPrice'] })
            }
            this.applience[i].brands[k].brandProblems = new LocalDataSource(barndproblem)
          }
        }

      },
      err => {
        console.log(err)
      }

    )
  }
  isFieldInvalid(field: string) { // {6}
    return (
      (!this.applianceForm.get(field)?.valid && this.applianceForm.get(field)?.touched) ||
      (this.applianceForm.get(field)?.untouched && this.formSubmitAttempt)
    );
  }

  ////Appliance///
  createAppliance() {
    this.createAppliancehow = true;
  }
  saveAppliance() {
    var token = this.tokencookies.get('T');
    var aname = this.applianceForm.controls.appllianceName.value
    this.api.createAppliance(token, aname!).subscribe(
      res => {
        console.log(res)
        this.createAppliancehow = false;
        this.FillTable()
      },
      err => {

      }
    )
  }
  cancelAppliance() {
    this.createAppliancehow = false;
  }
  editAppliance(a: any) {
    var data = { id: a.ID, titleName: a.title, titr: "ویرایش لوازم خانگی", itemName: "لوازم خانگی" }
    const dialogRef = this.createUser.open(EditApplianceItemDialog, {
      width: '400px',
      height: 'auto',
      data: { userdata: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save") {
        var Appliancenewname = result.item
        var token = this.tokencookies.get('T')
        this.api.editAppliance(token, Appliancenewname, a.ID).subscribe(
          res => {
            console.log(res)
            this.FillTable();
          },
          err => {
            console.log(err)
          }
        )
      }
    });
  }
  deleteAppliance(a: any) {
    var name = a.title
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-success'
      },
    })
    swalWithBootstrapButtons.fire({
      title: 'حذف لوازم خانگی',
      text: "» اطمینان دارید؟" + name + "آیا از حذف لوازم خانگی «",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '!آره, حذفش کن',
      cancelButtonText: 'نه، بی خیال'
    }).then((result) => {
      if (result.isConfirmed) {
        var token = this.tokencookies.get('T')
        this.api.deleteAppliance(token, a.ID).subscribe(
          res => {
            console.log(res)
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
  creaatAppProblem(app: any, tableIndex: any) {
    var data = { appid: app.ID, problemId: '', problemTitle: '', lowPrice: '', highPrice: '', description: '', titleOfDialog: "ایجاد مشکل", buttonTitle: "ایجاد" }
    const dialogRef = this.createUser.open(CreateProblemDialog, {
      width: '600px',
      height: 'auto',
      data: { problemData: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save") {
        var appproblem = result.item
        var ptitle = appproblem.problemTitle.value?.toString();
        var lp = appproblem.lowPrice.value?.toString();
        var hp = appproblem.highPrice.value?.toString();
        var pdes = appproblem.description.value?.toString();
        var appid = app.ID;
        var token = this.tokencookies.get('T')
        this.api.createappliancecategoryproblem(token, appid!, ptitle!, pdes!, "", lp!, hp!).subscribe(
          res => {
            console.log(res)
            Swal.fire({
              title: 'ایجاد مشکل جدید',
              text: '!با موفقیت انجام شد',
              icon: 'success',
              confirmButtonText: '!متوجه شدم',
            }
            )
            this.applience[tableIndex].appProblems.append({
              ID: result.id, title: appproblem.problemTitle.value,
              description: appproblem.description.value, checked: false, lowprice: appproblem.lowPrice.value, highprice: appproblem.highPrice.value
            })
          },
          err => {
            console.log(err)
          }
        )
      }
    });
  }
  appedit(event: any, tableIndex: any) {
    console.log(event.data)
    switch (event.action) {
      case 'editrecord':
        var data = { appid: tableIndex, problemId: event.data.ID, problemTitle: event.data.title, lowPrice: event.data.lowprice, highPrice: event.data.highprice, description: event.data.description, titleOfDialog: "ویرایش مشکل", buttonTitle: "ذخیره" }
        const dialogRef = this.createUser.open(CreateProblemDialog, {
          width: '600px',
          height: 'auto',
          data: { problemData: data },
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.btn == "edit") {
            var appproblem = result.item
            var ptitle = appproblem.problemTitle.value?.toString();
            var lp = appproblem.lowPrice.value?.toString();
            var hp = appproblem.highPrice.value?.toString();
            var pdes = appproblem.description.value?.toString();
            var pid = event.data.ID;
            var token = this.tokencookies.get('T')
            this.api.editappliancecategoryproblem(token, pid, ptitle!, pdes!, "", lp!, hp!).subscribe(
              res => {
                var appproblemvalue: any[] = [];
                appproblemvalue.push({
                  ID: result.id, title: appproblem.problemTitle.value,
                  description: appproblem.description.value, checked: false, lowprice: appproblem.lowPrice.value, highprice: appproblem.highPrice.value
                })
                this.applience[tableIndex].appProblems.update(event.data, appproblemvalue[0])
                Swal.fire({
                  title: 'ویرایش مشکل',
                  text: '!با موفقیت انجام شد',
                  icon: 'success',
                  confirmButtonText: '!متوجه شدم',
                }
                )
              },
              err => {
                console.log(err)
              });
          }
        });
        break;
      case 'deleterecord':
        var name = event.data.title
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-success'
          },

        })
        swalWithBootstrapButtons.fire({
          title: 'حذف مشکل',
          text: "آیا از حذف " + name + " اطمینان دارید؟",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '!آره, حذفش کن',
          cancelButtonText: 'نه، بی خیال'
        }).then((result) => {
          if (result.isConfirmed) {
            var token = this.tokencookies.get('T')
            this.api.deleteappliancecategoryproblem(token, event.data.ID).subscribe(
              res => {
                console.log(res)
                this.applience[tableIndex].appProblems.remove(event.data)
                Swal.fire({
                  title: name,
                  text: '!با موفقیت حذف شد',
                  icon: 'success',
                  confirmButtonText: '!متوجه شدم',
                }
                )
              },
              err => {
                console.log(err)
              }
            )
          }
        })
        break;
    }
  }
  onSelectFile(event: any, appindex: any) {
    console.log(appindex);

    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        this.image[i] = event.target.files[i]
        reader.onload = (event: any) => {
          this.applience[appindex].pic = event.target.result;

        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  deleteimg(url: any, appIndex: any) {
    if (url != null) {

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-success'
        },
      })
      swalWithBootstrapButtons.fire({
        title: 'حذف تصویر',
        text: "آیا از حذف تصویر «" + this.applience[appIndex].title + "» اطمینان دارید؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '!آره, حذفش کن',
        cancelButtonText: 'نه، بی خیال'
      }).then((result) => {
        if (result.isConfirmed) {

          if (appIndex !== -1) {
            this.applience[appIndex].pic = "";

            this.hasPictuer = false;
            Swal.fire({
              title: 'تصویر ' + this.applience[appIndex].title,
              text: '!با موفقیت حذف شد',
              icon: 'success',
              confirmButtonText: '!متوجه شدم',
            }
            )

          }
        }
      })
    }
  }
  openapp(id: number) {

  }
  ////Brand///
  createBrand() {
    this.createBrandshow = true;
  }
  saveBrand(brand: any) {
    console.log(brand)
    var token = this.tokencookies.get('T');
    var bname = this.applianceForm.controls.brandName.value
    this.api.createBrand(token, bname!, brand.ID).subscribe(
      res => {
        console.log(res)
        this.createBrandshow = false;
        this.FillTable()
      },
      err => {

      }
    )
  }
  cancelBrand() {
    this.createBrandshow = false;
  }
  editBrand(brand: any) {
    var data = { id: brand.id, titleName: brand.brand, titr: "ویرایش برند", itemName: "برند" }
    const dialogRef = this.createUser.open(EditApplianceItemDialog, {
      width: '400px',
      height: 'auto',
      data: { userdata: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save") {
        var brandnewname = result.item
        var token = this.tokencookies.get('T')
        this.api.editBrand(token, brandnewname, brand.ID).subscribe(
          res => {
            console.log(res)
            this.FillTable();
          },
          err => {
            console.log(err)
          }
        )
      }
    });
  }
  deleteBrand(brand: any) {
    var name = brand.brnad
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-success'
      },
    })
    swalWithBootstrapButtons.fire({
      title: 'حذف برند',
      text: "» اطمینان دارید؟" + name + "آیا از حذف برند «",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '!آره, حذفش کن',
      cancelButtonText: 'نه، بی خیال'
    }).then((result) => {
      if (result.isConfirmed) {
        var token = this.tokencookies.get('T')
        this.api.deleteBrand(token, brand.ID).subscribe(
          res => {
            console.log(res)
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
  creaatBrandProblem(brand: any, tableIndex: any, brandindex: any) {
    var data = { appid: brand.ID, problemId: '', problemTitle: '', lowPrice: '', highPrice: '', description: '', titleOfDialog: "ایجاد مشکل", buttonTitle: "ایجاد" }
    const dialogRef = this.createUser.open(CreateProblemDialog, {
      width: '600px',
      height: 'auto',
      data: { problemData: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save") {

        var appproblem = result.item
        var ptitle = appproblem.problemTitle.value?.toString();
        var lp = appproblem.lowPrice.value?.toString();
        var hp = appproblem.highPrice.value?.toString();
        var pdes = appproblem.description.value?.toString();
        var appid = brand.ID;
        var token = this.tokencookies.get('T')
        this.api.createbrandproblem(token, appid!, ptitle!, pdes!, "", lp!, hp!).subscribe(
          res => {
            console.log(res)
            Swal.fire({
              title: 'ایجاد مشکل جدید',
              text: '!با موفقیت انجام شد',
              icon: 'success',
              confirmButtonText: '!متوجه شدم',
            }
            )
            this.applience[tableIndex].brands[brandindex].brandProblems.append({
              ID: result.id, title: appproblem.problemTitle.value,
              description: appproblem.description.value, checked: false, lowprice: appproblem.lowPrice.value, highprice: appproblem.highPrice.value
            })
          },
          err => {
            console.log(err)
          }
        )
      }
    });


  }
  brandedit(event: any, tableIndex: any, brandindex: any) {
    console.log(event.data)
    switch (event.action) {
      case 'editrecord':
        var data = { appid: tableIndex, problemId: event.data.ID, problemTitle: event.data.title, lowPrice: event.data.lowprice, highPrice: event.data.highprice, description: event.data.description, titleOfDialog: "ویرایش مشکل", buttonTitle: "ذخیره" }
        const dialogRef = this.createUser.open(CreateProblemDialog, {
          width: '600px',
          height: 'auto',
          data: { problemData: data },
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.btn == "edit") {
            var appproblem = result.item
            var ptitle = appproblem.problemTitle.value?.toString();
            var lp = appproblem.lowPrice.value?.toString();
            var hp = appproblem.highPrice.value?.toString();
            var pdes = appproblem.description.value?.toString();
            var pid = event.data.ID;
            var token = this.tokencookies.get('T')
            this.api.editbrandproblem(token, pid, ptitle!, pdes!, "", lp!, hp!).subscribe(
              res => {
                var appproblemvalue: any[] = [];
                appproblemvalue.push({
                  ID: result.id, title: appproblem.problemTitle.value,
                  description: appproblem.description.value, checked: false, lowprice: appproblem.lowPrice.value, highprice: appproblem.highPrice.value
                })
                this.applience[tableIndex].brands[brandindex].brandProblems.update(event.data, appproblemvalue[0])
                Swal.fire({
                  title: 'ویرایش مشکل',
                  text: '!با موفقیت انجام شد',
                  icon: 'success',
                  confirmButtonText: '!متوجه شدم',
                }
                )
              },
              err => {
                console.log(err)
              });
          }
        });
        break;
      case 'deleterecord':
        var name = event.data.title
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-success'
          },

        })
        swalWithBootstrapButtons.fire({
          title: 'حذف مشکل',
          text: "آیا از حذف " + name + " اطمینان دارید؟",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '!آره, حذفش کن',
          cancelButtonText: 'نه، بی خیال'
        }).then((result) => {
          if (result.isConfirmed) {
            var token = this.tokencookies.get('T')
            this.api.deletebrandproblem(token, event.data.ID).subscribe(
              res => {
                console.log(res)
                this.applience[tableIndex].brands[brandindex].brandProblems.remove(event.data)
                Swal.fire({
                  title: name,
                  text: '!با موفقیت حذف شد',
                  icon: 'success',
                  confirmButtonText: '!متوجه شدم',
                }
                )
                // this.FillTable()
              },
              err => {
                console.log(err)
              }
            )
          }
        })


        break;
    }
  }
  brandonSelectFile(event: any, appindex: any, brandindex: any) {
    console.log(event)
    console.log(brandindex)
    var ax = this.applience.findIndex(item => item.ID == appindex.ID)
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        this.image[i] = event.target.files[i]
        reader.onload = (event: any) => {
          var bx = this.applience[ax].brands.findIndex(item => item.ID == brandindex.ID)
          this.applience[ax].brands[bx].brandpic = event.target.result;
          console.log(this.applience[ax].brands)
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  deletebarndimg(url: any, appIndex: any, brandindex: any) {
    var ax = this.applience.findIndex(item => item.ID == appIndex.ID)
    var bx = this.applience[ax].brands.findIndex(item => item.ID == brandindex.ID)
    if (url != null) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-success'
        },
      })
      swalWithBootstrapButtons.fire({
        title: 'حذف تصویر',
        text: "آیا از حذف تصویر «" + this.applience[ax].brands[bx].brand + "» اطمینان دارید؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '!آره, حذفش کن',
        cancelButtonText: 'نه، بی خیال'
      }).then((result) => {
        if (result.isConfirmed) {

          if (appIndex !== -1) {
            this.applience[ax].brands[bx].brandpic = "";

            this.hasPictuer = false;
            Swal.fire({
              title: 'تصویر ' + this.applience[ax].brands[bx].brand,
              text: '!با موفقیت حذف شد',
              icon: 'success',
              confirmButtonText: '!متوجه شدم',
            }
            )

          }
        }
      })
    }
  }
  openbarnd(id: any, appindex: any, brandindex: any) {
  }
  ////Model///
  createModel() {
    this.createModelshow = true;
  }
  saveModel(model: any) {
    console.log(model)
    var token = this.tokencookies.get('T');
    var mname = this.applianceForm.controls.modelName.value
    this.api.createModel(token, mname!, model.ID).subscribe(
      res => {
        console.log(res)
        this.createModelshow = false;
        this.FillTable()
      },
      err => {

      }
    )
  }

  cancelModel() {
    this.createModelshow = false;
  }
  editModel(model: any) {
    var data = { id: model.id, titleName: model.model, titr: "ویرایش مدل", itemName: "مدل" }
    const dialogRef = this.createUser.open(EditApplianceItemDialog, {
      width: '400px',
      height: 'auto',
      data: { userdata: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save") {
        var modelnewname = result.item
        var token = this.tokencookies.get('T')
        this.api.editModel(token, modelnewname, model.ID).subscribe(
          res => {
            console.log(res)
            this.FillTable();
          },
          err => {
            console.log(err)
          }
        )
      }
    });
  }
  deleteModel(model: any) {
    var name = model.model
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-success'
      },
    })
    swalWithBootstrapButtons.fire({
      title: 'حذف مدل',
      text: "» اطمینان دارید؟" + name + "آیا از حذف مدل «",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '!آره, حذفش کن',
      cancelButtonText: 'نه، بی خیال'
    }).then((result) => {
      if (result.isConfirmed) {
        var token = this.tokencookies.get('T')
        this.api.deleteModel(token, model.ID).subscribe(
          res => {
            console.log(res)
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

  //////////////
  isNumber(val: any) {
    return (
      !isNaN(Number(Number.parseFloat(String(val)))) &&
      isFinite(Number(val))
    );

  }




}


@Component({
  selector: 'edit-item-Dialog',
  templateUrl: 'editItem.html',
  styleUrls: ['./appliencemanagement.component.css']
})
export class EditApplianceItemDialog implements OnInit {
  titr: string;
  title: string;
  private formSubmitAttempt!: boolean;
  form = new FormGroup({
    itemTitle: new FormControl('', Validators.required),
  })
  constructor(
    private api: ApiServicesService,
    private tokencookie: CookieService,
    public dialogRef: MatDialogRef<EditApplianceItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
  ngOnInit(): void {
    console.log(this.data.userdata)
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
    var data: { btn: string, item: string } = { btn: "save", item: this.form.controls.itemTitle.value! }
    this.dialogRef.close(data);

  }
  close() {
    var data: { btn: string } = { btn: "cancel" }
    this.dialogRef.close(data);
  }

}


@Component({
  selector: 'cerate-problem-Dialog',
  templateUrl: 'createpeoblem.html',
  styleUrls: ['./appliencemanagement.component.css']
})
export class CreateProblemDialog implements OnInit {
  titleOfDialog: string;
  buttonTitle: string;
  private formSubmitAttempt!: boolean;
  form = new FormGroup({
    problemTitle: new FormControl('', Validators.required),
    lowPrice: new FormControl('', Validators.required),
    highPrice: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  })
  constructor(
    private api: ApiServicesService,
    private tokencookie: CookieService,
    public dialogRef: MatDialogRef<EditApplianceItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
  ngOnInit(): void {

    this.titleOfDialog = this.data.problemData.titleOfDialog;
    this.buttonTitle = this.data.problemData.buttonTitle;
    this.form.controls.problemTitle.patchValue(this.data.problemData.problemTitle);
    this.form.controls.problemTitle.markAsDirty();
    this.form.controls.lowPrice.patchValue(this.data.problemData.lowPrice);
    this.form.controls.lowPrice.markAsDirty();
    this.form.controls.highPrice.patchValue(this.data.problemData.highPrice);
    this.form.controls.highPrice.markAsDirty();
    this.form.controls.description.patchValue(this.data.problemData.description);
    this.form.controls.description.markAsDirty();

  }
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  create() {
    if (this.titleOfDialog == "ایجاد مشکل") {
      var data = { btn: "save", item: this.form.controls }
      this.dialogRef.close(data);
    }
    else {
      var data = { btn: "edit", item: this.form.controls }
      this.dialogRef.close(data);
    }
  }
  close() {
    var data: { btn: string } = { btn: "cancel" }
    this.dialogRef.close(data);
  }

}

