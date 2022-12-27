/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GlobalvarService } from './globalvar.service';

describe('Service: Globalvar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalvarService]
    });
  });

  it('should ...', inject([GlobalvarService], (service: GlobalvarService) => {
    expect(service).toBeTruthy();
  }));
});
