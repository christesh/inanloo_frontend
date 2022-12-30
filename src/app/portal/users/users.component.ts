import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CookieService } from 'ngx-cookie-service';
import { ApiServicesService } from 'src/app/api-services.service';
import { DialogData } from '../usermanagement/usermanagement.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  type: string = ""


  customerTable: any;
  customerTablevalue: LocalDataSource;

  orderstablevalue: LocalDataSource;
  ordersTable: any;

  showorder: boolean = false;
  showCustomerDetail: boolean = false;
  showOrderDetail: boolean = false;
  showOrders: boolean = false;

  customerdetailfromstaff: boolean = false;

  public signupData!: { mn: string; nationalid: string; name: string; family: string; btn: string; userKind: number; };
  openAccordion: boolean;
  userId=""
  selectedCustomer:string="";
  profiles:any[]=[]

  constructor(
    private _snackBar: MatSnackBar,
    public signupdialog: MatDialog,
    private api: ApiServicesService,
    private tokencookie: CookieService,
    private _Activatedroute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.customerTable = {
      editable: false,

      pager: {
        display: true,
        perPage: 5
      },
      actions: {
        columnTitle: "عملیات",
        add: false,
        edit: false,
        delete: false,
        // position: 'left',
        custom: [
          { name: 'viewrecord', title: '&nbsp;&nbsp<i class="fa fa-eye"  ></i>' }]
          // { name: 'makeorder', title: '&nbsp;&nbsp;<i class="fa fa-plus-square" ></i>' }]
      },
      columns: {
        mobile: {
          title: "شماره موبایل",
          
        },
        national_id: {
          title: "کد ملی ",
          type:"text"
        },
        f_name: {
          title: "نام "
        },
        l_name: {
          title: "نام خانوادگی "
        },
        orders: {
          title: "تعداد سفارش"
        }
        

      },
      attr: {
        class: "table table-responsive"
      },
      noDataMessage: "هیچ اطلاعاتی یافت نشد"
    };

    this.profiles=[]
    this.FillCustomerTable()
    this.openAccordion=true;
  }

  FillCustomerTable() {
    var token = this.tokencookie.get('T')
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
        this.customerTablevalue = new LocalDataSource(ct)

      },
      err => {
        console.log(err)
      }
    )
  }

  CancelProfile() {
    this.profiles=[]
    this.openAccordion=true;
  }

  CreateCustomer() {
    const dialogRef = this.signupdialog.open(SignUpUserDialog, {
      width: '400px',
      data: { mobilenumber: "" },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "ok") {
        this.signupData = result;

        this.api.register(this.signupData.mn, this.signupData.name, this.signupData.family, this.signupData.nationalid, 1).subscribe(
          res => {
            // console.log(res)
            this.FillCustomerTable();
          },
          err => {
            console.log(err)
            this.openSnackBar('خطا در ارتباط با سرور', '', 'red-snackbar', 5)

          }
        )
      }
    });
  }
 
  TableAction(event: any) {
    switch (event.action) {
      case "viewrecord":
        this.profiles=[]
        this.userId=event.data.id;
        this.showCustomerDetail = false;
        this.selectedCustomer=event.data.f_name +" " +event.data.l_name;
        this.showCustomerDetail = true;
        this.openAccordion=false;
        this.profiles.push( this.userId)
        break;
    }
  }

  //////////////////////error message/////////////////////////////
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
  templateUrl: 'signupuserdialog.html',
})
export class SignUpUserDialog implements OnInit {
  public alertshow: boolean = false;
  public userkind: string = "null";
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private api: ApiServicesService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SignUpUserDialog>,
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