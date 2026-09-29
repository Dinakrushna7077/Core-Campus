import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { ComplaintService } from '../../../core/services/complaint.service.ts';
import { AuditNotificationService } from '../../../core/services/audit-notification.service';

@Component({
  selector: 'app-service-desk',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="card p-4 mx-auto" style="max-width: 750px;">
        <h4 class="fw-bold mb-2"><i class="bi bi-headset"></i> Physical Campus Service Desk</h4>
        <p class="text-muted small">Assisted Request Submission for Non-Smartphone & Walk-in Students</p>

        <form (ngSubmit)="submitAssistedRequest()">
          <div class="mb-3">
            <label class="form-label">Student Name</label>
            <input type="text" class="form-control" [(ngModel)]="studentName" name="studentName" required>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Roll / Student ID</label>
              <input type="text" class="form-control" [(ngModel)]="studentId" name="studentId" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Request Type</label>
              <select class="form-select" [(ngModel)]="requestType" name="requestType">
                <option value="Plumbing Complaint">Plumbing Complaint</option>
                <option value="Electrical Complaint">Electrical Complaint</option>
                <option value="Gate Pass">Manual Gate Pass</option>
                <option value="Bonafide Certificate">Bonafide Certificate</option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Problem Description</label>
            <textarea class="form-control" rows="3" [(ngModel)]="description" name="description" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary"><i class="bi bi-check-circle"></i> Log On Behalf of Student</button>
        </form>
      </div>
    </div>
  `
})
export class ServiceDeskComponent {
  studentName = '';
  studentId = '';
  requestType = 'Plumbing Complaint';
  description = '';

  constructor(
    private complaintService: ComplaintService,
    private audit: AuditNotificationService
  ) {}

  submitAssistedRequest(): void {
    if (!this.studentId || !this.description) return;

    if (this.requestType.includes('Complaint')) {
      this.complaintService.create({
        studentId: this.studentId,
        studentName: this.studentName,
        category: this.requestType.startsWith('Plumbing') ? 'Plumbing' : 'Electrical',
        location: 'Walk-in Desk',
        room: 'General',
        description: `[Service Desk Lodged]: ${this.description}`,
        priority: 'High'
      });
    }

    this.audit.logAudit('Staff Desk Operator', 'Assisted Request Logged', 'ServiceDesk', this.studentId, `Created ${this.requestType} for ${this.studentName}`);
    alert('Request successfully queued into system pipeline.');
    this.studentName = '';
    this.studentId = '';
    this.description = '';
  }
}