import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem('user');

  if (isAuthenticated) {
    return true;
  } else {
    // Redirect to login if not authenticated
    router.navigate(['/login']);
    return false;
  }
};