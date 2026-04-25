import { Routes } from '@angular/router';

import { OverviewComponent } from './pages/overview/overview';
import { UsersComponent } from './pages/users/users';
import { PropertiesComponent } from './pages/properties/properties';
import { ReportsComponent } from './pages/reports/reports';

import { AdminLayout } from './layout/admin-layout';
import { LoginComponent } from './components/login/login';

import { AuthGuard } from './guards/auth.guard';
import { AuctionsComponent } from './pages/auctions/auctions';
import { ProfileComponent } from './pages/profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AdminLayout,
    canActivate: [AuthGuard],
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'users', component: UsersComponent },
      { path: 'properties', component: PropertiesComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'auctions', component: AuctionsComponent },
      { path: 'admin/profile', component: ProfileComponent },
    ],
  },
  { path: '**', redirectTo: 'login' }
];
