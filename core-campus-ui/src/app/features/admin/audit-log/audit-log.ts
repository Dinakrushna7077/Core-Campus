import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { AuditLog } from '../../../core/models/campus.models';

@Component({
  selector: 'app-admin-audit-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <h4 class="fw-bold mb-3">Platform Audit & Compliance Trail</h4>

      <div class="card border-0 shadow-sm p-3 mb-3">
        <div class="row g-2">
          <div class="col-md-6">
            <input type="text" class="form-control" [(ngModel)]="filterQuery" placeholder="Filter audit trail by action, user or ID...">
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm p-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Timestamp</th>
                <th>Operator</th>
                <th>Action</th>
                <th>Entity</th>
                <th>ID</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of filteredLogs">
                <td><small>{{ item.timestamp | date:'medium' }}</small></td>
                <td><strong>{{ item.user }}</strong></td>
                <td><span class="badge bg-secondary">{{ item.action }}</span></td>
                <td>{{ item.entityType }}</td>
                <td><code>{{ item.entityId }}</code></td>
                <td>{{ item.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminAuditLogComponent implements OnInit {
  logs: AuditLog[] = [];
  filterQuery = '';

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.logs = this.storage.get<AuditLog[]>('AUDIT_LOGS') || [];
  }

  get filteredLogs(): AuditLog[] {
    if (!this.filterQuery) return this.logs;
    const q = this.filterQuery.toLowerCase();
    return this.logs.filter(l =>
      l.user.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.entityId.toLowerCase().includes(q)
    );
  }
}