import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CartStoreService } from 'src/app/core/services/cart-store.service';
import { Strain } from 'src/app/core/utils/ccasm.types';

@Component({
  selector: 'app-strain-details',
  templateUrl: './strain-details.component.html',
  styleUrls: ['./strain-details.component.css'],
})
export class StrainDetailsDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Strain,
    private cartService: CartStoreService
  ) {}

  addStrainToCart(): void {
    this.cartService.addStrain(this.data);
  }
}
