import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatError } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { LocalDataSource } from 'ng2-smart-table';
import { CookieService } from 'ngx-cookie-service';
import { ApiServicesService } from 'src/app/api-services.service';
import { Applience } from 'src/app/mainpage/orderpage/Order';
import { DialogData } from '../usermanagement/usermanagement.component';

@Component({
  selector: 'app-stafforder',
  templateUrl: './stafforder.component.html',
  styleUrls: ['./stafforder.component.scss']
})
export class StafforderComponent implements OnInit {
  searchText = ""
  customerdetailfromstaff: boolean = false;
  constructor(
    private api: ApiServicesService,
    private tokencookies: CookieService,
    public signupdialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }
  customertablevalue: LocalDataSource;
  customerTable: any;
  orderstablevalue: LocalDataSource;
  ordersTable: any;
 
  showorder: boolean = false;
  showCustomerDetail: boolean = false;
  showOrderDetail: boolean = false;
  showOrders: boolean = false;
  customerName = "";
  customerFamily = "";
  ngOnInit() {
    this.customerdetailfromstaff = false;

    this.customerTable = {
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
          { name: 'viewrecord', title: '<i class="fa fa-eye"  ></i>' },
          { name: 'makeorder', title: '&nbsp;&nbsp;<i class="fa fa-plus-square" ></i>' }]
      },
      columns: {
        mobile: {
          title: "شماره موبایل"
        },
        national_id: {
          title: "کد ملی "
        },
        f_name: {
          title: "نام "
        },
        l_name: {
          title: "نام خانوادگی "
        },
        class: {
          title: "کلاس"
        },

      },
      attr: {
        class: "table table-responsive"
      },
      noDataMessage: "هیچ اطلاعاتی یافت نشد"
    };
    this.ordersTable = {
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
          { name: 'viewrecord', title: '<i class="fa fa-eye"  ></i>' },
          { name: 'editrecord', title: '&nbsp;&nbsp;<i class="fa  fa-pencil" style="color:grean" ></i>' },]
      },
      columns: {
        status: {
          title: "وضعیت سفارش"
        },
        appliance: {
          title: "وسیله انتخابی"
        },
        date: {
          title: "تاریخ ثبت سفارش"
        },
        technician: {
          title: "نام تکنسین"
        },
        payment: {
          title: "هزینه"
        },

      },
      attr: {
        class: "table table-responsive"
      },
      noDataMessage: "هیچ اطلاعاتی یافت نشد"

    }
    this.showorder = false;
     this.FillTable();
  }
  applience: Applience[] = []
  FillTable() {
    var token = this.tokencookies.get('T')
    this.api.getAllApplience(token).subscribe(
      res => {
        this.applience = res
       // console.log(this.applience)
      }, err => {
       console.log(err)
      }
    )
    this.api.getallcustomersdetails(token).subscribe(
      res => {
       // console.log(res)
        var ct: {
          id: string,
          mobile: string,
          national_id: string,
          f_name: string,
          l_name: string,
          class: string
        }[] = []
        for (let i = 0; i < res.length; i++) {
          var mobile = ""
          for (let j = 0; j < res[i]['mobile'].length; j++) {
            if (res[i]['mobile'][j]['isMain'])
              mobile += "**" + res[i]['mobile'][j]['mobileNumber'] + "** /"
            else
              mobile += res[i]['mobile'][j]['mobileNumber'] + " /"
          }
          mobile = mobile.substring(0, mobile.length - 2)
          ct.push({
            id: res[i]['id'],
            mobile: mobile,
            national_id: res[i]['nationalId'],
            f_name: res[i]['firstName'],
            l_name: res[i]['lastName'],
            class: res[i]['idcustomerCategory']
          })
        }
        this.customertablevalue = new LocalDataSource(ct)

      },
      err => {
       console.log(err)
      }
    )
  }



  OrderTableAction(event: any) {

  }
  TableAction(event: any) {
    switch (event.action) {
      case "makeorder":
        localStorage.setItem('personID', event.data.id);
        this.customerName = event.data.f_name;
        this.customerFamily = event.data.l_name;
        var token = this.tokencookies.get('T');
        var ot: { id: string, status: string, statusID: string, appliance: string, applianceID: string, date: string, technician: string, technicianID: string, payment: string }[] = [];
        this.api.getcustomerorders(token, event.data.id).subscribe(
          res => {
           // console.log(res)

            ot = [];
            for (let i = 0; i < res.length; i++) {
              var appcat = this.applience.find(item => item.ID == res[i]['applianceBrand']['a_barndCategory'])?.title
              var techfullname = ""
              var techid = ""
              if (res[i]['technician'] != null) {
                techfullname = res[i]['technician']['firstName'] + " " + res[i]['technician']['lastName'];
                techid = res[i]['technician']['id']
              }
              else {
                techfullname = ""
                techid = ""
              }
              ot.push({ id: res[i]['id'], status: res[i]['orderStatus']['status'], statusID: res[i]['orderStatus']['id'], appliance: res[i]['applianceBrand']['brand'] + " " + appcat, applianceID: res[i]['applianceBrand']['ID'], date: res[i]['orderDate'], technician: techfullname, technicianID: techid, payment: "" });
            }
            this.orderstablevalue = new LocalDataSource(ot);
            if (ot.length != 0)
              this.showOrders = true;
            else
              this.showOrders = false;
            this.showOrderDetail = true;
          },
          err => {
           console.log(err)
          }

        )


        break;
      case "viewrecord":

        localStorage.setItem('personID', event.data.id);
        this.customerName = event.data.f_name;
        this.customerFamily = event.data.l_name;
        this.showCustomerDetail = true;
        break;
    }
  }
  addOrder(event: any) {
    this.showorder = false;
   // console.log(event);
  }
  CreateOrder() {
    this.showorder = true;

  }
  CancelOrder() {
    this.showOrderDetail = false;
    this.showorder = false;

  }
  CancelProfile() {
    this.showCustomerDetail = false;
  }
  public signupData!: { mn: string; nationalid: string; name: string; family: string; btn: string; userKind: number; };
  CreateCustomer() {
    const dialogRef = this.signupdialog.open(SignUPCustomerDialog, {
      width: '400px',
      data: { mobilenumber: "" },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "ok") {
        this.signupData = result;
       // console.log(this.signupData)
        this.api.register(this.signupData.mn, this.signupData.name, this.signupData.family, this.signupData.nationalid, 1).subscribe(
          res => {
           // console.log(res)
            this.FillTable();
          },
          err => {
           console.log(err)
            this.openSnackBar('خطا در ارتباط با سرور', '', 'red-snackbar', 5)

          }
        )
      }
    });
  }
  openSnackBar(message: string, action: string, alertkind: string, showtime: number, hp?: MatSnackBarHorizontalPosition, vp?: MatSnackBarVerticalPosition) {
    this._snackBar.open(message, action, {
      duration: showtime * 1000,
      panelClass: [alertkind],
      horizontalPosition: hp,
      verticalPosition: vp

    });
  }
}



