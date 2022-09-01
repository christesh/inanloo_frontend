import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private fb: FormBuilder,) { }
  form!: FormGroup;
  private formSubmitAttempt!: boolean;
  ngOnInit() {
    this.form = this.fb.group({     // {5}
      mobilenumber: ['', Validators.required],
      username: ['', Validators.required]
    });
  }
  isFieldInvalid(field: string) { // {6}
    return (
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
}
