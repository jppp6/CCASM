import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartStrainDialogueComponent } from './cart-strain-dialogue.component';

describe('CartStrainDialogueComponent', () => {
    let component: CartStrainDialogueComponent;
    let fixture: ComponentFixture<CartStrainDialogueComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CartStrainDialogueComponent],
        });
        fixture = TestBed.createComponent(CartStrainDialogueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
