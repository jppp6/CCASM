import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditComponent } from './admin-edit.component';

describe('AdminEditComponent', () => {
    let component: AdminEditComponent;
    let fixture: ComponentFixture<AdminEditComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AdminEditComponent],
        });
        fixture = TestBed.createComponent(AdminEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
