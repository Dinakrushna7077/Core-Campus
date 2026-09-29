import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../core/services/storage.service';
import { User,Notification } from '../../core/models/campus.models';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule],
  template: `
    <div class="d-flex" style="min-height: 100vh;">
      <!-- Sidebar -->
      <nav class="bg-dark text-white p-3 d-none d-md-block" style="width: 250px;">
        <div class="d-flex align-items-center mb-4">
          <i class="bi bi-mortarboard-fill fs-3 text-warning me-2"></i>
          <span class="fs-5 fw-bold">CoreCampus</span>
        </div>

        <ul class="nav nav-pills flex-column mb-auto">
          <li *ngIf="user?.role === 'STUDENT'">
            <a routerLink="/student/dashboard" class="nav-link text-white"><i class="bi bi-grid-fill me-2"></i> Dashboard</a>
          </li>
          <li *ngIf="user?.role === 'STUDENT'">
            <a routerLink="/student/attendance" class="nav-link text-white"><i class="bi bi-check2-circle me-2"></i> Attendance</a>
          </li>
          <li *ngIf="user?.role === 'STUDENT'">
            <a routerLink="/student/timetable" class="nav-link text-white"><i class="bi bi-calendar-event me-2"></i> Timetable</a>
          </li>
          <li *ngIf="user?.role === 'STUDENT'">
            <a routerLink="/student/complaints" class="nav-link text-white"><i class="bi bi-tools me-2"></i> Complaints</a>
          </li>
          <li *ngIf="user?.role === 'STUDENT'">
            <a routerLink="/student/gate-pass" class="nav-link text-white"><i class="bi bi-door-open-fill me-2"></i> Gate Pass</a>
          </li>
          <li *ngIf="user?.role === 'STUDENT'">
            <a routerLink="/student/certificates" class="nav-link text-white"><i class="bi bi-file-earmark-text-fill me-2"></i> Certificates</a>
          </li>
          <li *ngIf="user?.role === 'STUDENT'">
            <a routerLink="/student/mess" class="nav-link text-white"><i class="bi bi-egg-fried me-2"></i> Mess Menu</a>
          </li>
          <li *ngIf="user?.role === 'STUDENT'">
            <a routerLink="/student/fees" class="nav-link text-white"><i class="bi bi-credit-card-2-front-fill me-2"></i> Dues & Fees</a>
          </li>
          <li *ngIf="user?.role === 'STUDENT'">
            <a routerLink="/student/notices" class="nav-link text-white"><i class="bi bi-megaphone-fill me-2"></i> Notices</a>
          </li>

          <!-- Admin Nav -->
          <li *ngIf="user?.role === 'ADMIN'">
            <a routerLink="/admin/dashboard" class="nav-link text-white"><i class="bi bi-speedometer2 me-2"></i> Command Center</a>
          </li>
          <li *ngIf="user?.role === 'ADMIN'">
            <a routerLink="/admin/complaints" class="nav-link text-white"><i class="bi bi-exclamation-triangle-fill me-2"></i> Complaints</a>
          </li>
          <li *ngIf="user?.role === 'ADMIN'">
            <a routerLink="/admin/requests" class="nav-link text-white"><i class="bi bi-inbox-fill me-2"></i> Request Hub</a>
          </li>
          <li *ngIf="user?.role === 'ADMIN'">
            <a routerLink="/admin/gate-passes" class="nav-link text-white"><i class="bi bi-shield-check me-2"></i> Gate Verify</a>
          </li>
          <li *ngIf="user?.role === 'ADMIN'">
            <a routerLink="/admin/notices" class="nav-link text-white"><i class="bi bi-send-check-fill me-2"></i> Send Notices</a>
          </li>
          <li *ngIf="user?.role === 'ADMIN'">
            <a routerLink="/admin/audit-log" class="nav-link text-white"><i class="bi bi-journal-text me-2"></i> Audit Trail</a>
          </li>
          <li *ngIf="user?.role === 'ADMIN'">
            <a routerLink="/admin/service-desk" class="nav-link text-white"><i class="bi bi-headset me-2"></i> Service Desk</a>
          </li>
        </ul>

        <hr>
        <div class="small text-secondary mb-2">Language Demo:</div>
        <select class="form-select form-select-sm bg-dark text-white border-secondary mb-3" [(ngModel)]="currentLang" (change)="changeLang()">
          <option value="en">English</option>
          <option value="or">ଓଡ଼ିଆ (Odia)</option>
          <option value="hi">हिन्दी (Hindi)</option>
        </select>

        <button *ngIf="user?.role === 'ADMIN'" (click)="resetDemo()" class="btn btn-sm btn-outline-danger w-100">
          <i class="bi bi-arrow-counterclockwise"></i> Reset Demo Data
        </button>
      </nav>

      <!-- Main Layout -->
      <div class="flex-grow-1 d-flex flex-column">
        <!-- Top Navbar -->
        <header class="bg-white border-bottom px-4 py-2 d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-3">
            <span class="badge" [ngClass]="isOnline ? 'bg-success' : 'bg-warning text-dark'">
              {{ isOnline ? 'ONLINE' : 'OFFLINE (Demo Sync)' }}
            </span>
          </div>

          <div class="d-flex align-items-center gap-3">
            <div class="position-relative cursor-pointer" (click)="goToNotifications()">
              <i class="bi bi-bell-fill fs-5 text-secondary"></i>
              <span *ngIf="unreadCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ unreadCount }}
              </span>
            </div>

            <div class="dropdown">
              <span class="fw-semibold text-dark">{{ user?.name }}</span>
              <span class="badge bg-primary ms-2">{{ user?.role }}</span>
              <button (click)="logout()" class="btn btn-sm btn-outline-secondary ms-3">
                <i class="bi bi-box-arrow-right"></i> Logout
              </button>
            </div>
          </div>
        </header>

        <!-- Dynamic Content -->
        <main class="p-4 bg-light flex-grow-1 overflow-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent implements OnInit {
  user: User | null = null;
  unreadCount = 0;
  isOnline = navigator.onLine;
  currentLang = 'en';

  constructor(private storage: StorageService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
    this.currentLang = this.storage.get<string>('LANG') || 'en';
    this.refreshNotifications();

    window.addEventListener('online', () => this.isOnline = true);
    window.addEventListener('offline', () => this.isOnline = false);
  }

  refreshNotifications(): void {
    const list = this.storage.get<Notification[]>('NOTIFICATIONS') || [];
    this.unreadCount = list.filter(n => n.userId === this.user?.id && !n.isRead).length;
  }

  goToNotifications(): void {
    if (this.user?.role === 'STUDENT') {
      this.router.navigate(['/student/notifications']);
    }
  }

  changeLang(): void {
    this.storage.set('LANG', this.currentLang);
  }

  resetDemo(): void {
    if (confirm('This will delete all local demo changes and restore the original hackathon dataset.')) {
      this.storage.clearAllDemoData();
      window.location.reload();
    }
  }

  logout(): void {
    this.storage.remove('CURRENT_USER');
    this.router.navigate(['/login']);
  }
}