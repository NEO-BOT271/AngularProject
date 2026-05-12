import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Fixes routerLink error
import { HttpClient } from '@angular/common/http';
import { DecimalPipe, CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [DecimalPipe, CommonModule, RouterLink], 
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class Card implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  product = signal<any>(null);
  quantity = signal(1);
  relatedProducts = signal<any[]>([]); 

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.fetchProductDetails(id);
        this.fetchRelated(id);
      }
    });
  }

  fetchProductDetails(id: string) {
    this.http.get(`${environment.apiUrl}/api/products/${id}`).subscribe({
      next: (res: any) => this.product.set(res.data),
      error: (err) => console.error(err)
    });
  }

  fetchRelated(currentId: string) {
    this.http.get(`${environment.apiUrl}/api/products`).subscribe({
      next: (res: any) => {
        const all = res.data?.products || res.data || [];
        const filtered = all.filter((p: any) => p.id !== +currentId);
        const randomStart = Math.floor(Math.random() * Math.max(0, filtered.length - 3));
        this.relatedProducts.set(filtered.slice(randomStart, randomStart + 3));
      }
    });
  }

  updateQty(change: number) {
    const newQty = this.quantity() + change;
    if (newQty >= 1) this.quantity.set(newQty);
  }

  addToCart() {
    const productId = this.product()?.id;
    if (!productId) return;

    this.http.post(`${environment.apiUrl}/api/cart/add-to-cart`, {
      productId: productId,
      quantity: this.quantity()
    }).subscribe({
      next: () => alert('Added to cart!'),
      error: () => alert('Failed to add. Are you logged in?')
    });
  }
}