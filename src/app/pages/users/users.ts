import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ✅ إضافة ChangeDetectorRef
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  readonly API_URL = 'https://movin-backend-production.up.railway.app/api/admin';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchUsers(this.currentPage);
  }

  fetchUsers(page: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(`${this.API_URL}/users/all?page=${page}&limit=${this.limit}`, { headers }).subscribe({
      next: (res) => {
        console.log("Full Server Response:", res);
        this.users = res.users || res.result?.users || [];
        this.totalPages = res.totalPages || res.result?.totalPages || 1;
        this.currentPage = page;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Fetch error:', err);
        this.users = [];
        this.cdr.detectChanges();
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchUsers(page);
    }
  }

  getPagesArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  toggleBlock(userId: string, isBlocked: boolean) {
    const action = isBlocked ? 'unblock' : 'block';
    const url = `${this.API_URL}/users/${action}/${userId}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.patch(url, {}, { headers }).subscribe({
      next: () => {
        const user = this.users.find(u => u._id === userId);
        if (user) {
          user.isBlocked = !isBlocked;
          this.cdr.detectChanges();
        }
      },
      error: (err) => alert(err.error?.message || 'Error occurred')
    });
  }
}
