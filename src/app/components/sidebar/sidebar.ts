import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  constructor(private http: HttpClient, private router: Router) {}

  onLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.http.post('http://localhost:3000/api/auth/logout', {}).subscribe({
        next: () => {
          this.completeLogout();
        },
        error: (err) => {
          console.error('Logout failed on server:', err);
          this.completeLogout();
        }
      });
    }
  }

  private completeLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
