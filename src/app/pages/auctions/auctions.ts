import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auctions',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, TitleCasePipe],
  templateUrl: './auctions.html',
  styleUrls: ['./auctions.scss']
})
export class AuctionsComponent implements OnInit {
  currentTab: string = 'pending';
  auctions: any[] = [];
  loading: boolean = false;

  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  showRejectModal: boolean = false;
  selectedId: string = '';
  rejectReason: string = '';

  private baseUrl = 'https://movin-backend-production.up.railway.app/api/admin/auctions';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchAuctions(this.currentTab, 1);
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  setTab(tab: string) {
    this.currentTab = tab;
    this.fetchAuctions(tab, 1);
  }

  fetchAuctions(tab: string, page: number = 1) {
    this.loading = true;
    this.currentPage = page;

    const url = `${this.baseUrl}/${tab}?page=${page}&limit=${this.limit}`;

    this.http.get<any>(url, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        this.auctions = res.auctions || res.result?.auctions || [];
        this.totalPages = res.totalPages || res.result?.totalPages || 1;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Fetch Error:", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchAuctions(this.currentTab, page);
    }
  }

  getPagesArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  onApprove(id: string) {
    this.http.put(`${this.baseUrl}/${id}/approve`, {}, { headers: this.getHeaders() }).subscribe({
      next: () => {
        alert('Auction Approved successfully! ✅');
        this.fetchAuctions(this.currentTab, this.currentPage);
      },
      error: (err) => alert(err.error?.message || 'Error approving auction')
    });
  }

  openReject(id: string) {
    this.selectedId = id;
    this.rejectReason = '';
    this.showRejectModal = true;
  }

  confirmReject() {
    if (!this.rejectReason.trim()) return alert('Please provide a reason');

    this.http.put(`${this.baseUrl}/${this.selectedId}/reject`,
      { reason: this.rejectReason },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        alert('Auction rejected! 🚫');
        this.showRejectModal = false;
        this.fetchAuctions(this.currentTab, this.currentPage);
      },
      error: (err) => alert(err.error?.message || 'Error rejecting auction')
    });
  }
}