@Component({
  selector: 'sign-uP-Dialog',
  templateUrl: 'signupdialog.html',
})
export class SignUPCustomerDialog implements OnInit {
  public alertshow: boolean = false;
  public userkind: string = "null";
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private api: ApiServicesService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SignUPCustomerDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
  form!: FormGroup;
  private formSubmitAttempt!: boolean;
  public isCustomer: boolean = true;
  public usercategory!: { id: string; name: string; }[];
  public uc = 0;
  radioModel: any;
  ngOnInit() {
   // console.log(this.data)

    this.api.GetPersonCategories().subscribe(
      (res: { id: string; name: string; }[]) => {
        this.usercategory.push(res[0]);
        this.usercategory.push(res[1]);
       // console.log(this.usercategory);
      },
      (err: any) => {
       console.log(err)
      }
    )
    this.form = this.fb.group({
      nationalid: [''],    // {5}
      mobilenumber: ['', Validators.required],
      name: ['', Validators.required],
      family: ['', Validators.required]
    });
  }
  selectuserkind(uk: string) {
    this.uc = Number(uk)
  }

  isFieldInvalid(field: string) { // {6}
    return (
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  close() {
    var data: { btn: string } = { btn: "cancel" }
    this.dialogRef.close(data);

  }
  signup(): void {
    var nationalid = this.form.value['nationalid']
    var mobileNumaber = this.form.value['mobilenumber']
    var name = this.form.value['name']
    var family = this.form.value['family']

    var data: { mn: string, nationalid: string, name: string, family: string, btn: string, userKind: number } = { mn: mobileNumaber, nationalid: nationalid, name: name, family: family, btn: "ok", userKind: this.uc }
    this.dialogRef.close(data);

  }

  openSnackBar(message: string, action: string, alertkind: string, showtime: number, hp?: MatSnackBarHorizontalPosition, vp?: MatSnackBarVerticalPosition) {
    this._snackBar.open(message, action, {
      duration: showtime * 1000,
      panelClass: [alertkind],
      horizontalPosition: hp = 'start',
      verticalPosition: vp = 'bottom',
    });
  }
}

