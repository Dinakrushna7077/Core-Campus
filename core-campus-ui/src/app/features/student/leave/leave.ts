import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { AuditNotificationService } from '../../../core/services/audit-notification.service';
import { LeaveRequest,User } from '../../../core/models/campus.models';

@Component({
  selector: 'app-student-leave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold mb-0">Hostel & Academic Leave Application</h4>
        <button class="btn btn-primary" (click)="showForm = !showForm">
          <i class="bi bi-calendar-plus"></i> {{ showForm ? 'Close' : 'Apply For Leave' }}
        </button>
      </div>

      <div *ngIf="showForm" class="card border-0 shadow-sm p-4 mb-4">
        <h5 class="fw-bold mb-3">Leave Request Form</h5>
        <form (ngSubmit)="applyLeave()">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label small fw-semibold">From Date</label>
              <input type="date" class="form-control" [(ngModel)]="form.fromDate" name="fromDate" required>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-semibold">To Date</label>
              <input type="date" class="form-control" [(ngModel)]="form.toDate" name="toDate" required>
            </div>
            <div class="col-12">
              <label class="form-label small fw-semibold">Reason for Absence</label>
              <textarea class="form-control" rows="3" [(ngModel)]="form.reason" name="reason" placeholder="State reason..." required></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-success mt-3"><i class="bi bi-send-fill"></i> Submit Leave Request</button>
        </form>
      </div>

      <div class="card border-0 shadow-sm p-3">
        <h5 class="fw-bold mb-3">My Applications</h5>
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Req ID</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Applied On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of requests">
                <td><strong>{{ item.id }}</strong></td>
                <td>{{ item.fromDate }} to {{ item.toDate }}</td>
                <td>{{ item.reason }}</td>
                <td>{{ item.createdAt | date:'shortDate' }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-warning text-dark': item.status === 'Pending',
                    'bg-success': item.status === 'Approved',
                    'bg-danger': item.status === 'Rejected'
                  }">{{ item.status }}</span>
                </td>
              </tr>
              <tr *ngIf="requests.length === 0">
                <td colspan="5" class="text-center text-muted py-3">No leave applications found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class StudentLeaveComponent implements OnInit {
  showForm = false;
  user: User | null = null;
  requests: LeaveRequest[] = [];
  form = { fromDate: '', toDate: '', reason: '' };

  constructor(private storage: StorageService, private audit: AuditNotificationService) {}

  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
    this.loadData();
  }

  loadData(): void {
    const all = this.storage.get<LeaveRequest[]>('LEAVE_REQUESTS') || [];
    this.requests = all.filter(r => r.studentId === this.user?.id);
  }

  applyLeave(): void {
    if (!this.form.fromDate || !this.form.toDate || !this.form.reason) return;
    const all = this.storage.get<LeaveRequest[]>('LEAVE_REQUESTS') || [];
    const newReq: LeaveRequest = {
      id: 'LV' + Math.floor(1000 + Math.random() * 9000),
      studentId: this.user?.id || 'STU001',
      studentName: this.user?.name || 'Dinakrushna Mohanta',
      fromDate: this.form.fromDate,
      toDate: this.form.toDate,
      reason: this.form.reason,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    all.unshift(newReq);
    this.storage.set('LEAVE_REQUESTS', all);
    this.audit.logAudit(this.user?.name || 'Student', 'Applied for Leave', 'LeaveRequest', newReq.id, `${newReq.fromDate} to ${newReq.toDate}`);
    this.showForm = false;
    this.form = { fromDate: '', toDate: '', reason: '' };
    this.loadData();
  }
}