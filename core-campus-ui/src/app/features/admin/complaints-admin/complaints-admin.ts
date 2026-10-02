import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { ComplaintService } from '../../../core/services/complaint.service.ts';
import { Complaint,Staff } from '../../../core/models/campus.models';
import { AuditNotificationService } from '../../../core/services/audit-notification.service';

interface StaffWorkloadItem {
  staff: Staff;
  activeWorkload: number;
}

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <h4 class="fw-bold mb-4">Facility Complaints Operations</h4>

      <div class="card border-0 shadow-sm p-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Category</th>
                <th>Location</th>
                <th>Age</th>
                <th>Priority</th>
                <th>Assigned Staff</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of complaints">
                <td><strong>{{ item.id }}</strong></td>
                <td>{{ item.studentName }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.location }} ({{ item.room }})</td>
                <td><span class="badge bg-secondary">{{ getAge(item.createdAt) }}d</span></td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-danger': item.priority === 'High',
                    'bg-warning text-dark': item.priority === 'Medium',
                    'bg-info': item.priority === 'Low'
                  }">{{ item.priority }}</span>
                </td>
                <td>
                  <span *ngIf="item.assignedStaffName || item.assignedStaff" class="badge bg-primary">
                    {{ item.assignedStaffName || item.assignedStaff }}
                  </span>
                  <span *ngIf="!item.assignedStaffName && !item.assignedStaff" class="badge bg-warning text-dark">
                    Unassigned
                  </span>
                </td>
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
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" (click)="openAssignModal(item)">
                      <i class="bi bi-person-plus-fill"></i> Assign
                    </button>
                    <button class="btn btn-outline-secondary" (click)="activeNote = item">
                      Note
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Assign Staff Modal / Card -->
      <div *ngIf="assigningComplaint" class="card border-primary shadow mt-4 p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0 text-primary">
            <i class="bi bi-person-check-fill me-2"></i> Assign Staff to {{ assigningComplaint.id }} ({{ assigningComplaint.category }})
          </h5>
          <button class="btn-close" (click)="assigningComplaint = null"></button>
        </div>

        <!-- Automatic Suggestion Banner -->
        <div *ngIf="suggestedStaff" class="alert alert-success d-flex justify-content-between align-items-center py-2 mb-3">
          <div>
            <i class="bi bi-lightning-charge-fill text-warning me-1"></i>
            <strong>Intelligent Suggestion:</strong> {{ suggestedStaff.name }} ({{ suggestedStaff.category }})
            <span class="small text-muted ms-2">— Active Tasks: {{ getActiveWorkload(suggestedStaff.staffId) }}</span>
          </div>
          <button class="btn btn-sm btn-success" (click)="selectedStaffId = suggestedStaff.staffId; confirmAssignment()">
            Quick Assign Suggested
          </button>
        </div>

        <div class="row g-3">
          <div class="col-md-7">
            <label class="form-label small fw-semibold">Select Worker / Maintenance Team</label>
            <select class="form-select" [(ngModel)]="selectedStaffId">
              <option value="">-- Choose Team Member --</option>
              <option *ngFor="let s of staffList" [value]="s.staffId">
                {{ s.name }} ({{ s.category }}) — Active Workload: {{ getActiveWorkload(s.staffId) }}
              </option>
            </select>
          </div>
          <div class="col-md-5 d-flex align-items-end gap-2">
            <button class="btn btn-primary" [disabled]="!selectedStaffId" (click)="confirmAssignment()">
              <i class="bi bi-check-lg"></i> Confirm Assignment
            </button>
            <button class="btn btn-outline-secondary" (click)="assigningComplaint = null">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Note Dialog -->
      <div *ngIf="activeNote" class="card border-secondary p-3 mt-3 shadow-sm">
        <h6 class="fw-bold">Internal Note for {{ activeNote.id }}</h6>
        <textarea class="form-control mb-2" [(ngModel)]="activeNote.adminNote" placeholder="Write internal technician instruction..."></textarea>
        <div>
          <button class="btn btn-primary btn-sm me-2" (click)="saveNote(activeNote); activeNote = null">Save Note</button>
          <button class="btn btn-secondary btn-sm" (click)="activeNote = null">Cancel</button>
        </div>
      </div>
    </div>
  `
})
export class AdminComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  staffList: Staff[] = [];
  activeNote: Complaint | null = null;
  assigningComplaint: Complaint | null = null;
  suggestedStaff: Staff | null = null;
  selectedStaffId = '';

  constructor(
    private storage: StorageService,
    private complaintService: ComplaintService,
    private audit: AuditNotificationService
  ) {}

  ngOnInit(): void {
    this.staffList = this.storage.get<Staff[]>('STAFF_MEMBERS') || [];
    this.loadData();
  }

  loadData(): void {
    this.complaints = this.complaintService.getAll();
  }

  getAge(dateStr: string): number {
    return this.complaintService.calculateAge(dateStr);
  }

  getActiveWorkload(staffId: string): number {
    const list = this.storage.get<Complaint[]>('COMPLAINTS') || [];
    return list.filter(
      c => c.assignedStaffId === staffId &&
           (c.status === 'Assigned' || c.status === 'Accepted' || c.status === 'In Progress')
    ).length;
  }

  openAssignModal(c: Complaint): void {
    this.assigningComplaint = c;
    this.selectedStaffId = '';

    // Automatic suggestion logic
    const categoryMap: { [key: string]: string } = {
      Plumbing: 'Plumbing',
      Electrical: 'Electrical',
      Cleaning: 'Cleaning',
      Carpentry: 'Carpentry',
      Furniture: 'Carpentry',
      Hostel: 'Hostel',
      Security: 'Security'
    };

    const targetCategory = categoryMap[c.category] || 'Plumbing';
    const matches = this.staffList.filter(s => s.category.toLowerCase() === targetCategory.toLowerCase());

    if (matches.length > 0) {
      // Pick staff with lowest active workload
      matches.sort((a, b) => this.getActiveWorkload(a.staffId) - this.getActiveWorkload(b.staffId));
      this.suggestedStaff = matches[0];
      this.selectedStaffId = this.suggestedStaff.staffId;
    } else {
      this.suggestedStaff = this.staffList[0] || null;
    }
  }

  confirmAssignment(): void {
    if (!this.assigningComplaint || !this.selectedStaffId) return;
    const staff = this.staffList.find(s => s.staffId === this.selectedStaffId);
    if (!staff) return;

    this.assigningComplaint.status = 'Assigned';
    this.assigningComplaint.assignedStaff = staff.name;
    this.assigningComplaint.assignedStaffId = staff.staffId;
    this.assigningComplaint.assignedStaffName = staff.name;
    this.assigningComplaint.assignedAt = new Date().toISOString();

    this.complaintService.update(this.assigningComplaint, 'Campus Administrator');

    // Notify Staff
    this.audit.notify(
      staff.staffId,
      'New Work Assigned',
      `${this.assigningComplaint.title || this.assigningComplaint.category + ' Issue'} in ${this.assigningComplaint.location} Room ${this.assigningComplaint.room}. Assigned by: Campus Admin`,
      'COMPLAINT'
    );

    // Audit log
    this.audit.logAudit(
      'Campus Administrator',
      'Complaint Assigned',
      'Complaint',
      this.assigningComplaint.id,
      `Admin assigned ${this.assigningComplaint.id} to ${staff.name}.`
    );

    this.assigningComplaint = null;
    this.loadData();
  }

  saveNote(item: Complaint): void {
    this.complaintService.update(item, 'Campus Administrator');
    this.loadData();
  }
}