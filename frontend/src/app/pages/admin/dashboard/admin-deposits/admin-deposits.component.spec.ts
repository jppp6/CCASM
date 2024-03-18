import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDepositsComponent } from './admin-deposits.component';

describe('AdminDepositsComponent', () => {
  let component: AdminDepositsComponent;
  let fixture: ComponentFixture<AdminDepositsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDepositsComponent]
    });
    fixture = TestBed.createComponent(AdminDepositsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
