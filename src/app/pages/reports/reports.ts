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
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  reports: any[] = [];
  selectedReport: any = null;

  readonly API_URL = 'https://movin-backend-production-e804.up.railway.app/api/admin/reports';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.fetchReports();
  }

  fetchReports(page: number = 1) {
    this.currentPage = page;
    this.http.get<any>(`${this.API_URL}/all?page=${page}&limit=${this.limit}`).subscribe({
      next: (res) => {
        this.reports = res.reports || [];
        this.totalPages = res.totalPages || 1;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Fetch reports error', err)
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchReports(page);
    }
  }

  getPagesArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
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
