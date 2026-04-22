import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './overview.html',
  styleUrls: ['./overview.scss']
})
  
export class OverviewComponent implements OnInit {
  stats: any;
  searchQuery: string = '';
  searchResults: any = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchStats();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: any) {
    if (!event.target.closest('.search-box')) {
      this.searchResults = null;
    }
  }

  fetchStats() {
    this.http.get('https://movin-app.vercel.app/api/admin/stats').subscribe({
      next: (data: any) => {
        this.stats = data;

        this.cdr.detectChanges();

        setTimeout(() => {
          this.createCharts();
        }, 100);
      },
      error: (err) => console.error("Stats Error:", err)
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
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'New Users',
              data: [50, 80, 70, 90, 110, 130],
              borderColor: '#4318FF',
              backgroundColor: 'rgba(67, 24, 255, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'New Properties',
              data: [30, 40, 35, 50, 45, 60],
              borderColor: '#05CD99',
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
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
          plugins: {
            legend: { display: false }
          },
          cutout: '75%'
        }
      });
    }
  }

  onSearch() {
    if (!this.searchQuery.trim()) return;
    this.http.get(`https://movin-app.vercel.app/api/admin/search?q=${this.searchQuery}`)
      .subscribe({
        next: (data: any) => { this.searchResults = data; },
        error: (err) => console.error('Search failed', err)
      });
  }
}
