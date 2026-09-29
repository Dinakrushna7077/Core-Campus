import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { User } from '../../../core/models/campus.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3">
      <div class="card shadow-sm border-0 p-4" style="max-width: 420px; width: 100%;">
        <div class="text-center mb-4">
          <i class="bi bi-mortarboard-fill text-primary" style="font-size: 2.75rem;"></i>
          <h3 class="fw-bold text-dark mt-2 mb-0">CampusOne</h3>
          <p class="text-muted small">One Campus, One Digital Workflow</p>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger py-2 small" role="alert">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="login()">
          <div class="mb-3">
            <label class="form-label small fw-semibold">Email Address</label>
            <input
              type="email"
              class="form-control"
              [(ngModel)]="email"
              name="email"
              placeholder="e.g. student@campusone.demo"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold">Password</label>
            <input
              type="password"
              class="form-control"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold">
            Sign In
          </button>
        </form>

        <hr class="my-4 text-muted" />

        <div class="small fw-semibold text-secondary mb-2 text-center">Quick Hackathon Demo Logins:</div>
        <div class="d-grid gap-2">
          <button
            type="button"
            class="btn btn-outline-primary btn-sm text-start d-flex justify-content-between align-items-center"
            (click)="quickFill('student')"
          >
            <span><strong>Student:</strong> Dinakrushna (MCA)</span>
            <i class="bi bi-arrow-right"></i>
          </button>
          <button
            type="button"
            class="btn btn-outline-dark btn-sm text-start d-flex justify-content-between align-items-center"
            (click)="quickFill('admin')"
          >
            <span><strong>Admin:</strong> Campus Administrator</span>
            <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private storage: StorageService, private router: Router) {}

  quickFill(role: 'student' | 'admin'): void {
    if (role === 'student') {
      this.email = 'student@campusone.demo';
      this.password = 'student123';
    } else {
      this.email = 'admin@campusone.demo';
      this.password = 'admin123';
    }
    this.login();
  }

  login(): void {
    this.errorMessage = '';
    const users = this.storage.get<User[]>('USERS') || [];
    const matched = users.find(u => u.email === this.email && u.password === this.password);

    if (!matched) {
      this.errorMessage = 'Invalid email or password.';
      return;
    }

    this.storage.set('CURRENT_USER', matched);

    if (matched.role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/student/dashboard']);
    }
  }
}