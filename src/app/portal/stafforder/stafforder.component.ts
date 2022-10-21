import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CookieService } from 'ngx-cookie-service';
import { ApiServicesService } from 'src/app/api-services.service';

@Component({
  selector: 'app-stafforder',
  templateUrl: './stafforder.component.html',
  styleUrls: ['./stafforder.component.scss']
})
export class StafforderComponent implements OnInit {
  searchText = ""
  customerdetailfromstaff:boolean=false;
  constructor(
    private api: ApiServicesService,
    private tokencookies: CookieService,
  ) { }
  customertablevalue: LocalDataSource;
  customerTable: any;
  orderstablevalue: LocalDataSource;
  ordersTable: any;
  showorder: boolean = false;
  showCustomerDetail: boolean = false;
  showOrders: boolean = false;
  customerName = "";
  customerFamily = "";
  ngOnInit() {
    this.customerdetailfromstaff=false;
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
          { name: 'editrecord', title: '&nbsp;&nbsp;<i class="fa  fa-pencil" style="color:grean" ></i>' },
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
  FillTable() {
    var token = this.tokencookies.get('T')
    this.api.getallcustomersdetails(token).subscribe(
      res => {
        console.log(res)
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
  CreateCustomer() {

  }
  TableAction(event: any) {
    switch (event.action) {
      case "makeorder":
        localStorage.setItem('userID', event.data.id);
        this.customerName = event.data.f_name;
        this.customerFamily = event.data.l_name;

        var ot: { id: string, status: string, statusID: string, appliance: string, applianceID: string, date: string, technician: string, technicianID: string, payment: string }[] = [];
        ot.push({ id: '1', status: "اتمام", statusID: '1', appliance: "یخچال سامسونگ", applianceID: "1", date: "1401/07/04", technician: "حسین رامشینی", technicianID: "1", payment: "10000000" });
        ot.push({ id: '2', status: "منتظر قطعه", statusID: '1', appliance: "ظرفشویی سامسونگ", applianceID: "1", date: "1401/03/16", technician: "علی محمدی", technicianID: "1", payment: "15000000" });
        this.orderstablevalue = new LocalDataSource(ot);
        if (ot.length != 0)
          this.showOrders = true;
        else
          this.showOrders = false;
        this.showCustomerDetail = true;
        break;
    }
  }
  addOrder(event: any) {
    this.showorder = false;
    console.log(event);
  }
  CreateOrder() {
    this.showorder = true;

  }

}
