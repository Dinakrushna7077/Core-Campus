import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../../core/services/complaint.service.ts';
import { StorageService } from '../../../core/services/storage.service.js';
import { Complaint,User } from '../../../core/models/campus.models.js';

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
      <div *ngIf="showForm" class="card p-3 mb-4 border-primary">
        <h5 class="fw-bold mb-3">Lodge a Maintenance Complaint</h5>
        <form (ngSubmit)="submitComplaint()">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Category</label>
              <select class="form-select" [(ngModel)]="newComplaint.category" name="category" required>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Wi-Fi">Wi-Fi</option>
                <option value="Furniture">Furniture</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Location / Hostel</label>
              <input type="text" class="form-control" [(ngModel)]="newComplaint.location" name="location" required>
            </div>
            <div class="col-md-4">
              <label class="form-label">Room No.</label>
              <input type="text" class="form-control" [(ngModel)]="newComplaint.room" name="room" required>
            </div>
            <div class="col-12">
              <label class="form-label">Description</label>
              <textarea class="form-control" rows="3" [(ngModel)]="newComplaint.description" name="description" placeholder="Explain the problem..." required></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-success mt-3"><i class="bi bi-send-fill"></i> Submit Complaint</button>
        </form>
      </div>

      <!-- Complaint Tracker List -->
      <div class="card p-3">
        <h5 class="fw-bold mb-3">Your Lodged Complaints</h5>
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Age</th>
                <th>Status</th>
                <th>Assigned Staff</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of myComplaints">
                <td><strong>{{ item.id }}</strong></td>
                <td>{{ item.category }}</td>
                <td>{{ item.description }}</td>
                <td>{{ getAge(item.createdAt) }} days ago</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-warning text-dark': item.status === 'Pending',
                    'bg-info': item.status === 'Assigned' || item.status === 'In Progress',
                    'bg-success': item.status === 'Resolved' || item.status === 'Closed'
                  }">{{ item.status }}</span>
                </td>
                <td>{{ item.assignedStaff || 'Unassigned' }}</td>
                <td>
                  <button *ngIf="item.status === 'Resolved'" class="btn btn-sm btn-outline-success me-1" (click)="confirmResolved(item)">
                    Confirm Fix (Close)
                  </button>
                  <button *ngIf="item.status === 'Resolved'" class="btn btn-sm btn-outline-danger" (click)="reopen(item)">
                    Reopen
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class StudentComplaintsComponent implements OnInit {
  showForm = false;
  user: User | null = null;
  myComplaints: Complaint[] = [];
  newComplaint: any = { category: 'Plumbing', location: 'Hostel A', room: 'A-204', description: '' };

  constructor(private complaintService: ComplaintService, private storage: StorageService) {}

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
      studentId: this.user?.id,
      studentName: this.user?.name
    });
    this.showForm = false;
    this.newComplaint.description = '';
    this.loadComplaints();
  }

  confirmResolved(c: Complaint): void {
    c.status = 'Closed';
    this.complaintService.update(c, this.user?.name || 'Student');
    this.loadComplaints();
  }

  reopen(c: Complaint): void {
    c.status = 'Reopened';
    this.complaintService.update(c, this.user?.name || 'Student');
    this.loadComplaints();
  }
}