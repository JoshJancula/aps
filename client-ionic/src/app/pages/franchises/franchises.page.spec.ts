import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchisesPage } from './franchises.page';

describe('FranchisesPage', () => {
  let component: FranchisesPage;
  let fixture: ComponentFixture<FranchisesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FranchisesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FranchisesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
