import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsComponent } from './terms.component';

<<<<<<<< HEAD:frontend/src/app/pages/cart/terms/terms.component.spec.ts
describe('TermsComponent', () => {
  let component: TermsComponent;
  let fixture: ComponentFixture<TermsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermsComponent]
    });
    fixture = TestBed.createComponent(TermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
========
describe('AdminComponent', () => {
    let component: AdminComponent;
    let fixture: ComponentFixture<AdminComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AdminComponent],
        });
        fixture = TestBed.createComponent(AdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
>>>>>>>> backend_routes:frontend/src/app/pages/admin/admin.component.spec.ts

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
