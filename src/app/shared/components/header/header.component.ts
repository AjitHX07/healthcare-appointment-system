import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private Router: Router) { }
  logout(): void {
    // Remove the user information from localStorage
    localStorage.removeItem('user');

    // Redirect the user to the login page
    this.Router.navigate(['/login']);
  }
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}