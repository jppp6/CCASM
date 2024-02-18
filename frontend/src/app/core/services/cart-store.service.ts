import { Injectable } from '@angular/core';
import { Strain } from '../utils/ccasm.types';

@Injectable({
  providedIn: 'root',
})
export class CartStoreService {
  cart: Strain[] = [];

  addStrain(newStrain: Strain): void {
    this.cart.push(newStrain);
  }

  removeStrainById(strainId: string): boolean {
    const strain = this.cart.find((s) => s.ccasmId.toString() === strainId);
    if (!strain) {
      return false;
    }

    this.cart = this.cart.filter((s) => s.ccasmId.toString() !== strainId);
    return true;
  }

  getSelectedStrains(): Strain[] {
    return [...this.cart];
  }

  clearCart(): void {
    this.cart = [];
  }
}
