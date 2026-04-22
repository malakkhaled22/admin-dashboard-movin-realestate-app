import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';

interface SearchResults {
  users: any[];
  properties: any[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('admin-dashboard');

  searchQuery = '';
  searchResults: SearchResults = { users: [], properties: [] };

  selectedItem: any = null;
  selectedItemType: 'user' | 'property' | null = null;

  constructor(
    private http: HttpClient,
    public router: Router
  ) {}

  // ✅ نحدد هل إحنا في صفحة اللوجين
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
      `https://movin-app.vercel.app/api/admin/search?q=${query}`,
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
