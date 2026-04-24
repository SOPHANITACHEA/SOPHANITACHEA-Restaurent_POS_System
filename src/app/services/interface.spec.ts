import { TestBed } from '@angular/core/testing';

import { Interface } from './interface';

describe('Interface', () => {
  let service: Interface;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Interface);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
