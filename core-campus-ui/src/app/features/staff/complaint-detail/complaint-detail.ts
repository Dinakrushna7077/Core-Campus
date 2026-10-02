import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { AuditNotificationService } from '../../../core/services/audit-notification.service';
import { Complaint,User } from '../../../core/models/campus.models';

@Component({
  selector: 'app-staff-complaint-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-fluid" *ngIf="complaint">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="/staff/complaints" class="text-decoration-none small text-secondary">
            <i class="bi bi-arrow-left"></i> Back to My Work
          </a>
          <h4 class="fw-bold mt-1 mb-0">{{ complaint.id }} — {{ complaint.title || complaint.category + ' Issue' }}</h4>
        </div>
        <span class="badge fs-6" [ngClass]="{
          'bg-warning text-dark': complaint.status === 'Assigned',
          'bg-info': complaint.status === 'Accepted',
          'bg-danger': complaint.status === 'In Progress',
          'bg-success': complaint.status === 'Resolved' || complaint.status === 'Closed',
          'bg-dark': complaint.status === 'Reopened'
        }">{{ complaint.status }}</span>
      </div>

      <!-- Action Panel Header -->
      <div class="card border-0 shadow-sm p-4 mb-4 bg-white">
        <h6 class="fw-bold mb-3"><i class="bi bi-gear-fill me-2 text-primary"></i> Action Center</h6>

        <!-- Step 1: Newly Assigned -->
        <div *ngIf="complaint.status === 'Assigned' || complaint.status === 'Reopened'" class="d-flex flex-wrap gap-2 align-items-center">
          <button class="btn btn-success" (click)="acceptWork()">
            <i class="bi bi-check-circle-fill me-1"></i> Accept Work
          </button>
          <button class="btn btn-outline-danger" (click)="showRejectModal = true">
            <i class="bi bi-x-circle me-1"></i> Reject Assignment
          </button>
          <span class="text-muted small ms-2">Accepting confirms you have taken ownership of this task.</span>
        </div>

        <!-- Step 2: Accepted -->
        <div *ngIf="complaint.status === 'Accepted'" class="d-flex flex-wrap gap-2 align-items-center">
          <button class="btn btn-danger" (click)="startWork()">
            <i class="bi bi-play-circle-fill me-1"></i> Start Work
          </button>
          <span class="text-muted small ms-2">Click when you are physically on site / starting the repair.</span>
        </div>

        <!-- Step 3: In Progress -->
        <div *ngIf="complaint.status === 'In Progress'">
          <div class="row g-2 align-items-end">
            <div class="col-md-8">
              <label class="form-label small fw-semibold">Mandatory Resolution Note</label>
              <input
                type="text"
                class="form-control"
                [(ngModel)]="resolutionNote"
                placeholder="e.g. Water leakage repaired and pipe connection fixed."
              >
            </div>
            <div class="col-md-4">
              <button class="btn btn-success w-100" (click)="resolveWork()">
                <i class="bi bi-check2-all me-1"></i> Mark as Resolved
              </button>
            </div>
          </div>
          <small class="text-muted mt-2 d-block">
            Writing a clear note notifies the student and requests their confirmation.
          </small>
        </div>

        <!-- Completed / Closed -->
        <div *ngIf="complaint.status === 'Resolved'" class="alert alert-success mb-0 py-2">
          <i class="bi bi-info-circle-fill me-2"></i> Marked as Resolved. Waiting for student confirmation or reopening.
          <div class="mt-1 small"><strong>Resolution Note:</strong> {{ complaint.resolutionNote }}</div>
        </div>

        <div *ngIf="complaint.status === 'Closed'" class="alert alert-secondary mb-0 py-2">
          <i class="bi bi-check-circle-fill me-2 text-success"></i> This complaint has been verified and closed by the student.
        </div>
      </div>

      <!-- Rejection Form Modal / Box -->
      <div *ngIf="showRejectModal" class="card border-danger shadow-sm p-4 mb-4">
        <h6 class="fw-bold text-danger mb-2"><i class="bi bi-exclamation-triangle-fill me-1"></i> Reject Assignment</h6>
        <p class="small text-muted mb-2">Provide reason for returning this task to the Admin queue:</p>
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            [(ngModel)]="rejectionReason"
            placeholder="e.g. This issue requires electrical maintenance instead of plumbing."
          >
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-danger btn-sm" (click)="confirmReject()">Confirm Rejection</button>
          <button class="btn btn-secondary btn-sm" (click)="showRejectModal = false">Cancel</button>
        </div>
      </div>

      <div class="row g-4">
        <!-- Details Column -->
        <div class="col-lg-7">
          <div class="card border-0 shadow-sm p-4 mb-4">
            <h6 class="fw-bold mb-3 text-secondary">COMPLAINT INFORMATION</h6>
            <div class="row g-3">
              <div class="col-sm-6">
                <span class="text-muted small d-block">Complaint ID</span>
                <strong>{{ complaint.id }}</strong>
              </div>
              <div class="col-sm-6">
                <span class="text-muted small d-block">Category & Priority</span>
                <span class="badge bg-secondary me-1">{{ complaint.category }}</span>
                <span class="badge bg-danger">{{ complaint.priority }}</span>
              </div>
              <div class="col-sm-6">
                <span class="text-muted small d-block">Location</span>
                <strong>{{ complaint.location }}</strong>
              </div>
              <div class="col-sm-6">
                <span class="text-muted small d-block">Room No.</span>
                <strong>{{ complaint.room }}</strong>
              </div>
              <div class="col-12">
                <span class="text-muted small d-block">Description</span>
                <div class="p-3 bg-light rounded mt-1">{{ complaint.description }}</div>
              </div>
            </div>

            <hr class="my-3">

            <h6 class="fw-bold mb-3 text-secondary">STUDENT DETAILS</h6>
            <div class="row g-2">
              <div class="col-sm-6">
                <span class="text-muted small d-block">Student Name</span>
                <strong>{{ complaint.studentName }}</strong>
              </div>
              <div class="col-sm-6">
                <span class="text-muted small d-block">Student ID</span>
                <strong>{{ complaint.studentId }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Assignment Timeline Column -->
        <div class="col-lg-5">
          <div class="card border-0 shadow-sm p-4">
            <h6 class="fw-bold mb-3 text-secondary">LIFECYCLE TIMELINE</h6>
            <ul class="list-unstyled position-relative border-start border-2 border-primary ms-2 ps-3">
              <li class="mb-3">
                <div class="fw-bold small">Complaint Created</div>
                <div class="text-muted small">{{ complaint.createdAt | date:'medium' }}</div>
              </li>
              <li class="mb-3" *ngIf="complaint.assignedAt">
                <div class="fw-bold small text-primary">Assigned to {{ complaint.assignedStaffName || complaint.assignedStaff }}</div>
                <div class="text-muted small">{{ complaint.assignedAt | date:'medium' }}</div>
              </li>
              <li class="mb-3" *ngIf="complaint.acceptedAt">
                <div class="fw-bold small text-info">Accepted by Staff</div>
                <div class="text-muted small">{{ complaint.acceptedAt | date:'medium' }}</div>
              </li>
              <li class="mb-3" *ngIf="complaint.startedAt">
                <div class="fw-bold small text-danger">Work Started (In Progress)</div>
                <div class="text-muted small">{{ complaint.startedAt | date:'medium' }}</div>
              </li>
              <li class="mb-3" *ngIf="complaint.resolvedAt">
                <div class="fw-bold small text-success">Marked Resolved</div>
                <div class="text-muted small">{{ complaint.resolvedAt | date:'medium' }}</div>
                <div class="small text-dark mt-1"><em>"{{ complaint.resolutionNote }}"</em></div>
              </li>
              <li class="mb-2" *ngIf="complaint.closedAt">
                <div class="fw-bold small text-secondary">Verified & Closed</div>
                <div class="text-muted small">{{ complaint.closedAt | date:'medium' }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StaffComplaintDetailComponent implements OnInit {
  complaintId = '';
  complaint: Complaint | null = null;
  user: User | null = null;
  resolutionNote = 'Water leakage repaired and pipe connection fixed.';
  showRejectModal = false;
  rejectionReason = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private audit: AuditNotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
    this.complaintId = this.route.snapshot.paramMap.get('id') || '';
    this.loadComplaint();
  }

  loadComplaint(): void {
    const list = this.storage.get<Complaint[]>('COMPLAINTS') || [];
    this.complaint = list.find(c => c.id === this.complaintId) || null;
  }

  private saveComplaint(actionName: string, desc: string): void {
    if (!this.complaint) return;
    const list = this.storage.get<Complaint[]>('COMPLAINTS') || [];
    const idx = list.findIndex(c => c.id === this.complaint?.id);
    if (idx !== -1) {
      list[idx] = this.complaint;
      this.storage.set('COMPLAINTS', list);
      this.audit.logAudit(
        this.user?.name || 'Staff Team',
        actionName,
        'Complaint',
        this.complaint.id,
        desc
      );
    }
  }

  acceptWork(): void {
    if (!this.complaint) return;
    this.complaint.status = 'Accepted';
    this.complaint.acceptedAt = new Date().toISOString();
    this.saveComplaint('Assignment Accepted', `${this.user?.name} accepted work for ${this.complaint.id}`);
    this.audit.notify('ADM001', 'Staff Accepted Task', `${this.user?.name} accepted assignment for ${this.complaint.id}`, 'COMPLAINT');
    this.loadComplaint();
  }

  startWork(): void {
    if (!this.complaint) return;
    this.complaint.status = 'In Progress';
    this.complaint.startedAt = new Date().toISOString();
    this.saveComplaint('Work Started', `${this.user?.name} marked ${this.complaint.id} as In Progress.`);
    this.audit.notify(this.complaint.studentId, 'Repair In Progress', `${this.user?.name} has begun work on your complaint ${this.complaint.id}`, 'COMPLAINT');
    this.loadComplaint();
  }

  resolveWork(): void {
    if (!this.complaint) return;
    if (!this.resolutionNote.trim()) {
      alert('Please enter a resolution note before marking as resolved.');
      return;
    }
    this.complaint.status = 'Resolved';
    this.complaint.resolvedAt = new Date().toISOString();
    this.complaint.resolutionNote = this.resolutionNote;
    this.saveComplaint('Complaint Resolved', `${this.user?.name} resolved ${this.complaint.id}: ${this.resolutionNote}`);

    // Notify student
    this.audit.notify(
      this.complaint.studentId,
      'Complaint Resolved',
      `Your complaint ${this.complaint.id} has been resolved by ${this.user?.name}. Please confirm resolution.`,
      'COMPLAINT'
    );

    // Notify admin
    this.audit.notify('ADM001', 'Complaint Resolved by Staff', `${this.user?.name} marked ${this.complaint.id} resolved.`, 'COMPLAINT');
    this.loadComplaint();
  }

  confirmReject(): void {
    if (!this.complaint) return;
    const reason = this.rejectionReason.trim() || 'Worker team unable to take task at this time.';
    this.complaint.status = 'Pending';
    this.complaint.assignedStaff = undefined;
    this.complaint.assignedStaffId = undefined;
    this.complaint.assignedStaffName = undefined;
    this.complaint.rejectionReason = reason;

    this.saveComplaint('Assignment Rejected', `${this.user?.name} rejected assignment for ${this.complaint.id}: ${reason}`);

    // Notify Admin to reassign
    this.audit.notify(
      'ADM001',
      'Staff Assignment Rejected',
      `${this.user?.name} rejected ${this.complaint.id}. Reason: ${reason}. Please reassign.`,
      'COMPLAINT'
    );

    this.showRejectModal = false;
    this.router.navigate(['/staff/complaints']);
  }
}