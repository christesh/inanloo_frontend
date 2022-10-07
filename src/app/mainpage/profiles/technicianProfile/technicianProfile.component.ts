import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-technicianProfile',
  templateUrl: './technicianProfile.component.html',
  styleUrls: ['./technicianProfile.component.css']
})
export class TechnicianProfileComponent {
  emailFormControl = new FormControl('');

  matcher = new MyErrorStateMatcher();
  constructor() { }
  name: string = ""
  ngOnInit() {
    this.emailFormControl.patchValue("masih@asd.com")
    this.emailFormControl.markAsDirty();
  }
  change() {
    this.emailFormControl.patchValue("masidasdasdh@asd.com")
  }


}
