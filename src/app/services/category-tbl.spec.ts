import { TestBed } from '@angular/core/testing';

import { CategoryTbl } from './category-tbl';

describe('CategoryTbl', () => {
  let service: CategoryTbl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryTbl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
