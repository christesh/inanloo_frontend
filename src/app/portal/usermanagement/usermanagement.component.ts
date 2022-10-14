import { Component, OnInit, Output, Input, ElementRef, EventEmitter, ViewChildren, Inject, ViewChild, Directive, ContentChild } from '@angular/core';
import { ApiServicesService } from 'src/app/api-services.service';
import { CookieService } from 'ngx-cookie-service';
import { CompanyMembers } from 'src/app/mainpage/profiles/profile';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
export interface DialogData {
  userdata: { id: string, firstname: string, lastname: string, nationaid: string, mobile: string, kind: string };
}
@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css']
})
export class UsermanagementComponent implements OnInit {
  constructor(
    public createUser: MatDialog,
    private api: ApiServicesService,
    private modalService: NgbModal,
    private tokencookie: CookieService,
  ) { }
  token: string;
  allCompanymembers: CompanyMembers[] = [];

  companyMembertablevalue: LocalDataSource;
  companyMembersTable: any;
  ngOnInit() {
    this.companyMembersTable = {
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
          { name: 'viewrecord', title: '<i class="fa fa-eye" ></i>' },
          { name: 'editrecord', title: '&nbsp;&nbsp;<i class="fa  fa-pencil" ></i>' },
          { name: 'deleterecord', title: '&nbsp;&nbsp;<i class="fa  fa-trash" ></i>' }]
      },
      columns: {
        national_id: {
          title: "کد ملی "
        },
        f_name: {
          title: "نام "
        },
        l_name: {
          title: "نام خانوادگی "
        },
        mobile: {
          title: "شماره موبایل"
        },
        group: {
          title: "سطح کاربری"
        },

      },
      attr: {
        class: "table table-responsive"
      },
      noDataMessage: "هیچ اطلاعاتی یافت نشد"
    };
    this.FillTable();
  }
  FillTable() {
    this.token = this.tokencookie.get('T');
    this.api.getAllCompanyMembers(this.token).subscribe(
      res => {
        // this.allCompanymembers = res;
        console.log(res)
        var t: { id: string, national_id: string, f_name: string, l_name: string, mobile: string, group: string, group_id: number }[] = []
        console.log(res[0]['mobile'][0]['mobileNumber']);
        for (let i = 0; i < res.length; i++) {
          try {
            t.push({ id: res[i]['id'], f_name: res[i]['firstName'], l_name: res[i]['lastName'], national_id: res[i]['nationalId'], mobile: res[i]['mobile'][0]['mobileNumber'], group: res[i]['membersGroup']['group'], group_id: res[i]['membersGroup']['id'] });
          } catch { }
        }
        this.companyMembertablevalue = new LocalDataSource(t);
        console.log(this.companyMembertablevalue)
      },
      err => {
        console.log(err)
      }
    )
  }

  regclaim(event: any) {
    switch (event.action) {
      case 'viewrecord':

        break;
      case 'editrecord':
        console.log(event)
        var data = { id: event.data.id, firstname: event.data.f_name, lastname: event.data.l_name, nationaid: event.data.national_id, mobile: event.data.mobile, kind: 'edit' };
        const dialogRef = this.createUser.open(CreateUserDialog, {
          width: '700px',
          data: { userdata: data },
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.btn == "save") {
            this.FillTable();

          }
        });
        break;
      case 'deleterecord':
        var name = event.data.f_name + " " + event.data.l_name
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-success'
          },

        })
        swalWithBootstrapButtons.fire({
          title: 'حذف کاربر',
          text: "آیا از حذف " + name + " اطمینان دارید؟",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '!آره, حذفش کن',
          cancelButtonText: 'نه، بی خیال'
        }).then((result) => {
          if (result.isConfirmed) {
            this.api.deleteCompanyMember(this.token, event.data.id).subscribe(
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


        break;
    }
  }

  createuser() {
    var data = { firstname: "masih", lastname: "ebi", nationaid: "123123213", mobile: "123123", kind: 'create' };
    const dialogRef = this.createUser.open(CreateUserDialog, {
      width: '700px',
      data: { userdata: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save") {
        this.FillTable();
      }
    });
  }
}



@Component({
  selector: 'sign-uP-Dialog',
  templateUrl: 'createUser.html',
})
export class CreateUserDialog implements OnInit {
  form = new FormGroup({     // {5}
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    nationalid: new FormControl('', Validators.required),
    mobilenumber: new FormControl('', Validators.required),
    selectedgroup: new FormControl('', Validators.required),
  })
  private formSubmitAttempt!: boolean;
  constructor(
    private api: ApiServicesService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private tokencookie: CookieService,
  ) { }
  memberGroup: { id: string, group: string,description:string ,permissions:{id:number,title:string,active:string,description:string} }[] = []
  ngOnInit(): void {
    console.log(this.data);
    var token = this.tokencookie.get('T')
    if (this.data.userdata.kind == "edit") {
      this.form.controls.firstname.patchValue(this.data.userdata.firstname);
      this.form.controls.firstname.markAsDirty();
      this.form.controls.lastname.patchValue(this.data.userdata.lastname);
      this.form.controls.lastname.markAsDirty();
      this.form.controls.nationalid.patchValue(this.data.userdata.nationaid);
      this.form.controls.nationalid.markAsDirty();
      this.form.controls.mobilenumber.patchValue(this.data.userdata.mobile);
      this.form.controls.mobilenumber.markAsDirty();
    }
    this.api.getAllMemberGroup(token).subscribe(
      res => {
        console.log(res)
        this.memberGroup = res;
      },
      err => {
        console.log(err)
      }
    )

  }
  isFieldInvalid(field: string) { // {6}
    return (
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  signup() {
    if (this.data.userdata.kind == "create") {
      var token = this.tokencookie.get('T')
      var nationalid = this.form.controls.nationalid.value?.toString();
      var pass = this.form.controls.mobilenumber.value?.toString();
      var fname = this.form.controls.firstname.value?.toString();
      var lname = this.form.controls.lastname.value?.toString();
      var group = this.form.controls.selectedgroup.value?.toString();
      var mobile = this.form.controls.mobilenumber.value!.toString();
      var usercategory = 3;
      this.api.registerCompanyMember(token, nationalid!, pass!, fname!, lname!, nationalid!, group!, usercategory, mobile!).subscribe(
        res => {
          console.log(res)
          var data: { btn: string } = { btn: "save" }
          Swal.fire({
            title: 'ایجاد کاربر جدید',
            text: '!با موفقیت انجام شد',
            icon: 'success',
            confirmButtonText: '!متوجه شدم',
          }
          )
          this.dialogRef.close(data);
        },
        err => {
          console.log(err)
        }
      )
    }
    else {
      if (this.data.userdata.kind == "edit") {
        var userid = this.data.userdata.id;
        var token = this.tokencookie.get('T');
        var nationalid = this.form.controls.nationalid.value?.toString();
        var pass = this.form.controls.mobilenumber.value?.toString();
        var fname = this.form.controls.firstname.value?.toString();
        var lname = this.form.controls.lastname.value?.toString();
        var group = this.form.controls.selectedgroup.value?.toString();
        var mobile = this.form.controls.mobilenumber.value!.toString();

        this.api.editCompanyMember(token, userid!, fname!, lname!, nationalid!, group!, mobile!).subscribe(
          res => {
            console.log(res)
            var data: { btn: string } = { btn: "save" }
            this.dialogRef.close(data);
          },
          err => {
            console.log(err)
          }
        )
      }
    }
  }
  close() {
    var data: { btn: string } = { btn: "cancel" }
    this.dialogRef.close(data);
  }
  groupselect() {
    console.log(this.form.controls.selectedgroup.value)
  }
}