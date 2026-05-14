import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  adminData: any = null;
  stats: any = null;
  showEditModal = false;
  editData: any = {};

  readonly API_URL = 'https://movin-backend-production-e804.up.railway.app/api/users';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getAdminProfile();
  }

  getAdminProfile() {
    const url = `${this.API_URL}/profile?t=${new Date().getTime()}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.adminData = res.user;
        this.stats = res.stats;
        this.editData = { ...res.user };
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Profile fetch error', err)
    });
  }

  openEditModal() {
    this.editData = { ...this.adminData };
    this.showEditModal = true;
  }

  saveProfile() {
    const updateUrl = `${this.API_URL}/profile`;

    const dataToUpdate = {
      username: this.editData.username,
      phone: this.editData.phone,
      location: this.editData.location,
      bio: this.editData.bio
    };

    this.http.put(updateUrl, dataToUpdate).subscribe({
      next: (res: any) => {
        alert('Profile updated successfully! ✅');
        this.adminData = res.user;
        this.showEditModal = false;
        this.cdr.detectChanges();

        window.location.reload();
      },
      error: (err) => {
        console.error("Update error:", err);
        alert('Update failed: ' + (err.error?.message || 'Check Console'));
      }
    });
  }
}
