import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class ReportsComponent implements OnInit {
  reports: any[] = [];
  selectedReport: any = null;
  readonly API_URL = 'https://movin-app.vercel.app/api/reports/admin/all';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchReports();
  }

  fetchReports() {
    this.http.get<any>(this.API_URL).subscribe({
      next: (res) => {
        this.reports = res.reports || [];
      },
      error: (err) => console.error('Fetch reports error', err)
    });
  }

  resolveReport(id: string) {
    this.http.patch(`https://movin-app.vercel.app/api/reports/admin/${id}/status`, { status: 'resolved' })
      .subscribe({
        next: () => {
          alert('Report resolved successfully!');
          this.fetchReports();
        },
        error: (err) => console.error('Resolve error', err)
      });
  }

  viewReport(report: any) {
    this.selectedReport = report; 
  }

  closeDetails() {
    this.selectedReport = null; 
  }
}
