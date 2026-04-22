import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  readonly API_URL = 'https://movin-backend-production.up.railway.app/api/users';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getAdminProfile();
  }

  getAdminProfile() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // استخدام Timestamp لمنع الكاش وجلب أحدث بيانات
    const url = `${this.API_URL}/profile?t=${new Date().getTime()}`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (res) => {
        this.adminData = res.user;
        this.stats = res.stats; // تخزين الإحصائيات من الريسبونس
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
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const updateUrl = `${this.API_URL}/profile`;

    // إرسال الحقول المطلوبة فقط لتجنب أخطاء الباك-أند
    const dataToUpdate = {
      username: this.editData.username,
      phone: this.editData.phone,
      location: this.editData.location,
      bio: this.editData.bio
    };

    this.http.put(updateUrl, dataToUpdate, { headers }).subscribe({
      next: (res: any) => {
        alert('Profile updated successfully! ✅');
        this.adminData = res.user;
        this.showEditModal = false;
        this.cdr.detectChanges();

        // إعادة تحميل بسيطة لتحديث الاسم في الهيدر والداشبورد
        window.location.reload();
      },
      error: (err) => {
        console.error("Update error:", err);
        alert('Update failed: ' + (err.error?.message || 'Check Console'));
      }
    });
  }
}
