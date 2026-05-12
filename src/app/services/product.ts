import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, Product, FilterParams } from '../interfaces/menus';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api`;

  getCategories(): Observable<Category[]> {
    return this.http.get<any>(`${this.baseUrl}/categories`).pipe(
      map(res => Array.isArray(res) ? res : res.data || [])
    );
  }

  getFilteredProducts(f: FilterParams): Observable<Product[]> {
    let params = new HttpParams()
      .set('minPrice', f.minPrice.toString())
      .set('maxPrice', f.maxPrice.toString())
      .set('minRating', f.minRating.toString())
      .set('isVegetarian', f.isVegetarian.toString());

    if (f.search) params = params.set('search', f.search);
    if (f.categoryId) params = params.set('categoryId', f.categoryId.toString());

    return this.http.get<any>(`${this.baseUrl}/products/filter`, { params }).pipe(
      map(res => Array.isArray(res) ? res : res.data || [])
    );
  }
getProductById(id: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/api/products/${id}`);
}
}