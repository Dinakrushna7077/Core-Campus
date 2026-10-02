import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { Complaint,User } from '../../../core/models/campus.models';
import { ComplaintService } from '../../../core/services/complaint.service.ts';

@Component({
  selector: 'app-staff-complaints-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 class="fw-bold mb-0">Assigned Tasks & Work Orders</h4>
          <small class="text-muted">Showing all work orders assigned to {{ user?.name }}</small>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="card border-0 shadow-sm p-3 mb-4">
        <div class="row g-2 align-items-center">
          <div class="col-md-5">
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
              <input
                type="text"
                class="form-control"
                placeholder="Search by ID, title, student, room..."
                [(ngModel)]="searchQuery"
              >
            </div>
          </div>
          <div class="col-md-7">
            <div class="d-flex flex-wrap gap-1 justify-content-md-end">
              <button
                class="btn btn-sm"
                [ngClass]="activeFilter === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'"
                (click)="activeFilter = 'ALL'"
              >
                All ({{ myComplaints.length }})
              </button>
              <button
                class="btn btn-sm"
                [ngClass]="activeFilter === 'Assigned' ? 'btn-warning text-dark' : 'btn-outline-secondary'"
                (click)="activeFilter = 'Assigned'"
              >
                Assigned
              </button>
              <button
                class="btn btn-sm"
                [ngClass]="activeFilter === 'Accepted' ? 'btn-info text-white' : 'btn-outline-secondary'"
                (click)="activeFilter = 'Accepted'"
              >
                Accepted
              </button>
              <button
                class="btn btn-sm"
                [ngClass]="activeFilter === 'In Progress' ? 'btn-danger' : 'btn-outline-secondary'"
                (click)="activeFilter = 'In Progress'"
              >
                In Progress
              </button>
              <button
                class="btn btn-sm"
                [ngClass]="activeFilter === 'Resolved' ? 'btn-success' : 'btn-outline-secondary'"
                (click)="activeFilter = 'Resolved'"
              >
                Resolved
              </button>
              <button
                class="btn btn-sm"
                [ngClass]="activeFilter === 'Reopened' ? 'btn-dark' : 'btn-outline-secondary'"
                (click)="activeFilter = 'Reopened'"
              >
                Reopened
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Table -->
      <div class="card border-0 shadow-sm p-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Title / Category</th>
                <th>Location</th>
                <th>Student</th>
                <th>Priority</th>
                <th>Assigned Date</th>
                <th>Ageing</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of filteredComplaints">
                <td><strong>{{ item.id }}</strong></td>
                <td>
                  <div class="fw-semibold">{{ item.title || item.category + ' Issue' }}</div>
                  <small class="badge bg-light text-dark border">{{ item.category }}</small>
                </td>
                <td>
                  <div>{{ item.location }}</div>
                  <small class="text-muted">Room: {{ item.room }}</small>
                </td>
                <td>{{ item.studentName }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-danger': item.priority === 'High',
                    'bg-warning text-dark': item.priority === 'Medium',
                    'bg-info': item.priority === 'Low'
                  }">{{ item.priority }}</span>
                </td>
                <td>{{ (item.assignedAt || item.createdAt) | date:'shortDate' }}</td>
                <td>
                  <span class="badge bg-secondary">{{ getAge(item.createdAt) }}d</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-warning text-dark': item.status === 'Assigned',
                    'bg-info': item.status === 'Accepted',
                    'bg-danger': item.status === 'In Progress',
                    'bg-success': item.status === 'Resolved' || item.status === 'Closed',
                    'bg-dark': item.status === 'Reopened'
                  }">{{ item.status }}</span>
                </td>
                <td>
                  <a [routerLink]="['/staff/complaints', item.id]" class="btn btn-sm btn-outline-primary">
                    Open <i class="bi bi-arrow-right"></i>
                  </a>
                </td>
              </tr>
              <tr *ngIf="filteredComplaints.length === 0">
                <td colspan="9" class="text-center py-4 text-muted">
                  No work orders match the current criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class StaffComplaintsListComponent implements OnInit {
  user: User | null = null;
  myComplaints: Complaint[] = [];
  searchQuery = '';
  activeFilter = 'ALL';

  constructor(
    private storage: StorageService,
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
    this.loadData();
  }

  loadData(): void {
    if (!this.user) return;
    const complaints = this.storage.get<Complaint[]>('COMPLAINTS') || [];
    this.myComplaints = complaints.filter(
      c => c.assignedStaffId === this.user?.id || c.assignedStaff === this.user?.name
    );
  }

  getAge(dateStr: string): number {
    return this.complaintService.calculateAge(dateStr);
  }

  get filteredComplaints(): Complaint[] {
    return this.myComplaints.filter(c => {
      const matchFilter = this.activeFilter === 'ALL' || c.status === this.activeFilter;
      const q = this.searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        c.id.toLowerCase().includes(q) ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        c.studentName.toLowerCase().includes(q) ||
        c.room.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }
}