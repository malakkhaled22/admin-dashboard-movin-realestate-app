import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TitleCasePipe],
  templateUrl: './properties.html',
  styleUrls: ['./properties.scss']
})
export class PropertiesComponent implements OnInit {
  properties: any[] = [];
  currentTab: 'pending' | 'approved' | 'rejected' | 'all' = 'pending';

  readonly API_URL = 'https://movin-backend-production.up.railway.app/api/admin/properties';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProperties(this.currentTab);
  }

  fetchProperties(tab: 'pending' | 'approved' | 'rejected' | 'all') {
    this.currentTab = tab;
    let endpoint = (tab === 'pending') ? 'pending' : 'all';

    this.http.get<any>(`${this.API_URL}/${endpoint}`).subscribe({
      next: (res) => {
        const allProps: any[] = res.properties || [];
        if(tab === 'approved') this.properties = allProps.filter((p: any) => p.status === 'approved');
        else if(tab === 'rejected') this.properties = allProps.filter((p: any) => p.status === 'rejected');
        else if(tab === 'pending') this.properties = allProps.filter((p: any) => p.status === 'pending');
        else this.properties = allProps;
      },
      error: (err) => console.error('Fetch properties error', err)
    });
  }

  approve(id: string) {
    this.http.put(`${this.API_URL}/approve/${id}`, {}).subscribe({
      next: () => {
        this.properties = this.properties.filter((p: any) => p._id !== id);
        alert('Property approved successfully!');
      },
      error: (err) => alert(err.error?.message || 'Error approving property')
    });
  }

  reject(id: string) {
    this.http.put(`${this.API_URL}/reject/${id}`, {}).subscribe({
      next: () => {
        this.properties = this.properties.filter((p: any) => p._id !== id);
        alert('Property rejected successfully!');
      },
      error: (err) => alert(err.error?.message || 'Error rejecting property')
    });
  }
}
