import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../../core/services/complaint.service.ts';
import { StorageService } from '../../../core/services/storage.service.js';
import { Complaint,User } from '../../../core/models/campus.models.js';
import { AuditNotificationService } from '../../../core/services/audit-notification.service.js';

@Component({
  selector: 'app-student-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold">Hostel & Facility Complaints</h4>
        <button class="btn btn-primary" (click)="showForm = !showForm">
          <i class="bi bi-plus-lg"></i> {{ showForm ? 'Close Form' : 'New Complaint' }}
        </button>
      </div>

      <!-- New Complaint Form -->
      <div *ngIf="showForm" class="card p-4 mb-4 border-primary shadow-sm">
        <h5 class="fw-bold mb-3">Lodge a Maintenance Complaint</h5>
        <form (ngSubmit)="submitComplaint()">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Complaint Title</label>
              <input type="text" class="form-control" [(ngModel)]="newComplaint.title" name="title" placeholder="e.g. Water leakage in Hostel A" required>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Category</label>
              <select class="form-select" [(ngModel)]="newComplaint.category" name="category" required>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Wi-Fi">Wi-Fi</option>
                <option value="Hostel">Hostel</option>
                <option value="Security">Security</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-semibold">Location / Hostel</label>
              <input type="text" class="form-control" [(ngModel)]="newComplaint.location" name="location" required>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-semibold">Room No.</label>
              <input type="text" class="form-control" [(ngModel)]="newComplaint.room" name="room" required>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-semibold">Priority</label>
              <select class="form-select" [(ngModel)]="newComplaint.priority" name="priority">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label small fw-semibold">Description</label>
              <textarea class="form-control" rows="3" [(ngModel)]="newComplaint.description" name="description" placeholder="Explain the problem in detail..." required></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-success mt-3"><i class="bi bi-send-fill"></i> Submit Complaint</button>
        </form>
      </div>

      <!-- Complaints List -->
      <div class="card p-3 border-0 shadow-sm">
        <h5 class="fw-bold mb-3">Your Lodged Complaints</h5>
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Title / Category</th>
                <th>Location</th>
                <th>Assigned Staff</th>
                <th>Age</th>
                <th>Status</th>
                <th>Resolution / Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of myComplaints">
                <td><strong>{{ item.id }}</strong></td>
                <td>
                  <div class="fw-semibold">{{ item.title || item.category + ' Issue' }}</div>
                  <small class="badge bg-light text-dark border">{{ item.category }}</small>
                </td>
                <td>{{ item.location }} (Room {{ item.room }})</td>
                <td>{{ item.assignedStaffName || item.assignedStaff || 'Pending Admin Review' }}</td>
                <td>{{ getAge(item.createdAt) }}d</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-warning text-dark': item.status === 'Pending' || item.status === 'Assigned',
                    'bg-info': item.status === 'Accepted',
                    'bg-danger': item.status === 'In Progress',
                    'bg-success': item.status === 'Resolved' || item.status === 'Closed',
                    'bg-dark': item.status === 'Reopened'
                  }">{{ item.status }}</span>
                </td>
                <td>
                  <div *ngIf="item.status === 'Resolved'">
                    <div class="small mb-1">
                      <strong>Resolved By:</strong> {{ item.assignedStaffName || item.assignedStaff }}<br>
                      <strong>Resolution:</strong> {{ item.resolutionNote }}
                    </div>
                    <div class="d-flex gap-1">
                      <button class="btn btn-sm btn-success" (click)="confirmResolution(item)">
                        <i class="bi bi-check-lg"></i> Confirm Resolution
                      </button>
                      <button class="btn btn-sm btn-outline-danger" (click)="openReopenModal(item)">
                        Reopen
                      </button>
                    </div>
                  </div>
                  <span *ngIf="item.status === 'Closed'" class="text-success small fw-semibold">
                    <i class="bi bi-check-circle-fill"></i> Closed & Verified
                  </span>
                  <span *ngIf="item.status !== 'Resolved' && item.status !== 'Closed'" class="text-muted small">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reopen Modal -->
      <div *ngIf="reopeningComplaint" class="card border-danger shadow p-4 mt-3">
        <h6 class="fw-bold text-danger">Reopen Complaint {{ reopeningComplaint.id }}</h6>
        <div class="mb-3">
          <label class="form-label small">State reason why the issue was not fully resolved:</label>
          <input type="text" class="form-control" [(ngModel)]="reopenReason" placeholder="e.g. Tap is still dripping slowly.">
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-danger btn-sm" (click)="confirmReopen()">Submit Reopen</button>
          <button class="btn btn-secondary btn-sm" (click)="reopeningComplaint = null">Cancel</button>
        </div>
      </div>
    </div>
  `
})
export class StudentComplaintsComponent implements OnInit {
  showForm = false;
  user: User | null = null;
  myComplaints: Complaint[] = [];
  reopeningComplaint: Complaint | null = null;
  reopenReason = '';
  newComplaint: any = {
    title: '',
    category: 'Plumbing',
    location: 'Hostel A - Room A-204',
    room: 'A-204',
    priority: 'High',
    description: ''
  };

  constructor(
    private complaintService: ComplaintService,
    private storage: StorageService,
    private audit: AuditNotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.myComplaints = this.complaintService.getAll().filter(c => c.studentId === this.user?.id);
  }

  getAge(dateStr: string): number {
    return this.complaintService.calculateAge(dateStr);
  }

  submitComplaint(): void {
    this.complaintService.create({
      ...this.newComplaint,
      title: this.newComplaint.title || `${this.newComplaint.category} issue in ${this.newComplaint.location}`,
      studentId: this.user?.id,
      studentName: this.user?.name
    });
    this.showForm = false;
    this.newComplaint.description = '';
    this.newComplaint.title = '';
    this.loadComplaints();
  }

  confirmResolution(c: Complaint): void {
    c.status = 'Closed';
    c.closedAt = new Date().toISOString();
    this.complaintService.update(c, this.user?.name || 'Student');

    this.audit.logAudit(
      this.user?.name || 'Student',
      'Complaint Closed',
      'Complaint',
      c.id,
      `Student confirmed resolution of ${c.id}. Complaint Closed.`
    );

    if (c.assignedStaffId) {
      this.audit.notify(
        c.assignedStaffId,
        'Resolution Confirmed',
        `Student confirmed resolution for ${c.id}. Job is officially closed.`,
        'COMPLAINT'
      );
    }

    this.loadComplaints();
  }

  openReopenModal(c: Complaint): void {
    this.reopeningComplaint = c;
    this.reopenReason = '';
  }

  confirmReopen(): void {
    if (!this.reopeningComplaint) return;
    this.reopeningComplaint.status = 'Reopened';
    this.reopeningComplaint.reopenReason = this.reopenReason;
    this.complaintService.update(this.reopeningComplaint, this.user?.name || 'Student');

    this.audit.logAudit(
      this.user?.name || 'Student',
      'Complaint Reopened',
      'Complaint',
      this.reopeningComplaint.id,
      `Student reopened ${this.reopeningComplaint.id}: ${this.reopenReason}`
    );

    // Notify Admin and Staff
    this.audit.notify('ADM001', 'Complaint Reopened', `Complaint ${this.reopeningComplaint.id} has been reopened by student.`, 'COMPLAINT');
    if (this.reopeningComplaint.assignedStaffId) {
      this.audit.notify(this.reopeningComplaint.assignedStaffId, 'Complaint Reopened', `Student reopened ${this.reopeningComplaint.id}: ${this.reopenReason}`, 'COMPLAINT');
    }

    this.reopeningComplaint = null;
    this.loadComplaints();
  }
}