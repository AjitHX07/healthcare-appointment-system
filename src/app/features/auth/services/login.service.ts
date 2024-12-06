import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'http://localhost:3000/users';

  constructor(private apiService: ApiService, private router: Router) { }

  login(username: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}?username=${username}&password=${password}`;

    return this.apiService.get<any[]>(url).pipe(
      map((users) => {
        if (users.length > 0) {
          // Save user info to localStorage
          localStorage.setItem('user', JSON.stringify(users[0]));
          return true;
        }
        return false; // Invalid credentials
      }),
      catchError((err) => {
        console.error('Login error:', err);
        return throwError(() => new Error('Login failed.'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }
}