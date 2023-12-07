import { HttpClient } from '@angular/common/http';
import { Product } from './products';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
/* . . . */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: Product[] = [];
  #totalItems: number = 0;

  private itemsCount = new BehaviorSubject<number>(this.items.length);
  itemsCount$ = this.itemsCount.asObservable();

  constructor(private http: HttpClient) {}

  get totalItems() {
    this.#totalItems = this.items.reduce((acc, current) => {
      return acc + Number(current.quantity);
    }, 0);

    return this.#totalItems;
  }

  updateCountItems(count: number) {
    this.itemsCount.next(count);
  }

  addToCart(product: Product) {
    const foundProduct = this.items.find((p) => p.id === product.id);
    if (foundProduct) {
      const quantity = Number(foundProduct.quantity) + 1;

      if (quantity < 0 || quantity > product.stock) return;
      this.items = this.items.map((item) => {
        if (item.id === product.id) {
          return {
            ...item,
            quantity: Number(item.quantity) + 1,
          };
        }
        return item;
      });
    } else {
      this.items.push({
        ...product,
        quantity: 1,
      });
    }

    this.updateCountItems(this.totalItems);
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

  getShippingPrices() {
    return this.http.get<{ type: string; price: number }[]>(
      '/assets/shipping.json'
    );
  }

  updateQuantity(product: Product, action: string) {
    const quantity =
      action === 'INCREASE'
        ? Number(product.quantity) + 1
        : Number(product.quantity) - 1;

    console.log(product);

    if (quantity < 0 || quantity > product.stock) return this.items;

    this.items = this.items.map((item) => {
      if (item.id === product.id) {
        return {
          ...item,
          quantity,
        };
      }
      return item;
    });

    this.updateCountItems(this.totalItems);

    return this.items;
  }
}
