import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { Complaint, Notification, User } from '../../../core/models/campus.models';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="fw-bold mb-0">Worker Operations Desk</h3>
          <p class="text-muted mb-0">Logged in as: <strong>{{ user?.name }}</strong> ({{ user?.staffDetails?.category }} Division)</p>
        </div>
        <a routerLink="/staff/complaints" class="btn btn-primary">
          <i class="bi bi-list-task me-1"></i> View All Tasks
        </a>
      </div>

      <!-- KPI Metrics -->
      <div class="row g-3 mb-4">
        <div class="col-sm-6 col-lg-2">
          <div class="card p-3 border-0 bg-primary text-white shadow-sm">
            <div class="small opacity-75">Total Assigned</div>
            <h2 class="fw-bold my-1">{{ totalAssigned }}</h2>
            <div class="small">Lifetime tasks</div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-2">
          <div class="card p-3 border-0 bg-warning text-dark shadow-sm">
            <div class="small">Assigned / New</div>
            <h2 class="fw-bold my-1">{{ statusCounts.Assigned }}</h2>
            <div class="small">Needs acceptance</div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-2">
          <div class="card p-3 border-0 bg-info text-white shadow-sm">
            <div class="small opacity-75">Accepted</div>
            <h2 class="fw-bold my-1">{{ statusCounts.Accepted }}</h2>
            <div class="small">Pending start</div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card p-3 border-0 bg-danger text-white shadow-sm">
            <div class="small opacity-75">In Progress</div>
            <h2 class="fw-bold my-1">{{ statusCounts['In Progress'] }}</h2>
            <div class="small">Under active repair</div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card p-3 border-0 bg-success text-white shadow-sm">
            <div class="small opacity-75">Resolved</div>
            <h2 class="fw-bold my-1">{{ statusCounts.Resolved }}</h2>
            <div class="small">Awaiting confirmation</div>
          </div>
        </div>
      </div>

      <!-- Live Workload Summary Card -->
      <div class="card border-0 shadow-sm p-3 mb-4">
        <h6 class="fw-bold mb-3"><i class="bi bi-pie-chart-fill me-2 text-primary"></i> Current Active Workload Breakdown</h6>
        <div class="row text-center g-2">
          <div class="col-md-4">
            <div class="p-3 bg-light rounded border">
              <span class="text-muted d-block small">Queue (Assigned + Accepted)</span>
              <strong class="fs-4 text-warning">{{ statusCounts.Assigned + statusCounts.Accepted }}</strong>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-3 bg-light rounded border">
              <span class="text-muted d-block small">Active (In Progress)</span>
              <strong class="fs-4 text-danger">{{ statusCounts['In Progress'] }}</strong>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-3 bg-light rounded border">
              <span class="text-muted d-block small">Total Active Workload</span>
              <strong class="fs-4 text-primary">{{ activeWorkload }}</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Today's Assignments / Immediate Queue -->
        <div class="col-lg-7">
          <div class="card border-0 shadow-sm p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold mb-0"><i class="bi bi-clock-history me-1 text-danger"></i> Urgent & Recent Assignments</h6>
              <a routerLink="/staff/complaints" class="small text-decoration-none">View All</a>
            </div>

            <div *ngIf="recentTasks.length === 0" class="text-center py-4 text-muted">
              No tasks currently assigned to your team.
            </div>

            <div class="list-group list-group-flush" *ngIf="recentTasks.length > 0">
              <div *ngFor="let t of recentTasks" class="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                <div>
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <span class="badge bg-dark">{{ t.id }}</span>
                    <span class="badge" [ngClass]="{
                      'bg-warning text-dark': t.status === 'Assigned',
                      'bg-info': t.status === 'Accepted',
                      'bg-danger': t.status === 'In Progress',
                      'bg-success': t.status === 'Resolved' || t.status === 'Closed'
                    }">{{ t.status }}</span>
                    <span class="badge bg-secondary">{{ t.priority }}</span>
                  </div>
                  <strong class="text-dark">{{ t.title || t.category + ' Issue' }}</strong>
                  <div class="small text-muted">
                    <i class="bi bi-geo-alt"></i> {{ t.location }} (Room {{ t.room }}) | Student: {{ t.studentName }}
                  </div>
                </div>

                <a [routerLink]="['/staff/complaints', t.id]" class="btn btn-sm btn-outline-primary">
                  Manage <i class="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Staff Notifications -->
        <div class="col-lg-5">
          <div class="card border-0 shadow-sm p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold mb-0"><i class="bi bi-bell-fill text-warning me-1"></i> Recent Alerts</h6>
              <a routerLink="/staff/notifications" class="small text-decoration-none">All</a>
            </div>

            <div *ngIf="notifications.length === 0" class="text-center py-4 text-muted">
              No notifications yet.
            </div>

            <div class="list-group list-group-flush" *ngIf="notifications.length > 0">
              <div *ngFor="let n of notifications.slice(0, 5)" class="list-group-item px-0 py-2">
                <div class="d-flex justify-content-between">
                  <strong class="small text-dark">{{ n.title }}</strong>
                  <small class="text-muted">{{ n.createdAt | date:'shortTime' }}</small>
                </div>
                <p class="small text-muted mb-0">{{ n.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StaffDashboardComponent implements OnInit {
  user: User | null = null;
  totalAssigned = 0;
  activeWorkload = 0;
  statusCounts = {
    Assigned: 0,
    Accepted: 0,
    'In Progress': 0,
    Resolved: 0,
    Closed: 0
  };
  recentTasks: Complaint[] = [];
  notifications: Notification[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
    this.loadData();
  }

  loadData(): void {
    if (!this.user) return;
    const complaints = this.storage.get<Complaint[]>('COMPLAINTS') || [];
    const myTasks = complaints.filter(
      c => c.assignedStaffId === this.user?.id || c.assignedStaff === this.user?.name
    );

    this.totalAssigned = myTasks.length;
    this.statusCounts = {
      Assigned: 0,
      Accepted: 0,
      'In Progress': 0,
      Resolved: 0,
      Closed: 0
    };

    myTasks.forEach(t => {
      if (this.statusCounts[t.status as keyof typeof this.statusCounts] !== undefined) {
        this.statusCounts[t.status as keyof typeof this.statusCounts]++;
      }
    });

    this.activeWorkload = this.statusCounts.Assigned + this.statusCounts.Accepted + this.statusCounts['In Progress'];
    this.recentTasks = myTasks.slice(0, 6);

    const allNotes = this.storage.get<Notification[]>('NOTIFICATIONS') || [];
    this.notifications = allNotes.filter(n => n.userId === this.user?.id);
  }
}