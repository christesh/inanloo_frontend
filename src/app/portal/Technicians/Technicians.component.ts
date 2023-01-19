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
  selector: 'app-Technicians',
  templateUrl: './Technicians.component.html',
  styleUrls: ['./Technicians.component.css']
})
export class TechniciansComponent implements OnInit {



  techincianTable: any;
  technicianTablevalue: LocalDataSource;

  orderstablevalue: LocalDataSource;
  ordersTable: any;

  showorder: boolean = false;
  showTechDetail: boolean = false;
  showOrderDetail: boolean = false;
  showOrders: boolean = false;

  Techdetailfromstaff: boolean = false;
  openAccordion: boolean = true;
  selectedtechnician: string = "";
  profiles: any[] = []
  public signupData!: { mn: string; nationalid: string; name: string; family: string; btn: string; userKind: number; };
  userId: any;
  showCustomerDetail: boolean;
  
  usercat:string="";
  constructor(
    private _snackBar: MatSnackBar,
    public signupdialog: MatDialog,
    private api: ApiServicesService,
    private tokencookie: CookieService,
    private _Activatedroute: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.techincianTable = {
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
        ]
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
        orders: {
          title: "کل سفارش"
        },
        complete:{
          title: " سفارشات تکمیل"
        }


      },
      attr: {
        class: "table table-responsive"
      },
      noDataMessage: "هیچ اطلاعاتی یافت نشد"
    };
    this.FillTechnicianTable()
  }



  FillTechnicianTable() {
    var token = this.tokencookie.get('T')
    this.api.getalltechniciandetails(token).subscribe(
      res => {
        // console.log(res)
        var ct: {
          id: string,
          mobile: string,
          national_id: string,
          f_name: string,
          l_name: string,
          orders: string,
          complete:string
        }[] = []
        for (let i = 0; i < res.length; i++) {
          var mobile = ""
          // for (let j = 0; j < res[i]['mobile'].length; j++) {
          //   if (res[i]['mobile'][j]['isMain'])
          //     mobile += "**" + res[i]['mobile'][j]['mobileNumber'] + "** /"
          //   else
          //     mobile += res[i]['mobile'][j]['mobileNumber'] + " /"
          // }
          mobile = res[i]['mobileNumber']
          ct.push({
            id: res[i]['id'],
            mobile: mobile,
            national_id: res[i]['nationalId'],
            f_name: res[i]['firstName'],
            l_name: res[i]['lastName'],
            orders: res[i]['allOrders'],
            complete:res[i]['completed']
          })
        }
        this.technicianTablevalue = new LocalDataSource(ct)

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

  CreateTech() {
    const dialogRef = this.signupdialog.open(SignUpTechDialog, {
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
            this.FillTechnicianTable();
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
        this.profiles = []
        this.userId = event.data.id;
        this.usercat="تکنسین"
        this.selectedtechnician = event.data.f_name + " " + event.data.l_name;
        this.openAccordion = false;
        this.profiles.push(this.userId)
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
  templateUrl: 'signuptechdialog.html',
})
export class SignUpTechDialog implements OnInit {
  public alertshow: boolean = false;
  public userkind: string = "null";
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private api: ApiServicesService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SignUpTechDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
  form!: FormGroup;
  private formSubmitAttempt!: boolean;
  public isTech: boolean = true;
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