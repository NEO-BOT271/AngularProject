import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  cartService = inject(CartService);

  subtotal = 0;
  tax = 0;
  total = 0;

  constructor() {
    effect(() => {
      const items = this.cartService.cartItems();
      this.subtotal = items.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
      this.tax = this.subtotal * 0.10;
      this.total = this.subtotal + this.tax;
    });
  }

  ngOnInit() {
    this.cartService.fetchCart();
  }

  updateQty(item: any, change: number) {
    const newQty = item.quantity + change;
    if (newQty < 1) return;

    this.cartService.updateQuantity(item.product.id, newQty).subscribe({
      next: () => this.cartService.fetchCart(),
      error: (err) => console.error('Check URL: /api/cart/edit-quantity', err)
    });
  }

  onRemove(itemId: number) {
    this.cartService.removeItem(itemId).subscribe(() => this.cartService.fetchCart());
  }

  onCheckout() {
    this.cartService.checkout().subscribe(() => {
      alert('Order placed successfully!');
      this.cartService.fetchCart();
    });
  }
}