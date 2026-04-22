import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auctions',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './auctions.html',
  styleUrls: ['./auctions.scss']
})
export class AuctionsComponent implements OnInit {
  currentTab: string = 'pending';
  auctions: any[] = [];
  loading: boolean = false;

  showRejectModal: boolean = false;
  selectedId: string = '';
  rejectReason: string = '';

  private baseUrl = 'https://movin-backend-production.up.railway.app/api/admin/auctions';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchAuctions();
  }

  setTab(tab: string) {
    this.currentTab = tab;
    this.fetchAuctions();
  }

  fetchAuctions() {
    this.loading = true;
    this.auctions = [];

    let url = `${this.baseUrl}/${this.currentTab}`;
    if (this.currentTab === 'all') url = `${this.baseUrl}/pending`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.auctions = data.auctions;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Fetch Error:", err);
        this.loading = false;
      }
    });
  }

  onApprove(id: string) {
    this.http.put(`${this.baseUrl}/${id}/approve`, {}).subscribe({
      next: () => {
        alert('Auction Approved successfully!');
        this.fetchAuctions();
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
    this.http.put(`${this.baseUrl}/${this.selectedId}/reject`, { reason: this.rejectReason }).subscribe({
      next: () => {
        this.showRejectModal = false;
        this.fetchAuctions();
      },
      error: (err) => alert(err.error?.message || 'Error rejecting auction')
    });
  }
}
