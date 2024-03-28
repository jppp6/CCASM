import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Strain } from 'src/app/core/utils/ccasm.types';

@Component({
    selector: 'app-cart-strain-dialogue',
    templateUrl: './cart-strain-dialogue.component.html',
    styleUrls: ['./cart-strain-dialogue.component.css'],
})
export class CartStrainDialogueComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: Strain) {}
}
