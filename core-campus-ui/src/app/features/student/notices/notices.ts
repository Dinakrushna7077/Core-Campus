import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { Notice,User } from '../../../core/models/campus.models';

@Component({
  selector: 'app-student-notices',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h4 class="fw-bold mb-4">Targeted Campus Notices</h4>

      <div class="row g-3">
        <div class="col-12" *ngFor="let n of notices">
          <div class="card border-0 shadow-sm p-4" [ngClass]="{'border-start border-primary border-4': !isRead(n)}">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div class="d-flex align-items-center gap-2">
                <span *ngIf="!isRead(n)" class="badge bg-primary">UNREAD</span>
                <span class="badge" [ngClass]="n.priority === 'Urgent' ? 'bg-danger' : 'bg-secondary'">{{ n.priority }}</span>
                <span class="badge bg-light text-dark border">{{ n.category }}</span>
              </div>
              <small class="text-muted">{{ n.createdAt | date:'mediumDate' }}</small>
            </div>

            <h5 class="fw-bold text-dark mb-2">{{ n.title }}</h5>
            <p class="text-muted mb-3">{{ n.description }}</p>

            <div class="d-flex justify-content-between align-items-center">
              <small class="text-secondary">
                Target: {{ n.targetAudience.course || 'All' }} {{ n.targetAudience.year || '' }} ({{ n.targetAudience.hostel || 'All Hostels' }})
              </small>
              <button *ngIf="!isRead(n)" class="btn btn-sm btn-outline-primary" (click)="markAsRead(n)">
                <i class="bi bi-check2"></i> Mark Read
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentNoticesComponent implements OnInit {
  user: User | null = null;
  notices: Notice[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
    this.loadNotices();
  }

  loadNotices(): void {
    const list = this.storage.get<Notice[]>('NOTICES') || [];
    this.notices = list.filter(n => {
      const matchCourse = !n.targetAudience.course || n.targetAudience.course === this.user?.studentDetails?.course;
      const matchYear = !n.targetAudience.year || n.targetAudience.year === this.user?.studentDetails?.year;
      const matchHostel = !n.targetAudience.hostel || n.targetAudience.hostel === this.user?.studentDetails?.hostel;
      return matchCourse && matchYear && matchHostel;
    });
  }

  isRead(n: Notice): boolean {
    return !!this.user && n.readBy?.includes(this.user.id);
  }

  markAsRead(n: Notice): void {
    if (!this.user) return;
    const all = this.storage.get<Notice[]>('NOTICES') || [];
    const item = all.find(x => x.id === n.id);
    if (item && !item.readBy.includes(this.user.id)) {
      item.readBy.push(this.user.id);
      this.storage.set('NOTICES', all);
      this.loadNotices();
    }
  }
}