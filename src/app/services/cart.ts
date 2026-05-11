import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);

  cartItems = signal<any[]>([]);
  cartCount = signal<number>(0);

  fetchCart() {
    this.http.get(`${environment.apiUrl}/api/cart`).subscribe({
      next: (res: any) => {
        const items = res.data?.items || [];
        this.cartItems.set(items);
        const total = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
        this.cartCount.set(total);
        console.log(res)
      },
      error: (err) => console.error('Error for fetching cart!', err)
    });
  }


  addToCart(productId: number, quantity: number = 1) {
    const url = `${environment.apiUrl}/api/cart/add-to-cart`;
    console.log("es aris url", url);
    return this.http.post(url, { productId, quantity });
  }
  updateQuantity(productId: number, quantity: number) {
    return this.http.put(`${environment.apiUrl}/api/cart/edit-quantity`, { productId, quantity });
  }

  removeItem(itemId: number) {
    return this.http.delete(`${environment.apiUrl}/api/cart/remove-from-cart/${itemId}`);
  }

  checkout() {
    return this.http.post(`${environment.apiUrl}/api/cart/checkout`, {});
  }
}
