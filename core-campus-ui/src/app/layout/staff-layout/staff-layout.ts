import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../core/services/storage.service';
import { User, Notification } from '../../core/models/campus.models';

@Component({
  selector: 'app-staff-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="d-flex" style="min-height: 100vh;">
      <!-- Sidebar -->
      <nav class="bg-dark text-white p-3 d-none d-md-flex flex-column" style="width: 260px;">
        <div class="d-flex align-items-center mb-4">
          <i class="bi bi-tools fs-3 text-warning me-2"></i>
          <div>
            <span class="fs-5 fw-bold d-block lh-1">CoreCampus</span>
            <small class="text-secondary" style="font-size: 0.72rem;">STAFF OPERATIONS</small>
          </div>
        </div>

        <div class="p-2 mb-3 rounded bg-secondary bg-opacity-25 border border-secondary border-opacity-50">
          <div class="fw-semibold text-truncate">{{ user?.name }}</div>
          <div class="small text-warning">{{ user?.staffDetails?.category }} Team</div>
          <div class="text-secondary" style="font-size: 0.75rem;">{{ user?.staffDetails?.department }}</div>
        </div>

        <ul class="nav nav-pills flex-column mb-auto gap-1">
          <li class="nav-item">
            <a routerLink="/staff/dashboard" routerLinkActive="active" class="nav-link text-white">
              <i class="bi bi-speedometer2 me-2"></i> Dashboard
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/staff/complaints" routerLinkActive="active" class="nav-link text-white d-flex justify-content-between align-items-center">
              <span><i class="bi bi-clipboard-check me-2"></i> My Work</span>
              <span *ngIf="assignedWorkCount > 0" class="badge bg-warning text-dark">{{ assignedWorkCount }}</span>
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/staff/notifications" routerLinkActive="active" class="nav-link text-white d-flex justify-content-between align-items-center">
              <span><i class="bi bi-bell me-2"></i> Notifications</span>
              <span *ngIf="unreadCount > 0" class="badge bg-danger">{{ unreadCount }}</span>
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/staff/profile" routerLinkActive="active" class="nav-link text-white">
              <i class="bi bi-person-badge me-2"></i> Profile
            </a>
          </li>
        </ul>

        <hr class="border-secondary my-3">
        <button (click)="logout()" class="btn btn-sm btn-outline-danger w-100">
          <i class="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </nav>

      <!-- Main Shell -->
      <div class="flex-grow-1 d-flex flex-column bg-light">
        <!-- Top Navbar -->
        <header class="bg-white border-bottom px-4 py-2 d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-secondary">Worker Portal</span>
            <span class="text-muted d-none d-sm-inline">|</span>
            <span class="fw-semibold text-dark">{{ user?.staffDetails?.department }}</span>
          </div>

          <div class="d-flex align-items-center gap-3">
            <div class="position-relative cursor-pointer" routerLink="/staff/notifications" style="cursor: pointer;">
              <i class="bi bi-bell-fill fs-5 text-secondary"></i>
              <span *ngIf="unreadCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ unreadCount }}
              </span>
            </div>

            <div class="d-flex align-items-center">
              <span class="fw-semibold text-dark me-2">{{ user?.name }}</span>
              <span class="badge bg-success">{{ user?.staffDetails?.category }}</span>
              <button (click)="logout()" class="btn btn-sm btn-outline-secondary ms-3 d-none d-sm-inline-block">
                Logout
              </button>
            </div>
          </div>
        </header>

        <!-- Dynamic View -->
        <main class="p-3 p-md-4 flex-grow-1 overflow-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class StaffLayoutComponent implements OnInit {
  user: User | null = null;
  unreadCount = 0;
  assignedWorkCount = 0;

  constructor(private storage: StorageService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
    this.refreshMetrics();
  }

  refreshMetrics(): void {
    if (!this.user) return;
    const notes = this.storage.get<Notification[]>('NOTIFICATIONS') || [];
    this.unreadCount = notes.filter(n => n.userId === this.user?.id && !n.isRead).length;

    const complaints = this.storage.get<any[]>('COMPLAINTS') || [];
    this.assignedWorkCount = complaints.filter(
      c => (c.assignedStaffId === this.user?.id || c.assignedStaff === this.user?.name) &&
           c.status !== 'Closed' && c.status !== 'Resolved'
    ).length;
  }

  logout(): void {
    this.storage.remove('CURRENT_USER');
    this.router.navigate(['/login']);
  }
}