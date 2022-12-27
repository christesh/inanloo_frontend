/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StafforderComponent } from './stafforder.component';

describe('StafforderComponent', () => {
  let component: StafforderComponent;
  let fixture: ComponentFixture<StafforderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StafforderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StafforderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
