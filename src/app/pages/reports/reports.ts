import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // تم حذف HttpHeaders اليدوية
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

  readonly API_URL = 'https://movin-backend-production.up.railway.app/api/admin/reports';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.fetchReports();
  }

  fetchReports() {
    this.http.get<any>(`${this.API_URL}/all`).subscribe({
      next: (res) => {
        this.reports = res.reports || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Fetch reports error', err)
    });
  }

  resolveReport(id: string) {
    this.http.patch(`${this.API_URL}/${id}`, { status: 'resolved' })
      .subscribe({
        next: () => {
          alert('Report resolved successfully! ✅');
          this.closeDetails();
          this.fetchReports();
        },
        error: (err) => alert(err.error?.message || 'Error resolving report')
      });
  }

  viewReport(report: any) {
    console.log("Selected Report Data:", report);
    this.selectedReport = report;
    this.cdr.detectChanges();
  }

  closeDetails() {
    this.selectedReport = null;
    this.cdr.detectChanges();
  }
}
