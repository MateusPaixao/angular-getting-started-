import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { FormBuilder } from '@angular/forms';
import { Product } from '../products';
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  items = this.cartService.getItems();
  #total: number = 0;

  checkoutForm = this.formBuilder.group({
    name: '',
    address: '',
  });

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder
  ) {}

  get total() {
    const amount = this.items.reduce((acc, current) => {
      return acc + Number(current.quantity) * current.price;
    }, 0);

    this.#total = amount;
    return this.#total;
  }

  onSubmit(): void {
    // Process checkout data here
    this.items = this.cartService.clearCart();
    console.warn('Your order has been submitted', this.checkoutForm.value);
    this.checkoutForm.reset();
    this.cartService.updateCountItems(0);
  }

  updateQuantity(product: Product, action: string) {
    this.items = this.cartService.updateQuantity(product, action);
  }
}
