import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrls: ['./overview.scss']
})
export class OverviewComponent implements OnInit {
  stats: any = null;
  adminData: any = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchStats();
    this.fetchAdminInfo(); // ✅ ضفنا الفانكشن دي هنا
  }

  // 1. دي اللي بتجيب الأرقام والكاردز
  fetchStats() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('https://movin-backend-production.up.railway.app/api/admin/stats', { headers }).subscribe({
      next: (res) => {
        this.stats = res;
        this.cdr.detectChanges();
        setTimeout(() => this.createCharts(), 100);
      },
      error: (err) => console.error("Stats Error:", err)
    });
  }

  // 2. دي اللي بتجيب اسم الأدمن عشان الـ Welcome Back
  fetchAdminInfo() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('https://movin-backend-production.up.railway.app/api/users/profile', { headers }).subscribe({
      next: (res) => {
        this.adminData = res.user; // ✅ هنا بقى الاسم هيدخل في adminData
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Admin Info Error:", err)
    });
  }

  createCharts() {
  // 1. مسح أي شارتس قديمة عشان ما يحصلش تداخل
  const charts = ['growthChart', 'statusChart'];
  charts.forEach(id => {
    const existingChart = Chart.getChart(id);
    if (existingChart) existingChart.destroy();
  });

  // 2. شارت النمو (Monthly Growth)
  const growthCtx = document.getElementById('growthChart') as HTMLCanvasElement;
  if (growthCtx) {
    new Chart(growthCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Properties',
          data: [2, 5, 8, 12, 14, this.stats?.totalProperties || 0],
          borderColor: '#4318FF',
          backgroundColor: 'rgba(67, 24, 255, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 3. شارت الحالة (Property Status) - ده اللي كان مختفي
 // جوه createCharts()
const statusCtx = document.getElementById('statusChart') as HTMLCanvasElement;
if (statusCtx) {
  new Chart(statusCtx, {
    type: 'doughnut',
    data: {
      labels: ['Approved', 'Pending', 'Rejected'],
      datasets: [{
        data: [
          this.stats?.properties?.approved || 0,
          this.stats?.properties?.pending || 0,
          this.stats?.properties?.rejected || 0
        ],
        backgroundColor: ['#05CD99', '#FFB400', '#EE5D50']
      }]
    },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        cutout: '70%'
      }
    });
  }
}
}
