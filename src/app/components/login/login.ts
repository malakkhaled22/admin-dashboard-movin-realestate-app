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
      console.log("Login Response:", res);

      const userData = res.user || res;

      if (!userData.isAdmin) {
        this.errorMessage = 'You are not authorized! Only Admins can enter.';
        return;
      }

      if (res.accessToken) {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);

        console.log("Tokens stored successfully! Redirecting...");

        this.router.navigate(['/overview']);
      } else {
        this.errorMessage = 'Token not received from server';
      }
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Login failed';
      console.error('Login error details:', err);
    }
  });
}
}
