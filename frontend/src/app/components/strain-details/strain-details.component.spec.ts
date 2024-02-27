import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrainDetailsDialog } from './strain-details.component';

describe('StrainDetailsDialog', () => {
  let component: StrainDetailsDialog;
  let fixture: ComponentFixture<StrainDetailsDialog>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrainDetailsDialog],
    });
    fixture = TestBed.createComponent(StrainDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
