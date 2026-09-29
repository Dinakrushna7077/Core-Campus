import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { ComplaintService } from '../../../core/services/complaint.service.ts';
import { Complaint } from '../../../core/models/campus.models';

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
                <th>Assign Staff</th>
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
                  <select class="form-select form-select-sm" [(ngModel)]="item.assignedStaff" (change)="saveChanges(item)">
                    <option value="">Unassigned</option>
                    <option *ngFor="let s of staffList" [value]="s">{{ s }}</option>
                  </select>
                </td>
                <td>
                  <select class="form-select form-select-sm" [(ngModel)]="item.status" (change)="saveChanges(item)">
                    <option value="Pending">Pending</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                    <option value="Reopened">Reopened</option>
                  </select>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" (click)="activeNote = item">Note</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Note Modal Dialog -->
      <div *ngIf="activeNote" class="card border-primary p-3 mt-3 shadow">
        <h6 class="fw-bold">Resolution Note for {{ activeNote.id }}</h6>
        <textarea class="form-control mb-2" [(ngModel)]="activeNote.adminNote" placeholder="Write internal technician instruction..."></textarea>
        <div>
          <button class="btn btn-primary btn-sm me-2" (click)="saveChanges(activeNote); activeNote = null">Save Note</button>
          <button class="btn btn-secondary btn-sm" (click)="activeNote = null">Cancel</button>
        </div>
      </div>
    </div>
  `
})
export class AdminComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  staffList: string[] = [];
  activeNote: Complaint | null = null;

  constructor(private storage: StorageService, private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.staffList = this.storage.get<string[]>('STAFF') || [];
    this.loadData();
  }

  loadData(): void {
    this.complaints = this.complaintService.getAll();
  }

  getAge(dateStr: string): number {
    return this.complaintService.calculateAge(dateStr);
  }

  saveChanges(item: Complaint): void {
    this.complaintService.update(item, 'Campus Administrator');
    this.loadData();
  }
}