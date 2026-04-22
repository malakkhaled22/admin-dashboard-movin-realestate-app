import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';

interface SearchResults {
  users: any[];
  properties: any[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, FormsModule, RouterLink],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  protected readonly title = signal('admin-dashboard');

  adminData: any = null;
  searchQuery = '';
  searchResults: SearchResults = { users: [], properties: [] };

  selectedItem: any = null;
  selectedItemType: 'user' | 'property' | null = null;

  constructor(
    private http: HttpClient,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.isLoginPage()) {
      this.fetchAdminProfile();
    }
  }

  // app.ts
fetchAdminProfile() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const noCacheUrl = `https://movin-backend-production.up.railway.app/api/users/profile?t=${new Date().getTime()}`;

  this.http.get<any>(noCacheUrl, {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: (res) => {
      console.log("Header received fresh data:", res.user);
      this.adminData = res.user;
      this.cdr.detectChanges();
    }
  });
}
  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }

  onGlobalSearch() {
    const query = this.searchQuery.trim();
    if (!query) {
      this.clearSearch();
      return;
    }

    this.http.get(
      `https://movin-backend-production.up.railway.app/api/admin/search?q=${query}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        }
      }
    ).subscribe({
      next: (data: any) => {
        this.searchResults = {
          users: data.users || [],
          properties: data.properties || []
        };
      },
      error: (err) => console.error('Search error', err)
    });
  }

  clearSearch() {
    this.searchResults = { users: [], properties: [] };
    this.searchQuery = '';
  }

  openModal(item: any, type: 'user' | 'property') {
    this.selectedItem = item;
    this.selectedItemType = type;
  }

  closeModal() {
    this.selectedItem = null;
    this.selectedItemType = null;
  }
}
