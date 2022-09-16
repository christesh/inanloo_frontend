import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customerProfile',
  templateUrl: './customerProfile.component.html',
  styleUrls: ['./customerProfile.component.css']
})
export class CustomerProfileComponent implements OnInit {

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
