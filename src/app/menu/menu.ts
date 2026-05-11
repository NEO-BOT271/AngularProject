import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product';
import { Category, Product, FilterParams } from '../interfaces/menus';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class MenuPage implements OnInit {
 private productService = inject(ProductService);

  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  
  filters = {
    search: '',
    categoryId: undefined as number | undefined,
    minPrice: 0,
    maxPrice: 500,
    minRating: 0,
    isVegetarian: false
  };

  ngOnInit() {
    this.productService.getCategories().subscribe((res: any) => {
      this.categories.set(Array.isArray(res) ? res : res.data || []);
    });
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getFilteredProducts(this.filters).subscribe((res: any) => {
      this.products.set(Array.isArray(res) ? res : res.data || []);
    });
  }

  onFilterChange() {
    this.loadProducts();
  }
}