import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ApiServicesService } from 'src/app/api-services.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  brandform: FormGroup = new FormGroup({
    brandname: new FormControl('', Validators.required),
    beanddescription: new FormControl(''),
  }
  )
  formSubmitAttempt: boolean | undefined;
  hasPictuer: boolean;
  createBrandshow: boolean;
  image: File[] = [];
  brandpic: string = ""
  brands:any[]=[];
  constructor(
    private api: ApiServicesService,
    private tokencookie: CookieService,
  ) { }
  imgUrl=environment.PIC_URL;
  editable:boolean=false;
  ngOnInit() {
    this.editable=false
    this.FillPage()
  }
  FillPage() {  
    var token=this.tokencookie.get('T')

    this.api.getallbrands(token).subscribe(
      res=>{
        console.log(res)
        this.brands=res
        for(let i=0;i<res.length;i++){
          this.brands[i]['a_brandImage']=this.imgUrl+this.brands[i]['a_brandImage']
        }
      },
      err=>{
        console.log(err)
      }
    )

  }
  isFieldInvalid(field: string) { // {6}
    return (
      (!this.brandform.get(field)?.valid && this.brandform.get(field)?.touched) ||
      (this.brandform.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  
  brandonSelectFileNew(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        this.image[i] = event.target.files[i]
        reader.onload = (event: any) => {

          this.brandpic = event.target.result;
          // console.log(this.applience[ax].brands)
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  brandonSelectFile(event: any,b:any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        this.image[i] = event.target.files[i]
        reader.onload = (event: any) => {

          this.brandpic = event.target.result;
          // console.log(this.applience[ax].brands)
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  deletebarndimgNew(url: any) {
    if (url != null) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-success'
        },
      })
      swalWithBootstrapButtons.fire({
        title: 'حذف تصویر',
        text: "آیا از حذف تصویر اطمینان دارید؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '!آره, حذفش کن',
        cancelButtonText: 'نه، بی خیال'
      }).then((result) => {
        if (result.isConfirmed) {
          this.brandpic = "";
          this.hasPictuer = false;
          Swal.fire({
            title: 'تصویر ',
            text: '!با موفقیت حذف شد',
            icon: 'success',
            confirmButtonText: '!متوجه شدم',
          }
          )
        }
      })
    }
  }
  deletebarndimg(url: any,b:any) {
    if (url != null) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-success'
        },
      })
      swalWithBootstrapButtons.fire({
        title: 'حذف تصویر',
        text: "آیا از حذف تصویر اطمینان دارید؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '!آره, حذفش کن',
        cancelButtonText: 'نه، بی خیال'
      }).then((result) => {
        if (result.isConfirmed) {
          this.brandpic = "";
          this.hasPictuer = false;
          Swal.fire({
            title: 'تصویر ',
            text: '!با موفقیت حذف شد',
            icon: 'success',
            confirmButtonText: '!متوجه شدم',
          }
          )
        }
      })
    }
  }

  createBrand() {
    this.createBrandshow = true;
  }

  saveNewBrand() {
    // console.log(brand)
    var token = this.tokencookie.get('T');
    var bname = this.brandform.controls['brandname'].value
    var bdes = this.brandform.controls['beanddescription'].value
    this.api.createBrandStandalone(token, bname!, bdes!).subscribe(
      res => {
        // console.log(res)
        this.createBrandshow = false;
        this.FillPage()
      },
      err => {

      }
    )
  }

  cancelNewBrand() {
    this.createBrandshow = false;
  }

  openbarnd(bid:any){

  }
  editBrand(b:any){
    this.editable=true;
  }
  saveBrand(b:any){
    this.editable=false;
  }
  cancelBrand(b:any){
    this.editable=false;
  }
  deleteBrand(b:any){

  }
}
