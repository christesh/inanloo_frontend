import { Component, OnInit, Inject } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiServicesService } from 'src/app/api-services.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
export interface DialogData {
  userdata: { id: string, group: string, permissions: string,permissionsid: number[], kind: string };
}
@Component({
  selector: 'app-usergroup',
  templateUrl: './usergroup.component.html',
  styleUrls: ['./usergroup.component.css']
})
export class UsergroupComponent implements OnInit {
  memberGroup: { id: string, group: string, description: string, permissions: { id: number, title: string, active: string, description: string } }[] = []
  userGrouptablevalue: LocalDataSource;
  userGroupTable: any;
  constructor(
    public createUser: MatDialog,
    private api: ApiServicesService,
    private modalService: NgbModal,
    private tokencookie: CookieService,
  ) { }

  ngOnInit() {
    this.userGroupTable = {
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
          title: "عنوان گروه"
        },
        permissions: {
          title: "سطوح دسترسی"
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
    var token = this.tokencookie.get('T')
    this.api.getAllMemberGroup(token).subscribe(
      res => {
        console.log(res)
        this.memberGroup = res;
        var tv = []
        for (let i = 0; i < res.length; i++) {
          var per = "";
          var perid = [];
          for (let j = 0; j < res[i]['permissions'].length; j++) {
            if (res[i]['permissions'][j]['active'])
              per += res[i]['permissions'][j]['title'] + " / "
              perid.push(Number( res[i]['permissions'][j]['id'] ));
          }
          per = per.substring(0, per.length - 3)
         
          tv.push({id:res[i]['id'], title: res[i]['group'], permissions: per ,permissionsid:perid})
        }
        this.userGrouptablevalue = new LocalDataSource(tv);
      },
      err => {
        console.log(err)
      }
    )
  }
  createusergroup() {
    var data = { id: "", group: "", permissions: "", kind: "create" }
    const dialogRef = this.createUser.open(CreateUserGroupDialog, {
      width: '700px',
      height: 'auto',
      data: { userdata: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save") {
        this.FillTable();
      }
    });
  }

  regclaim(event: any) {
    console.log(event)
    switch (event.action) {
      case 'deleterecord':
        var name = event.data.title
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-success'
          },

        })
        swalWithBootstrapButtons.fire({
          title: 'حذف گروه کاربری',
          text: "آیا از حذف گروه گاربری «" + name + "» اطمینان دارید؟",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '!آره, حذفش کن',
          cancelButtonText: 'نه، بی خیال'
        }).then((result) => {
          if (result.isConfirmed) {
            var token=this.tokencookie.get('T')
            this.api.deleteMembersGroup(token, event.data.id).subscribe(
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
      case 'editrecord':
        var data = { id: event.data.id, group: event.data.title, permissions: event.data.permissionsid, kind: "edit" }
        const dialogRef = this.createUser.open(CreateUserGroupDialog, {
          width: '700px',
          height: 'auto',
          data: { userdata: data },
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.btn == "save") {
            this.FillTable();
          }
        });
        break;
    }
  }
}

@Component({
  selector: 'user-group-Dialog',
  templateUrl: 'createUserGroup.html',
  styleUrls: ['./usergroup.component.css']
})
export class CreateUserGroupDialog implements OnInit {
  form = new FormGroup({
    groupName: new FormControl('', Validators.required),
  })
  private formSubmitAttempt!: boolean;
  selectedGroup: any;
  permissions: { id: string, title: string, active: boolean, description: string }[] = []
  constructor(
    private api: ApiServicesService,
    private modalService: NgbModal,
    private tokencookie: CookieService,
    public dialogRef: MatDialogRef<CreateUserGroupDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  ngOnInit() {
   console.log(this.data.userdata)
    if (this.data.userdata.kind == "edit") {
      this.form.controls.groupName.patchValue(this.data.userdata.group);
      this.form.controls.groupName.markAsDirty();
      this.selectedGroup=this.data.userdata.permissions;
    }
    var token = this.tokencookie.get('T')
    this.api.getAllPermissions(token).subscribe(
      res => {
        this.permissions = res
      },
      err => {
        console.log(err)
      }
    )

  }
  getValues(sg: any) {
    console.log(sg)
  }
  create() {
    if (this.data.userdata.kind == "create") {
      var token = this.tokencookie.get('T')
      var groupName = this.form.controls.groupName.value?.toString();
      var permissions = this.selectedGroup
      console.log(permissions)
      this.api.createMemberGroup(token, groupName!, permissions).subscribe(
        res => {
          console.log(res)
          var data: { btn: string } = { btn: "save" }
          Swal.fire({
            title: 'ایجاد گروه کاربری جدید',
            text: '!با موفقیت حذف شد',
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
        var groupid = this.data.userdata.id;
        var token = this.tokencookie.get('T');
        var groupName = this.form.controls.groupName.value?.toString();
        var permissions = this.selectedGroup
        this.api.editMemberGroup(token, groupid, groupName!, permissions).subscribe(
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
}