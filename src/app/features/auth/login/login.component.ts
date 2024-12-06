import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from "../../auth/services/login.service"
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  login = {
    username: '',
    password: '',
  };

  constructor(private authService: LoginService, private router: Router) { }

  onSubmit(form: any): void {
    // Ensure the form is valid before proceeding
    if (form.valid) {
      const { username, password } = this.login;

      // Attempt to log in using the provided credentials
      this.authService.login(username, password).subscribe({
        // Handle successful login
        next: (isLoggedIn) => {
          if (isLoggedIn) {
            // Navigate to the dashboard if login is successful
            this.router.navigate(['/dashboard']);
          } else {
            // Notify the user of invalid credentials
            alert('Invalid username or password. Please try again.');
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          alert('An error occurred. Please try again later.');
        },
      });
    }
  }
}