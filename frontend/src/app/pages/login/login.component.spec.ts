import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './login.component';

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

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
