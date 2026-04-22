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
  readonly API_URL = 'https://movin-app.vercel.app/api/admin/users';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<any>(`${this.API_URL}/all`).subscribe({
      next: (res) => {
        this.users = res.result.users;
      },
      error: (err) => console.error('Fetch users error', err)
    });
  }

  toggleBlock(userId: string, isBlocked: boolean) {
    const action = isBlocked ? 'unblock' : 'block';

    this.http.patch(`${this.API_URL}/${action}/${userId}`, {}).subscribe({
      next: () => {
        const user = this.users.find(u => u._id === userId);
        if (user) user.isBlocked = !user.isBlocked;
      },
      error: (err) => console.error('Block/unblock error', err)
    });
  }
}
