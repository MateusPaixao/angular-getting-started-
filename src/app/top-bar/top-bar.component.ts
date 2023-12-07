import { Component, OnDestroy } from '@angular/core';
import { CartService } from '../cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent implements OnDestroy {
  itemsCount: number;
  private subscription: Subscription;

  constructor(private cartService: CartService) {
    this.itemsCount = this.cartService.getItems().length;
    this.subscription = this.cartService.itemsCount$.subscribe(
      (value) => (this.itemsCount = value)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
