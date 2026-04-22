import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onLogin() {
    this.http.post(
      'https://movin-backend-production.up.railway.app/api/auth/login',
      this.loginData
    ).subscribe({
      next: (res: any) => {

        if (!res.user?.isAdmin) {
          this.errorMessage = 'You are not authorized';
          return;
        }

        localStorage.setItem('token', res.token);
        this.router.navigate(['/overview']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed';
        console.error('Login error', err);
      }
    });
  }
}
