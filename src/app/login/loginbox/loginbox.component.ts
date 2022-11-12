import { Component, OnInit, Output, Input, ElementRef, EventEmitter, ViewChildren, Inject, ViewChild, Directive, ContentChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiServicesService } from '../../api-services.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { GlobalvarService } from 'src/app/globalvar.service';

import { mergeMapTo, mergeMap } from 'rxjs/operators';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from '../../../environments/environment';


export interface DialogData {
  mobilenumber: string;
}
export enum ToggleEnum {
  Option1,
  Option2,
  Option3
}

@Component({
  selector: 'app-loginbox',
  templateUrl: './loginbox.component.html',
  styleUrls: ['./loginbox.component.css'],


})
export class LoginboxComponent implements OnInit {
  @Input() childMessage1: any;
  login: boolean = false;
  loguser = [{ username: 'ad', password: 'ad' }];
  selecteduser: any;
  title = 'otp';
  otpForm: FormGroup;
  formInput = ['input1', 'input2', 'input3', 'input4'];
  @ViewChildren('formRow') rows: any;
  OTPTIME = 10;
  private httpOptions: any;
  public token!: string;
  public token_expires!: Date;
  public username!: string;
  public errors: any = [];

  public otpReSend: boolean = false;
  public loginByUserName: boolean = false;
  public getOtp: boolean = false;
  form = new FormGroup({     // {5}
    mobilenumber: new FormControl('', Validators.required),
    otpcode: new FormControl('', Validators.required)
  })
  userForm = new FormGroup({     // {5}
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  private formSubmitAttempt!: boolean;
  constructor(
    private globalVar: GlobalvarService,
    private fb: FormBuilder,
    private fbuser: FormBuilder,
    private router: Router,
    private api: ApiServicesService,
    private _snackBar: MatSnackBar,
    public signupdialog: MatDialog,
    public tokencookie: CookieService,
    public forgetpassdialog: MatDialog,

  ) {
    this.otpForm = this.toFormGroup(this.formInput);
  }
  toFormGroup(elements: any) {
    const group: any = {};

    elements.forEach((key: string | number) => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }
  keyUpEvent(event: { keyCode: number; which: number; }, index: number) {
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < this.formInput.length) {
      this.rows._results[pos].nativeElement.focus();
    }
  }
  ngOnInit() {
    this.getMobile = true;
    // this.requestPermission();
    this.listen();
  }
  userIsFieldInvalid(field: string) { // {6}
    return (
      (!this.userForm.get(field)?.valid && this.userForm.get(field)?.touched) ||
      (this.userForm.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  isFieldInvalid(field: string) { // {6}
    return (
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  destroy() {
    this.destroy();
  }
  public ca: boolean = false;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  cancel() {
    this.ca = true;
    this.onClose.emit(this.childMessage1);
  }
  public getMobile: boolean = true;
  public errormsg = "";
  public invalidpass: boolean = false;
  public mobileforregister: string | null | undefined;
  ////////////////////
  public signupData!: { mn: string; nationalid: string; name: string; family: string; btn: string; userKind: number; };
  ////////////////////
  EnterByOtp() {
    this.getMobile = true;
    this.getOtp = false;
    this.loginByUserName = false;
  }
  signin() {
    this.mobileforregister = this.form.controls.mobilenumber.value;
    this.login = true;
    this.api.sendsms(this.mobileforregister).subscribe(
      res => {
        console.log(res)
        if (res['result'] == 'mobile number not match') {
          this.form.reset();
          this.openSnackBar('شماره تلفن همراه وارد شده در سیستم ثبت نشده است!', '', 'red-snackbar', 5)
          // this.openSnackBar('it is a test for font-family', '', 'red-snackbar', 5)
          this.signup()
        }
        else {
          this.getMobile = false;
          this.getOtp = true;
          this.loginByUserName = false;
          this.otpWait = this.OTPTIME;
          this.startTimer();
        }

      },
      err => {
        console.log(err)
        this.openSnackBar('خطای ارتباط با سرور!', '', 'red-snackbar', 5)

      }
    )
  }
  signup(): void {
    console.log(this.mobileforregister)
    const dialogRef = this.signupdialog.open(SignUPDialog, {
      width: '400px',
      data: { mobilenumber: this.mobileforregister },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "ok") {
        this.login = false;
        this.signupData = result;
        console.log('The dialog was closed');
        this.api.justsms(result.mn).subscribe(
          res => {
            this.getMobile = false;
            this.getOtp = true;
            this.loginByUserName = false;
            this.otpWait = this.OTPTIME;
            this.startTimer();
          },
          err => {
            console.log(err)
            this.openSnackBar('خطای ارتباط با سرور!', '', 'red-snackbar', 5)
          }
        )
      }
    });
  }
  OtpCheck() {
    var otpArray = [];
    otpArray = this.otpForm.value
    var otp = otpArray['input1'] + "" + otpArray['input2'] + "" + otpArray['input3'] + "" + otpArray['input4']
    this.api.checksms(otp, this.mobileforregister).subscribe(
      res => {
        if (res['result'] == 'success') {
          console.log(this.signupData)
          this.api.register(this.signupData.mn, this.signupData.name, this.signupData.family, this.signupData.nationalid, this.signupData.userKind).subscribe(
            res => {
              this.api.login(this.mobileforregister!).subscribe(
                res => {
                  console.log(res['key'])
                  this.tokencookie.set('T', res['key'])
                  var token = res['key'].toString()
                  this.api.getPersonAuth(token).subscribe(
                    res => {
                      localStorage.setItem('userID', res[0]['person'])
                      if (res[0]['category__name'] == 'مشتری')
                        this.router.navigate(['/home/order'])
                      if (res[0]['category__name'] == 'تکنسین' && res[0]['fillProfile'] == false)
                        this.router.navigate(['/home/profile/technician'])
                      this.openSnackBar('شما با موفقیت وارد شدید!', '', 'green-snackbar', 4)
                      this.requestPermission(res[0]['person'])
                    },
                    err => {
                      console.log(err)
                      this.openSnackBar('خطا در ارتباط با سرور', '', 'red-snackbar', 5)
                    }
                  )

                },
                err => {
                  console.log(err)
                  this.openSnackBar('خطا در ارتباط با سرور', '', 'red-snackbar', 5)
                }
              )
            },
            err => {
              console.log(err)
              this.openSnackBar('خطا در ارتباط با سرور', '', 'red-snackbar', 5)

            }
          )
        }
        else {
          if (res['result'] == 'code does not match') {
            this.otpForm.reset();
            this.openSnackBar('کد وارد شده صحیح  نیست', '', 'red-snackbar', 5)
          }
          else {
            this.tokencookie.set('T', res['result'])
            var token = res['result']
            this.api.getPersonAuth(token).subscribe(
              res => {
                localStorage.setItem('userID', res[0]['person'])
                if (res[0]['category__name'] == 'مشتری')
                  this.router.navigate(['/home/order'])
                if (res[0]['category__name'] == 'تکنسین' && res[0]['fillProfile'] == false)
                  this.router.navigate(['/home/profile/technician'])
                this.openSnackBar('شما با موفقیت وارد شدید!', '', 'green-snackbar', 4)
                this.requestPermission(res[0]['person'])
              },
              err => {
                console.log(err)
                this.openSnackBar('خطا در ارتباط با سرور', '', 'red-snackbar', 5)
              }
            )
          }
        }
      },
      err => {
        this.otpForm.reset();
        this.openSnackBar('خطا در ارتباط با سرور', '', 'red-snackbar', 5)
      }
    )
  }
  OtpReSend() {
    this.otpReSend = false;
    this.otpForm.reset();
    this.openSnackBar('پیامک مجددا ارسال شد!', '', 'green-snackbar', 4)
    this.api.sendsms(this.form.controls.mobilenumber.value).subscribe(
      res => {
        console.log(res)
        if (res['result'] == 'mobile number not match') {
          this.form.reset();
          this.openSnackBar('شماره تلفن همراه وارد شده در سیستم ثبت نشده است!', '', 'red-snackbar', 5)
          this.signup()
        }
        else {
          this.getMobile = false;
          this.getOtp = true;
          this.loginByUserName = false;
          this.otpWait = this.OTPTIME;
          this.startTimer();
        }
      },
      err => { console.log(err) }
    )
  }
  EditMobileNumber() {
    this.getMobile = true;
    this.getOtp = false;
    this.otpReSend = false;
    this.otpForm.reset();
    this.form.reset();
  }
  /////////////////////////
  EnterByUserName() {
    this.getMobile = false;
    this.getOtp = false;
    this.loginByUserName = true;
  }
  usersignin() {
    //check username and password exist in db
    var user = this.userForm.controls.username.value;
    var pass = this.userForm.controls.password.value;
    this.api.loginWithUser(user!, pass!).subscribe(
      res => {
        this.tokencookie.set('T', res['key'])
        var token = res['key'].toString()
        this.api.getPersonAuth(token).subscribe(
          res => {
            localStorage.setItem('staffID', res[0]['person'])
            this.router.navigate(['portal'])
            this.openSnackBar('شما با موفقیت وارد شدید!', '', 'green-snackbar', 4)
            this.requestPermission(res[0]['person'])
          },
          err => {
            console.log(err)
            this.openSnackBar('خطا در ارتباط با سرور', '', 'red-snackbar', 5)
          }
        )
      },
      err => {
        console.log(err)
        this.openSnackBar('خطا در ارتباط با سرور', '', 'red-snackbar', 5)
      }
    )

  }
  forgetpass(): void {
    const dialogRef1 = this.forgetpassdialog.open(ForgetPassDialog, {
      width: '800px',
      data: { mobilenumber: "12313" },
      disableClose: true
    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed');


    });
  }


  interval: string | number | NodeJS.Timeout | undefined;
  public otpWait = 60;
  startTimer() {
    clearInterval(this.interval);
    this.otpWait = this.OTPTIME;
    this.interval = setInterval(() => {
      if (this.otpWait > 1)
        this.otpWait--;
      else {
        this.otpReSend = true;
        this.otpWait = this.OTPTIME;
      }
    }, 1000)
  }
  openSnackBar(message: string, action: string, alertkind: string, showtime: number, hp?: MatSnackBarHorizontalPosition, vp?: MatSnackBarVerticalPosition) {
    this._snackBar.open(message, action, {
      duration: showtime * 1000,
      panelClass: [alertkind],
      horizontalPosition: hp,
      verticalPosition: vp

    });
  }
  FCMtoken: any;
  requestPermission(id: string) {

    const messaging = getMessaging();

    getToken(messaging, { vapidKey: environment.firebaseConfig.vapidKey }).then((currentToken) => {
      if (currentToken) {
        console.log("Hurraaa!!! we got the token.....")
        console.log(currentToken);
        var token = this.tokencookie.get('T');
        console.log(token);
        this.api.createFCMdevice(token, currentToken, id).subscribe(
          res => {
            console.log(res)
          },
          err => {
            this.openSnackBar(err, '', 'red-snackbar', 5)
          }
        )
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });

  }
  message: any = null;
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message = payload;
      this.openSnackBar(this.message.notification.title, '', 'red-snackbar', 5)
    });
  }
  //   // console.log(navigator.serviceWorker.getRegistrations)
  //   // navigator.serviceWorker.register("firebase-messaging-sw.js")
  //   // console.log(navigator.serviceWorker.getRegistrations)
  //   this.afMessaging.requestPermission
  //     .pipe(
  //       mergeMapTo(this.afMessaging.tokenChanges)
  //       )
  //     .subscribe(
  //       (token) => { console.log('Permission granted! Save to the server!', token); this.FCMtoken = token },
  //       (error) => { console.error(error); },
  //     );
  // }
  // deleteToken() {
  //   this.afMessaging.getToken
  //     .pipe(mergeMap(token => this.afMessaging.deleteToken(this.token)))
  //     .subscribe(
  //       (token) => { console.log('Token deleted!'); },
  //     );
  // }
  // listen() {
  //   this.afMessaging.messages
  //     .subscribe((message) => { console.log(message); });
  // }
}


/////////////signup dialog//////////////

@Component({
  selector: 'sign-uP-Dialog',
  templateUrl: 'signupdialog.html',
})
export class SignUPDialog implements OnInit {
  public alertshow: boolean = false;
  public userkind: string = "null";
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private api: ApiServicesService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SignUPDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
  form!: FormGroup;
  private formSubmitAttempt!: boolean;
  public isCustomer: boolean = true;
  public usercategory: { id: string; name: string; }[] = [];
  public uc = 0;
  radioModel: any;
  ngOnInit() {
    console.log(this.data)
    this.form = this.fb.group({
      nationalid: [''],    // {5}
      mobilenumber: [this.data.mobilenumber, Validators.required],
      name: ['', Validators.required],
      family: ['', Validators.required]
    });
    this.api.GetPersonCategories().subscribe(
      (res) => {
        console.log(res)
        for (let i = 0; i < res.length; i++) {
          if (res[i]['name'] == 'مشتری' || res[i]['name'] == 'تکنسین')
            this.usercategory.push(res[i]);
        }

        console.log(this.usercategory);
      },
      (err: any) => {
        console.log(err)
      }
    )

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
    if (this.uc == 0) {
      this.alertshow = true;
    }
    else {
      var data: { mn: string, nationalid: string, name: string, family: string, btn: string, userKind: number } = { mn: mobileNumaber, nationalid: nationalid, name: name, family: family, btn: "ok", userKind: this.uc }
      this.dialogRef.close(data);
    }
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

/////////////forgetpassword dialog//////////////

@Component({
  selector: 'forget-pass-Dialog',
  templateUrl: 'forgetpassword.html',
})
export class ForgetPassDialog implements OnInit {
  constructor(
    private api: ApiServicesService,
    private tokencookie: CookieService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ForgetPassDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
  form = this.fb.group({     // {5}
    mobilenumber: ['', Validators.required],
    username: ['', Validators.required]
  });

  public getmobile: boolean = false
  public getsms: boolean = false
  public changepass: boolean = false
  public errbox: boolean = false
  public token_parts = ""
  public user = ""
  public mobile = ""
  public smscode = ""
  public pass1 = ""
  public pass2 = ""
  public recivesms = ""
  public errmsg = ""
  public showpass: boolean = false
  public passok: boolean = false
  private formSubmitAttempt!: boolean;
  signin: FormGroup = new FormGroup({

    password: new FormControl('', [Validators.required, Validators.min(3)])
  });
  hide = true;

  ngOnInit() {
    this.token_parts = this.tokencookie.get('T');
    this.getmobile = true;
    this.getsms = false
    this.changepass = false
    this.errbox = false
    this.showpass = false
    this.passok = false;
  }
  isFieldInvalid(field: string) { // {6}
    return (
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  close() {
    this.dialogRef.close();
  }
  showpass1() {
    this.showpass != this.showpass
  }

  sendsms() {
    this.user = this.form.controls.username.value!
    this.api.ForgetSendSms(this.mobile, this.user).subscribe(
      res => {
        console.log(res)
        if (res['result'] == 'mobile number not match') {
          this.form.reset();
          this.openSnackBar('شماره تلفن همراه وارد شده در سیستم ثبت نشده است!', '', 'red-snackbar', 5)
          this.errmsg = res['result']
          this.errbox = true
        }
        else {
          this.passok = false;
          this.errbox = false
          this.getsms = true
          this.getmobile = false
          this.changepass = false
        }
      },
      err => {
        console.log(err)
      }
    )
  }
  openSnackBar(message: string, action: string, alertkind: string, showtime: number, hp?: MatSnackBarHorizontalPosition, vp?: MatSnackBarVerticalPosition) {
    this._snackBar.open(message, action, {
      duration: showtime * 1000,
      panelClass: [alertkind],
      horizontalPosition: hp,
      verticalPosition: vp

    });
  }
  checksms() {
    console.log(this.user, this.mobile, this.smscode)
    this.api.checksms(this.smscode, this.mobile).subscribe(
      res => {
        console.log(res)
        if (res['result'] != 'success') {
          this.errmsg = res['result']
          this.errbox = true
        }
        else {
          this.passok = false;
          this.errbox = false
          this.getsms = false
          this.getmobile = false
          this.changepass = true
        }
      },
      err => {
        console.log(err)
      }
    )
  }

  changepass1() {
    this.user = this.form.controls.username.value!
    if (this.pass1 == this.pass2) {
      this.api.changepass(this.user, this.pass1).subscribe(
        res => {
          console.log(res['result'])
          this.passok = true;
          this.errbox = false
          this.getsms = false
          this.getmobile = false
          this.changepass = false
        },
        err => {
          console.log(err)
        }
      )
    }
    else {
      this.errbox = true
      this.errmsg = "تکرار گذرواژه با گذرواژه وارد شده تطابق ندارد!"
    }
  }
}

