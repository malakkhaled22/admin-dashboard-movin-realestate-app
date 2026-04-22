import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  readonly API_URL = 'https://movin-backend-production.up.railway.app/api/admin';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
  this.http.get<any>(`${this.API_URL}/users/all`).subscribe({
    next: (res) => {

      this.users = res.users || res.result?.users || [];
      console.log("Full Response from Server:", res);
    },
    error: (err) => console.error('Fetch error:', err)
  });
}
  toggleBlock(userId: string, isBlocked: boolean) {
    const action = isBlocked ? 'unblock' : 'block';
    const url = `${this.API_URL}/users/${action}/${userId}`;

    this.http.patch(url, {}).subscribe({
      next: () => {
        const user = this.users.find(u => u._id === userId);
        if (user) {
          user.isBlocked = !isBlocked;
          alert(`User status updated to ${action}ed!`);
        }
      },
      error: (err) => alert(err.error?.message || 'Error occurred')
    });
  }
}
