import { Injectable } from '@angular/core';
import { Strain } from '../utils/ccasm.types';
import { Utils } from '../utils/ccasm.utils';
import { CCASMService } from './ccasm.services';

@Injectable({
  providedIn: 'root',
})
export class StrainCartService {
  cart: Strain[] = [];
  strains: Strain[] = [];

  constructor(private ccasmService: CCASMService) {
    this.ccasmService.getStrains().subscribe((strains) => {
      this.strains = Utils.snackCaseToCamelCase(strains) as Strain[];
    });
  }

  addStrainToCart(s: Strain): void {
    this.cart.push(s);
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

  getAllStrain(): Strain[] {
    return this.strains;
  }
}
