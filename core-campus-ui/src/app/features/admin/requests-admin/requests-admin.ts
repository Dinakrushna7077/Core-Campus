import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { AuditNotificationService } from '../../../core/services/audit-notification.service';
import { CertificateRequest, GatePass, LeaveRequest } from '../../../core/models/campus.models';

@Component({
  selector: 'app-admin-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h4 class="fw-bold mb-4">Unified Operations Request Hub</h4>

      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <button class="nav-link" [class.active]="tab === 'gate'" (click)="tab = 'gate'">Gate Passes</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="tab === 'certs'" (click)="tab = 'certs'">Certificates</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="tab === 'leaves'" (click)="tab = 'leaves'">Leaves</button>
        </li>
      </ul>

      <!-- Gate Passes Tab -->
      <div *ngIf="tab === 'gate'" class="card border-0 shadow-sm p-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of gatePasses">
                <td><strong>{{ p.id }}</strong></td>
                <td>{{ p.studentName }}</td>
                <td>{{ p.date }} ({{ p.leavingTime }} - {{ p.returnTime }})</td>
                <td>{{ p.reason }}</td>
                <td><span class="badge" [ngClass]="p.status === 'Approved' ? 'bg-success' : 'bg-warning text-dark'">{{ p.status }}</span></td>
                <td>
                  <button *ngIf="p.status === 'Pending'" class="btn btn-sm btn-success me-2" (click)="approveGatePass(p)">Approve</button>
                  <button *ngIf="p.status === 'Pending'" class="btn btn-sm btn-danger" (click)="rejectGatePass(p)">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Certificates Tab -->
      <div *ngIf="tab === 'certs'" class="card border-0 shadow-sm p-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Certificate</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of certs">
                <td><strong>{{ c.id }}</strong></td>
                <td>{{ c.studentName }}</td>
                <td>{{ c.type }}</td>
                <td>{{ c.purpose }}</td>
                <td><span class="badge" [ngClass]="c.status === 'Generated' ? 'bg-success' : 'bg-warning text-dark'">{{ c.status }}</span></td>
                <td>
                  <button *ngIf="c.status === 'Requested'" class="btn btn-sm btn-primary me-2" (click)="approveCert(c)">Approve</button>
                  <button *ngIf="c.status === 'Approved'" class="btn btn-sm btn-success" (click)="generateCert(c)">Mark Generated</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Leave Requests Tab -->
      <div *ngIf="tab === 'leaves'" class="card border-0 shadow-sm p-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let l of leaves">
                <td><strong>{{ l.id }}</strong></td>
                <td>{{ l.studentName }}</td>
                <td>{{ l.fromDate }} to {{ l.toDate }}</td>
                <td>{{ l.reason }}</td>
                <td><span class="badge" [ngClass]="l.status === 'Approved' ? 'bg-success' : 'bg-warning text-dark'">{{ l.status }}</span></td>
                <td>
                  <button *ngIf="l.status === 'Pending'" class="btn btn-sm btn-success me-2" (click)="updateLeave(l, 'Approved')">Approve</button>
                  <button *ngIf="l.status === 'Pending'" class="btn btn-sm btn-danger" (click)="updateLeave(l, 'Rejected')">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminRequestsComponent implements OnInit {
  tab: 'gate' | 'certs' | 'leaves' = 'gate';
  gatePasses: GatePass[] = [];
  certs: CertificateRequest[] = [];
  leaves: LeaveRequest[] = [];

  constructor(private storage: StorageService, private audit: AuditNotificationService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.gatePasses = this.storage.get<GatePass[]>('GATE_PASSES') || [];
    this.certs = this.storage.get<CertificateRequest[]>('CERTIFICATES') || [];
    this.leaves = this.storage.get<LeaveRequest[]>('LEAVE_REQUESTS') || [];
  }

  approveGatePass(p: GatePass): void {
    p.status = 'Approved';
    p.qrData = `CAMPUS1-${p.id}-${p.studentId}-APPROVED`;
    p.approvedAt = new Date().toISOString();
    this.storage.set('GATE_PASSES', this.gatePasses);
    this.audit.logAudit('Campus Administrator', 'Approved Gate Pass', 'GatePass', p.id, `Valid on ${p.date}`);
    this.audit.notify(p.studentId, 'Gate Pass Approved', `Your gate pass ${p.id} has been approved.`, 'GATE_PASS');
  }

  rejectGatePass(p: GatePass): void {
    p.status = 'Rejected';
    this.storage.set('GATE_PASSES', this.gatePasses);
    this.audit.logAudit('Campus Administrator', 'Rejected Gate Pass', 'GatePass', p.id, `Rejected pass on ${p.date}`);
    this.audit.notify(p.studentId, 'Gate Pass Rejected', `Your gate pass ${p.id} was rejected.`, 'GATE_PASS');
  }

  approveCert(c: CertificateRequest): void {
    c.status = 'Approved';
    this.storage.set('CERTIFICATES', this.certs);
    this.audit.logAudit('Campus Administrator', 'Approved Certificate Request', 'Certificate', c.id, c.type);
    this.audit.notify(c.studentId, 'Certificate Approved', `Your ${c.type} request is approved.`, 'REQUEST');
  }

  generateCert(c: CertificateRequest): void {
    c.status = 'Generated';
    this.storage.set('CERTIFICATES', this.certs);
    this.audit.logAudit('Campus Administrator', 'Generated Digital Certificate', 'Certificate', c.id, c.type);
    this.audit.notify(c.studentId, 'Certificate Ready', `Your ${c.type} is generated and ready for print.`, 'REQUEST');
  }

  updateLeave(l: LeaveRequest, status: 'Approved' | 'Rejected'): void {
    l.status = status;
    this.storage.set('LEAVE_REQUESTS', this.leaves);
    this.audit.logAudit('Campus Administrator', `Leave ${status}`, 'LeaveRequest', l.id, `${l.fromDate} to ${l.toDate}`);
    this.audit.notify(l.studentId, `Leave ${status}`, `Your leave application has been ${status.toLowerCase()}.`, 'REQUEST');
  }
}