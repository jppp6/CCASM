import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSearchComponent } from './simple-search.component';

describe('SimpleSearchComponent', () => {
    let component: SimpleSearchComponent;
    let fixture: ComponentFixture<SimpleSearchComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SimpleSearchComponent],
        });
        fixture = TestBed.createComponent(SimpleSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
