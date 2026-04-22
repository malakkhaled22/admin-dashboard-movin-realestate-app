import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, DatePipe, SlicePipe],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class ReportsComponent implements OnInit {
  reports: any[] = [];
  selectedReport: any = null;

  readonly API_URL = 'https://movin-backend-production.up.railway.app/api/reports/admin';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchReports();
  }

  fetchReports() {
    this.http.get<any>(`${this.API_URL}/all`).subscribe({
      next: (res) => {
        this.reports = res.reports || [];
      },
      error: (err) => console.error('Fetch reports error', err)
    });
  }

  resolveReport(id: string) {
    this.http.patch(`${this.API_URL}/${id}/status`, { status: 'resolved' })
      .subscribe({
        next: () => {
          alert('Report resolved successfully!');
          this.fetchReports();
        },
        error: (err) => alert(err.error?.message || 'Error resolving report')
      });
  }

  viewReport(report: any) {
    this.selectedReport = report;
  }

  closeDetails() {
    this.selectedReport = null;
  }
}
