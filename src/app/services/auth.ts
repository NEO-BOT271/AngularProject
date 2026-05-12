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
  updateProfile(userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/users/edit`, userData).pipe(
      tap((updatedUser: any) => {
        this.currentUser.set(updatedUser.data || updatedUser);
      })
    );
  }
  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/register`, userData);
  }
  verifyEmail(email: string, code: string): Observable<any> {
  const payload = { email, code };
  return this.http.put(`${this.baseUrl}/api/auth/verify-email`, payload);
}
 resendVerification(email: string): Observable<any> {
  if (!email) {
    console.error("Email is missing!");
    return throwError(() => new Error("Email is required"));
  }
  const url = `${this.baseUrl}/api/auth/resend-email-verification/${email}`;
  return this.http.post(url, {});
}
}