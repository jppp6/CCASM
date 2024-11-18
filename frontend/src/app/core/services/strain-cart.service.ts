import { Injectable } from '@angular/core';
import { Strain } from '../utils/ccasm.types';

@Injectable({
    providedIn: 'root',
})
export class StrainCartService {
    cart: Strain[] = [];

    addStrainToCart(s: Strain): boolean {
        if (this.isStrainAlreadyInCart(s.strainId)) {
            console.log('Already in cart');
            return false;
        } else {
            this.cart.push(s);
        }

        return true;
    }

    removeStrainById(id: string): boolean {
        const strain = this.cart.find((s) => s.strainId.toString() === id);
        if (!strain) {
            return false;
        }

        this.cart = this.cart.filter((s) => s.strainId.toString() !== id);
        return true;
    }

    getSelectedStrains(): Strain[] {
        return [...this.cart];
    }

    clearCart(): void {
        this.cart = [];
    }

    private isStrainAlreadyInCart(id: number): boolean {
        return this.cart.some((s) => s.strainId === id);
    }
}
