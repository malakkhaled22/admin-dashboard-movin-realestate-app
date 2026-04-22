import { Routes } from '@angular/router';

import { OverviewComponent } from './pages/overview/overview';
import { UsersComponent } from './pages/users/users';
import { PropertiesComponent } from './pages/properties/properties';
import { ReportsComponent } from './pages/reports/reports';

import { AdminLayout } from './layout/admin-layout';
import { LoginComponent } from './components/login/login';

import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

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
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' }
];
