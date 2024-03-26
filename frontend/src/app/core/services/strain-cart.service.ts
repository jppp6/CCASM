import { Injectable } from '@angular/core';
import { Strain } from '../utils/ccasm.types';

@Injectable({
    providedIn: 'root',
})
export class StrainCartService {
    cart: Strain[] = [];

    addStrainToCart(s: Strain): boolean {
        if (this.isStrainAlreadyInCart(s.ccasmId)) {
            console.log("Already in cart");
            return false;
        } else {
            this.cart.push(s);
        }

        return true;
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

    private isStrainAlreadyInCart(strainId: number): boolean {
        return this.cart.some((s) => s.ccasmId === strainId);
    }
}
