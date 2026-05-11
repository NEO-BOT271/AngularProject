import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  currentUser = signal<any | null>(null);

  constructor() {
    const token = localStorage.getItem('token');
    if (token && token.length > 10) {
      this.getProfile().subscribe({
        error: () => this.logout()
      });
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/login`, credentials).pipe(
      tap((res: any) => {
        const token = res.data?.accessToken || res.data?.token;

        if (token) {
          localStorage.setItem('token', token);

          this.currentUser.set(res.data);
          console.log('gilocav tokeni dasaveda shegidzlia naxo local storageshi');
        } else {
          console.error(' aq ar aris tokeni ', res.data);
        }
      })
    );
  }

  getProfile() {
    return this.http.get(`${this.baseUrl}/api/users/me`).pipe(
      tap((user) => this.currentUser.set(user))
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/register`, userData);
  }
}