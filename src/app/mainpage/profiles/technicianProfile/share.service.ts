import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SharedService {
  _foo: number = 0;

  _fooSource: Subject<number> = new Subject();

  get fooSource(): Subject<number> {
    return this._fooSource;
  }

  set fooSource(src: Subject<number>) {
    this._fooSource = src;
  }

  constructor() {}

  changeFoo(n: number) {
    this.fooSource.next(n);
  }
}