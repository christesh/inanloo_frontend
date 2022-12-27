import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiServicesService } from 'src/app/api-services.service';
import * as moment from 'jalali-moment';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  sKind: any;
  orderID: string;
  appCat: string;

  constructor(
    private api: ApiServicesService,
    private tokencookie: CookieService,
    private router: Router,
    private _Activatedroute: ActivatedRoute,
  ) { }
  boroodati = ['1', '4', '6', '9', '12']
  surveyform = new FormGroup({
    cost: new FormControl('', Validators.required),
  });
  answer: any[] = []
  questions: any[] = []
  select: any[][] = []
  readonly: boolean = false
  ngOnInit() {
    this.questions = []
    var token = this.tokencookie.get('T')
    this.orderID = this._Activatedroute.snapshot.paramMap.get("orderID")!
    this.sKind = this._Activatedroute.snapshot.paramMap.get("sKind")!
    this.sKind = this.sKind.split(',')
    this.appCat = this._Activatedroute.snapshot.paramMap.get("appCat")!
    var result = this._Activatedroute.snapshot.paramMap.get("result")!
    if (result == "مشاهده نظرسنجی") {
      this.readonly = true;
      this.api.getordersurvey(token, this.orderID).subscribe(
        res => {
         // console.log(res)
          this.answer = []
          for (let i = 0; i < res.length; i++) {
            this.questions.push(res[i].question)
            if (res[i].question.optionKind == '0') {
              this.answer.push(res[i].answer)
            }
            else {
              this.surveyform.controls.cost.patchValue(res[i].answerText)
              this.answer.push(res[i].answer)
              this.surveyform.controls.cost.markAsDirty()
            }

          }
        },
        err => {
         console.log(err)
        })
    }
    else {
     // console.log(this.sKind)
      this.readonly = false;
      var idx = -1;
      idx = this.sKind.findIndex((item: any) => item == '2')
      var skind = ""
      if (idx != 1)
        skind = "2"
      else {
        var idx1 = this.boroodati.findIndex(item => item == this.appCat)
        if (idx1 != -1)
          skind = "0"
        else
          skind = "1"
      }
      this.api.getsurveyquestions(token, skind).subscribe(
        res => {
         // console.log(res)
          this.questions = res
        },
        err => {
         console.log(err)
        }
      )
    }
  }
  isFieldInvalid(field: string) { // {6}
    return (
      (!this.surveyform.get(field)?.valid && this.surveyform.get(field)?.touched) ||
      (this.surveyform.get(field)?.untouched && this.surveyform)
    );
  }
  optionselect(op: any) {

  }
  save() {
    var qa: { orderID: string, questionID: string, answerID: string, answerText: string }[] = []
   // console.log(this.answer)
    for (let i = 0; i < this.questions.length; i++) {
      var ans = ""
      if (this.questions[i].optionKind == "2") {
        ans = this.surveyform.controls.cost.value!.toString()
        this.answer[i] = this.questions[i].options[0].id
      }
      qa.push({ orderID: this.orderID, questionID: this.questions[i].id, answerID: this.answer[i], answerText: ans })
    }
    var token = this.tokencookie.get('T')
   // console.log(qa)
    this.api.savesurvey(token, qa).subscribe(
      res => {
       // console.log(res)
        this.router.navigate(['/home/orderDetails', { orderID: this.orderID }]);
      },
      err => {
       console.log(err)
      }
    )
  }
  cancel() {
    this.router.navigate(['/home/orderDetails', { orderID: this.orderID }]);

  }
}
