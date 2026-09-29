import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { CertificateRequest,User } from '../../../core/models/campus.models';
import { AuditNotificationService } from '../../../core/services/audit-notification.service';

@Component({
  selector: 'app-student-certificates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold mb-0">Certificate Issuance Desk</h4>
        <button class="btn btn-primary" (click)="showForm = !showForm">
          <i class="bi bi-file-earmark-plus"></i> {{ showForm ? 'Close' : 'Request Certificate' }}
        </button>
      </div>

      <div *ngIf="showForm" class="card border-0 shadow-sm p-4 mb-4">
        <h5 class="fw-bold mb-3">Select Certificate Type</h5>
        <form (ngSubmit)="submitRequest()">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Certificate Type</label>
              <select class="form-select" [(ngModel)]="form.type" name="type" required>
                <option value="Bonafide Certificate">Bonafide Certificate</option>
                <option value="Study Certificate">Study Certificate</option>
                <option value="Character Certificate">Character Certificate</option>
                <option value="Hostel Certificate">Hostel Certificate</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Purpose of Request</label>
              <input type="text" class="form-control" [(ngModel)]="form.purpose" name="purpose" placeholder="e.g. Scholarship application, Bank Loan" required>
            </div>
          </div>
          <button type="submit" class="btn btn-success mt-3"><i class="bi bi-send-fill"></i> Submit Application</button>
        </form>
      </div>

      <div class="card border-0 shadow-sm p-3 mb-4">
        <h5 class="fw-bold mb-3">Submitted Applications</h5>
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Request ID</th>
                <th>Certificate</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of requests">
                <td><strong>{{ item.id }}</strong></td>
                <td>{{ item.type }}</td>
                <td>{{ item.purpose }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-warning text-dark': item.status === 'Requested',
                    'bg-info': item.status === 'Approved',
                    'bg-success': item.status === 'Generated'
                  }">{{ item.status }}</span>
                </td>
                <td>
                  <button *ngIf="item.status === 'Generated'" class="btn btn-sm btn-outline-success" (click)="previewCert = item">
                    <i class="bi bi-printer"></i> View / Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Printable Certificate Modal / Box -->
      <div *ngIf="previewCert" class="card border-2 border-secondary shadow p-5 bg-white text-dark">
        <div class="text-center border-bottom pb-4 mb-4">
          <h2 class="fw-bold text-uppercase">Biju Patnaik University of Technology</h2>
          <h5 class="text-muted">CAMPUS ONE CENTRAL ACADEMIC OFFICE</h5>
          <h4 class="mt-4 text-decoration-underline">{{ previewCert.type }}</h4>
        </div>

        <p class="fs-5 lh-lg">
          This is to certify that <strong>{{ previewCert.studentName }}</strong> (Student ID: <strong>{{ previewCert.studentId }}</strong>)
          is a bona fide student of the Master of Computer Applications (MCA) programme, 2nd Year, in good standing.
        </p>

        <p class="fs-6">
          This certificate is issued on request for the purpose of: <em>{{ previewCert.purpose }}</em>.
        </p>

        <div class="d-flex justify-content-between mt-5 pt-5 text-center">
          <div>
            <div class="fw-bold">Date of Issuance</div>
            <div>{{ previewCert.createdAt | date:'mediumDate' }}</div>
          </div>
          <div>
            <div class="fw-bold">Academic Registrar</div>
            <div class="text-muted small">[Digitally Verified Document]</div>
          </div>
        </div>

        <div class="text-center mt-4 d-print-none">
          <button class="btn btn-primary me-2" onclick="window.print()"><i class="bi bi-printer"></i> Print Certificate</button>
          <button class="btn btn-secondary" (click)="previewCert = null">Close Preview</button>
        </div>
      </div>
    </div>
  `
})
export class StudentCertificatesComponent implements OnInit {
  showForm = false;
  user: User | null = null;
  requests: CertificateRequest[] = [];
  previewCert: CertificateRequest | null = null;
  form: { type: CertificateRequest['type']; purpose: string } = {
    type: 'Bonafide Certificate',
    purpose: ''
  };

  constructor(private storage: StorageService, private audit: AuditNotificationService) {}

  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
    this.loadData();
  }

  loadData(): void {
    const list = this.storage.get<CertificateRequest[]>('CERTIFICATES') || [];
    this.requests = list.filter(c => c.studentId === this.user?.id);
  }

  submitRequest(): void {
    if (!this.form.purpose) return;
    const all = this.storage.get<CertificateRequest[]>('CERTIFICATES') || [];
    const newCert: CertificateRequest = {
      id: 'CR' + Math.floor(1000 + Math.random() * 9000),
      studentId: this.user?.id || 'STU001',
      studentName: this.user?.name || 'Dinakrushna Mohanta',
      type: this.form.type,
      purpose: this.form.purpose,
      status: 'Requested',
      createdAt: new Date().toISOString()
    };
    all.unshift(newCert);
    this.storage.set('CERTIFICATES', all);
    this.audit.logAudit(this.user?.name || 'Student', 'Requested Certificate', 'Certificate', newCert.id, newCert.type);
    this.showForm = false;
    this.form.purpose = '';
    this.loadData();
  }
}