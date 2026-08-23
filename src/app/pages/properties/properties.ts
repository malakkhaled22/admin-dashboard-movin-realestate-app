import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TitleCasePipe, FormsModule],
  templateUrl: './properties.html',
  styleUrls: ['./properties.scss']
})
export class PropertiesComponent implements OnInit {
  properties: any[] = [];
  currentTab: string = 'pending';
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  showRejectModal: boolean = false;
  selectedId: string = '';
  rejectedReason: string = '';
  readonly API_URL = 'http://localhost:3000/api/admin/properties';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchProperties(this.currentTab, 1);
  }


  fetchProperties(tab: string, page: number = 1) {
    this.currentTab = tab;
    this.currentPage = page;
    const statusParam = tab === 'all' ? '' : `&status=${tab}`;
    const url = `${this.API_URL}/all?page=${page}&limit=${this.limit}${statusParam}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.properties = res.properties || res.result?.properties || [];
        this.totalPages = res.totalPages || res.result?.totalPages || 1;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Fetch properties error', err);
        this.properties = [];
        this.cdr.detectChanges();
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchProperties(this.currentTab, page);
    }
  }

  getPagesArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  approve(id: string) {
    this.http.put(`${this.API_URL}/approve/${id}`, {}).subscribe({
      next: () => {
        alert('Property approved successfully! ✅');
        this.fetchProperties(this.currentTab, this.currentPage);
      },
      error: (err) => alert(err.error?.message || 'Error approving property')
    });
  }

  reject(id: string) {
  this.selectedId = id;
  this.rejectedReason = '';
  this.showRejectModal = true;
}
  confirmReject() {
  if (!this.rejectedReason.trim()) {
    alert('Please specify a reason for rejection');
    return;
  }

  this.http.put(`${this.API_URL}/reject/${this.selectedId}`, {
    reason: this.rejectedReason
  }).subscribe({
    next: () => {
      alert('Property rejected successfully! 🚫');
      this.showRejectModal = false;
      this.fetchProperties(this.currentTab, this.currentPage);
    },
    error: (err) => alert(err.error?.message || 'Error rejecting property')
  });
}
}
