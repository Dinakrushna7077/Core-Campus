import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { User } from '../../../core/models/campus.models';

@Component({
  selector: 'app-staff-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid" style="max-width: 700px;">
      <div class="card border-0 shadow-sm p-4">
        <div class="d-flex align-items-center mb-4">
          <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px; font-size: 1.5rem;">
            <i class="bi bi-tools"></i>
          </div>
          <div>
            <h4 class="fw-bold mb-0">{{ user?.name }}</h4>
            <span class="badge bg-success">{{ user?.role }}</span>
            <span class="badge bg-secondary ms-1">{{ user?.staffDetails?.category }}</span>
          </div>
        </div>

        <ul class="list-group list-group-flush">
          <li class="list-group-item d-flex justify-content-between px-0">
            <span class="text-muted">Staff / Team ID:</span>
            <strong>{{ user?.id }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between px-0">
            <span class="text-muted">Email:</span>
            <strong>{{ user?.email }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between px-0">
            <span class="text-muted">Department:</span>
            <strong>{{ user?.staffDetails?.department }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between px-0">
            <span class="text-muted">Primary Category:</span>
            <strong>{{ user?.staffDetails?.category }}</strong>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class StaffProfileComponent implements OnInit {
  user: User | null = null;
  constructor(private storage: StorageService) {}
  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
  }
}