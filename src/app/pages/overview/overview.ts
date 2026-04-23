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
  activities: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchStats();
    this.fetchAdminInfo();
    this.fetchActivities();
  }

  fetchActivities() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('https://movin-backend-production.up.railway.app/api/admin/activities', { headers }).subscribe({
      next: (res) => {
        this.activities = res.activities || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Activities Error:", err)
    });
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'user': return 'blue-light';
      case 'property': return 'green-light';
      case 'report': return 'yellow-light';
      case 'block': return 'red-light';
      default: return 'blue-light';
    }
  }

  getEmoji(type: string): string {
    switch (type) {
      case 'user': return '👤';
      case 'property': return '🏠';
      case 'report': return '📝';
      case 'block': return '🚫';
      default: return '🔔';
    }
  }
  
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

  fetchAdminInfo() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('https://movin-backend-production.up.railway.app/api/users/profile', { headers }).subscribe({
      next: (res) => {
        this.adminData = res.user;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Admin Info Error:", err)
    });
  }

  createCharts() {
  const charts = ['growthChart', 'statusChart'];
  charts.forEach(id => {
    const existingChart = Chart.getChart(id);
    if (existingChart) existingChart.destroy();
  });

  const growthCtx = document.getElementById('growthChart') as HTMLCanvasElement;
  if (growthCtx) {
    new Chart(growthCtx, {
      type: 'line',
      data: {
        labels: this.stats?.growthData?.labels || [],
        datasets: [
          {
            label: 'Properties',
            data: this.stats?.growthData?.properties || [],
            borderColor: '#4318FF',
            backgroundColor: 'rgba(67, 24, 255, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Users',
            data: this.stats?.growthData?.users || [],
            borderColor: '#6AD2FF',
            backgroundColor: 'rgba(106, 210, 255, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end'
          }
        },
        scales: {
          y: { beginAtZero: true },
          x: { grid: { display: false } }
        }
      }
    });
  }

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
        cutout: '70%'
      }
    });
  }
}
}
