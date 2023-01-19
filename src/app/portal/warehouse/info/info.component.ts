import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  wareHouseTable: any;
  wareHouseTableValue: LocalDataSource;
  UsersTabel: any;
  UsersTabelValue: LocalDataSource;
  openAccordion: boolean = true;
  users: { id: string, fullname: string, status: string; view: boolean, input: boolean, output: boolean }[] = []
  warehouseTableData: { id: string, fullname: string, view: boolean, input: boolean, output: boolean }[] = []
  userSelected: any;
  newwarehouse: boolean = false;
  viewwarehouse: boolean = false;
  warehousetableeditable: boolean = false;
  displayedColumns: string[];

  wareHouseForm = new FormGroup({     // {5}
    name: new FormControl('', Validators.required),
    kind: new FormControl('', Validators.required),
    description: new FormControl('')
  })

  warehousekinds: { id: string, title: string }[] = []
  formSubmitAttempt: boolean | undefined;


  constructor() { }

  ngOnInit() {
    this.wareHouseTable = {
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
        title: {
          title: "نام انبار"
        },
        date: {
          title: "تاریخ ایجاد"
        },
        type: {
          title: "نوع انبار"
        },
        status: {
          title: "وضعیت"
        },
        userCount: {
          title: "تعداد کاربر"
        },
      },
      attr: {
        class: "table table-responsive"
      },
      noDataMessage: "هیچ اطلاعاتی یافت نشد"
    };
    this.displayedColumns = ['fullname', 'status', 'view', 'input', 'output'];
    this.FillTable()

  }
  FillTable() {

  }
  TableAction(event: any) {
    switch (event.action) {
      case 'viewrecord':
        this.viewwarehouse = true;
        this.newwarehouse = false;
        break;
    }
  }
  CreateWarehouse() {
    this.openAccordion=false;
    this.viewwarehouse = false;
    this.wareHouseForm.controls['name'].markAsDirty()
    this.wareHouseForm.controls['kind'].markAsDirty()
    this.wareHouseForm.controls['description'].markAsDirty()
    this.newwarehouse = true;
    
    console.log(this.UsersTabelValue)
  }
  CancelnewWH(){
    this.openAccordion=true;
    this.viewwarehouse = false;
    this.wareHouseForm.controls['name'].patchValue("")
    this.wareHouseForm.controls['name'].markAsDirty()
    this.wareHouseForm.controls['kind'].patchValue("")
    this.wareHouseForm.controls['kind'].markAsDirty()
    this.wareHouseForm.controls['description'].patchValue("")
    this.wareHouseForm.controls['description'].markAsDirty()
    this.newwarehouse = false;
  }
  isFieldInvalid(field: string) { // {6}
    return (
      (!this.wareHouseForm.get(field)?.valid && this.wareHouseForm.get(field)?.touched) ||
      (this.wareHouseForm.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  UsersAction(event: any) {

  }
  AddUser() {

  }
  SaveUser() {

  }
  CancelUser() {


  }
  EditWareHouse() {

  }
}
