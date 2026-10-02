import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { Notification,User } from '../../../core/models/campus.models';
@Component({
  selector: 'app-staff-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold mb-0">Worker Notifications</h4>
        <button class="btn btn-sm btn-outline-secondary" (click)="markAllRead()">Mark All Read</button>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="list-group list-group-flush">
          <div *ngFor="let item of notifications" class="list-group-item p-3" [ngClass]="{'bg-light': !item.isRead}">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="fw-bold mb-1" [ngClass]="{'text-primary': !item.isRead}">{{ item.title }}</h6>
                <p class="mb-1 text-secondary small">{{ item.message }}</p>
                <small class="text-muted">{{ item.createdAt | date:'medium' }}</small>
              </div>
              <span *ngIf="!item.isRead" class="badge bg-danger">New</span>
            </div>
          </div>
          <div *ngIf="notifications.length === 0" class="p-4 text-center text-muted">
            No notifications found.
          </div>
        </div>
      </div>
    </div>
  `
})
export class StaffNotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  user: User | null = null;

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
    this.loadData();
  }

  loadData(): void {
    const list = this.storage.get<Notification[]>('NOTIFICATIONS') || [];
    this.notifications = list.filter(n => n.userId === this.user?.id);
  }

  markAllRead(): void {
    const all = this.storage.get<Notification[]>('NOTIFICATIONS') || [];
    all.forEach(n => {
      if (n.userId === this.user?.id) n.isRead = true;
    });
    this.storage.set('NOTIFICATIONS', all);
    this.loadData();
  }
}