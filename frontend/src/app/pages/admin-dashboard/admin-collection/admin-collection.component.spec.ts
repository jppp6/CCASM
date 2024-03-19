import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCollectionComponent } from './admin-collection.component';

describe('AdminCollectionComponent', () => {
  let component: AdminCollectionComponent;
  let fixture: ComponentFixture<AdminCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCollectionComponent]
    });
    fixture = TestBed.createComponent(AdminCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
