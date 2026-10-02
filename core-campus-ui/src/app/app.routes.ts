import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard-guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { StaffLayoutComponent } from './layout/staff-layout/staff-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'student',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    data: { role: 'STUDENT' },
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/student/dashboard/dashboard').then(m => m.StudentDashboardComponent) },
      { path: 'attendance', loadComponent: () => import('./features/student/attendance/attendance').then(m => m.StudentAttendanceComponent) },
      { path: 'timetable', loadComponent: () => import('./features/student/timetable/timetable').then(m => m.StudentTimetableComponent) },
      { path: 'leave', loadComponent: () => import('./features/student/leave/leave').then(m => m.StudentLeaveComponent) },
      { path: 'gate-pass', loadComponent: () => import('./features/student/gate-pass/gate-pass').then(m => m.StudentGatePassComponent) },
      { path: 'certificates', loadComponent: () => import('./features/student/certificates/certificates').then(m => m.StudentCertificatesComponent) },
      { path: 'complaints', loadComponent: () => import('./features/student/complaints/complaints').then(m => m.StudentComplaintsComponent) },
      { path: 'mess', loadComponent: () => import('./features/student/mess/mess').then(m => m.StudentMessComponent) },
      { path: 'fees', loadComponent: () => import('./features/student/fees/fees').then(m => m.StudentFeesComponent) },
      { path: 'notices', loadComponent: () => import('./features/student/notices/notices').then(m => m.StudentNoticesComponent) },
      { path: 'notifications', loadComponent: () => import('./features/student/notifications/notifications').then(m => m.StudentNotificationsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'staff',
    component: StaffLayoutComponent,
    canActivate: [authGuard],
    data: { role: 'STAFF' },
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/staff/dashboard/dashboard').then(m => m.StaffDashboardComponent) },
      { path: 'complaints', loadComponent: () => import('./features/staff/complaints-list/complaints-list').then(m => m.StaffComplaintsListComponent) },
      { path: 'complaints/:id', loadComponent: () => import('./features/staff/complaint-detail/complaint-detail').then(m => m.StaffComplaintDetailComponent) },
      { path: 'notifications', loadComponent: () => import('./features/staff/notifications/notifications').then(m => m.StaffNotificationsComponent) },
      { path: 'profile', loadComponent: () => import('./features/staff/profile/profile').then(m => m.StaffProfileComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboardComponent) },
      { path: 'complaints', loadComponent: () => import('./features/admin/complaints-admin/complaints-admin').then(m => m.AdminComplaintsComponent) },
      { path: 'requests', loadComponent: () => import('./features/admin/requests-admin/requests-admin').then(m => m.AdminRequestsComponent) },
      { path: 'gate-passes', loadComponent: () => import('./features/admin/gate-verification/gate-verification').then(m => m.GateVerificationComponent) },
      { path: 'notices', loadComponent: () => import('./features/admin/notices-admin/notices-admin').then(m => m.AdminNoticesComponent) },
      { path: 'audit-log', loadComponent: () => import('./features/admin/audit-log/audit-log').then(m => m.AdminAuditLogComponent) },
      { path: 'service-desk', loadComponent: () => import('./features/admin/service-desk/service-desk').then(m => m.ServiceDeskComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];