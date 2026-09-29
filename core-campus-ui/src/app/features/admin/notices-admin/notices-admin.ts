import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { AuditNotificationService } from '../../../core/services/audit-notification.service';
import { Notice,User } from '../../../core/models/campus.models';

@Component({
  selector: 'app-admin-notices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold mb-0">Targeted Broadcast Notice Manager</h4>
        <button class="btn btn-primary" (click)="showForm = !showForm">
          <i class="bi bi-megaphone"></i> {{ showForm ? 'Close' : 'Publish Notice' }}
        </button>
      </div>

      <div *ngIf="showForm" class="card border-0 shadow-sm p-4 mb-4">
        <h5 class="fw-bold mb-3">Create Audience-Targeted Circular</h5>
        <form (ngSubmit)="createNotice()">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Notice Title</label>
              <input type="text" class="form-control" [(ngModel)]="newNotice.title" name="title" required>
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-semibold">Category</label>
              <select class="form-select" [(ngModel)]="newNotice.category" name="category">
                <option value="Academic">Academic</option>
                <option value="Hostel">Hostel</option>
                <option value="Exam">Examination</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-semibold">Priority</label>
              <select class="form-select" [(ngModel)]="newNotice.priority" name="priority">
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <!-- Audience Filters -->
            <div class="col-md-4">
              <label class="form-label small fw-semibold">Target Course</label>
              <select class="form-select" [(ngModel)]="newNotice.targetAudience.course" name="course">
                <option value="">All Courses</option>
                <option value="MCA">MCA</option>
                <option value="B.Tech">B.Tech</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-semibold">Target Year</label>
              <select class="form-select" [(ngModel)]="newNotice.targetAudience.year" name="year">
                <option value="">All Batches</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-semibold">Hostel Block</label>
              <select class="form-select" [(ngModel)]="newNotice.targetAudience.hostel" name="hostel">
                <option value="">All Hostels / Day Scholars</option>
                <option value="Hostel A">Hostel A</option>
                <option value="Hostel B">Hostel B</option>
              </select>
            </div>

            <div class="col-12">
              <label class="form-label small fw-semibold">Full Circular Content</label>
              <textarea class="form-control" rows="3" [(ngModel)]="newNotice.description" name="description" required></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-success mt-3"><i class="bi bi-send-check"></i> Dispatch Broadcast</button>
        </form>
      </div>

      <div class="card border-0 shadow-sm p-3">
        <h5 class="fw-bold mb-3">Live Published Notices</h5>
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Audience</th>
                <th>Read Count</th>
                <th>Published</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let n of notices">
                <td class="fw-bold">{{ n.title }}</td>
                <td>{{ n.category }}</td>
                <td>
                  <span class="badge" [ngClass]="n.priority === 'Urgent' ? 'bg-danger' : 'bg-secondary'">{{ n.priority }}</span>
                </td>
                <td>
                  <small>{{ n.targetAudience.course || 'All' }} {{ n.targetAudience.year || '' }} ({{ n.targetAudience.hostel || 'All' }})</small>
                </td>
                <td>
                  <span class="badge bg-primary">{{ n.readBy.length || 0 }} Read</span>
                </td>
                <td>{{ n.createdAt | date:'shortDate' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminNoticesComponent implements OnInit {
  showForm = false;
  notices: Notice[] = [];
  newNotice: any = {
    title: '',
    category: 'Academic',
    priority: 'Normal',
    description: '',
    targetAudience: { course: 'MCA', year: '2nd Year', hostel: 'Hostel A' }
  };

  constructor(private storage: StorageService, private audit: AuditNotificationService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.notices = this.storage.get<Notice[]>('NOTICES') || [];
  }

  createNotice(): void {
    if (!this.newNotice.title || !this.newNotice.description) return;
    const all = this.storage.get<Notice[]>('NOTICES') || [];
    const item: Notice = {
      id: 'NOT' + Math.floor(1000 + Math.random() * 9000),
      title: this.newNotice.title,
      description: this.newNotice.description,
      category: this.newNotice.category,
      priority: this.newNotice.priority,
      targetAudience: { ...this.newNotice.targetAudience },
      createdAt: new Date().toISOString(),
      readBy: []
    };
    all.unshift(item);
    this.storage.set('NOTICES', all);

    // Notify matching users
    const users = this.storage.get<User[]>('USERS') || [];
    users.forEach(u => {
      if (u.role === 'STUDENT') {
        this.audit.notify(u.id, `New Notice: ${item.title}`, item.description, 'NOTICE');
      }
    });

    this.audit.logAudit('Campus Administrator', 'Published Broadcast Notice', 'Notice', item.id, item.title);
    this.showForm = false;
    this.loadData();
  }
}