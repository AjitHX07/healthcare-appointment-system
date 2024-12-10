import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.url;
  // private baseUrl = "http://localhost:3000";


  constructor(private apiService: ApiService, private router: Router) { }

  login(username: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/users?username=${username}&password=${password}`;

    return this.apiService.get<any[]>(url).pipe(
      map((users) => {
        if (users.length > 0) {
          localStorage.setItem('user', JSON.stringify(users[0]));
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Login error:', error);
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