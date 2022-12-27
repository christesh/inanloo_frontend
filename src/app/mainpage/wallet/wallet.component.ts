import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  transactionTablevalue: LocalDataSource;
  transactionTableSetting: any;
  constructor() { }
  showbanner:boolean=true;
  ngOnInit() {
    this.transactionTableSetting = {
      editable: true,
      pager: {
        display: true,
        perPage: 20
      },
      actions: {
        columnTitle: "جزئیات",
        add: false,
        edit: false,
        delete: false,
        position: 'left',
        custom: [
          { name: 'viewrecord', title: '<i class="fa fa-eye"  ></i>' },
        ]

      },
      columns: {
        date: {
          title: "تاریخ تراکنش",
          editable: false
        },
        kind: {
          title: "نوع تراکنش",
          editable: false
        },
        payment: {
          title: "مبلغ",
          editable: false
        },
        orderno: {
          title: "سفارش",
          editable: false
        },

        balance: {
          title: "موجودی",
          editable: false

        },
      },
      attr: {
        class: "table table-responsive"
      },

      noDataMessage: "هیچ اطلاعاتی یافت نشد"
    };
  }
  wallet = new FormGroup({
    price: new FormControl('', Validators.required),
  });
  bankBalance:string="123000000"
  balancestatus:string="positive"
  isFieldInvalid(field: string) { // {6}
    return (
      (!this.wallet.get(field)?.valid && this.wallet.get(field)?.touched) ||
      (this.wallet.get(field)?.untouched && this.wallet)
    );
  }
  payment()
  {

  }
  transactionAction(event:any){

  }
}
