import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { Complaint, AuditLog, GatePass, CertificateRequest } from '../../../core/models/campus.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="fw-bold">Campus Command Center</h3>
          <p class="text-muted">Unified Operations, Live Workload & Intelligent Analytics</p>
        </div>
      </div>

      <!-- KPI Metrics -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card p-3 border-0 bg-danger text-white shadow-sm">
            <h6>Open Complaints</h6>
            <h2 class="fw-bold">{{ openComplaintsCount }}</h2>
            <small>{{ highAgeComplaints }} unresolved for > 5 days</small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card p-3 border-0 bg-warning text-dark shadow-sm">
            <h6>Pending Gate Passes</h6>
            <h2 class="fw-bold">{{ pendingGatePasses }}</h2>
            <small>Awaiting warden review</small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card p-3 border-0 bg-primary text-white shadow-sm">
            <h6>Pending Certificates</h6>
            <h2 class="fw-bold">{{ pendingCertificates }}</h2>
            <small>Academic desk</small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card p-3 border-0 bg-success text-white shadow-sm">
            <h6>System Health</h6>
            <h2 class="fw-bold">99.8%</h2>
            <small>LocalStorage Demo Sync active</small>
          </div>
        </div>
      </div>

      <!-- Intelligent Recurring Issue Detection -->
      <div *ngIf="recurringIssue" class="alert alert-warning d-flex align-items-center mb-4 shadow-sm">
        <i class="bi bi-exclamation-octagon-fill fs-2 me-3 text-danger"></i>
        <div>
          <h6 class="fw-bold mb-0">Automated Facility Intelligence: Recurring Issue Detected</h6>
          <span>{{ recurringIssue.message }}</span>
          <div class="fw-bold text-dark mt-1">Recommendation: {{ recurringIssue.recommendation }}</div>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <!-- Staff Workload Progress Bars -->
        <div class="col-md-6">
          <div class="card p-3 h-100 shadow-sm">
            <h6 class="fw-bold mb-3"><i class="bi bi-person-lines-fill"></i> Staff Assignment Workload</h6>
            <div class="mb-3">
              <div class="d-flex justify-content-between small mb-1">
                <span>Plumbing Team</span>
                <strong>{{ staffWorkload['Plumbing Team'] || 0 }} Assigned</strong>
              </div>
              <div class="progress" style="height: 10px;">
                <div class="progress-bar bg-primary" [style.width.%]="(staffWorkload['Plumbing Team'] || 0) * 15"></div>
              </div>
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between small mb-1">
                <span>Electrical Team</span>
                <strong>{{ staffWorkload['Electrical Team'] || 0 }} Assigned</strong>
              </div>
              <div class="progress" style="height: 10px;">
                <div class="progress-bar bg-warning" [style.width.%]="(staffWorkload['Electrical Team'] || 0) * 15"></div>
              </div>
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between small mb-1">
                <span>Cleaning Team</span>
                <strong>{{ staffWorkload['Cleaning Team'] || 0 }} Assigned</strong>
              </div>
              <div class="progress" style="height: 10px;">
                <div class="progress-bar bg-info" [style.width.%]="(staffWorkload['Cleaning Team'] || 0) * 15"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Complaint Ageing Distribution -->
        <div class="col-md-6">
          <div class="card p-3 h-100 shadow-sm">
            <h6 class="fw-bold mb-3"><i class="bi bi-hourglass-split"></i> Complaint Ageing Breakdown</h6>
            <div class="d-flex justify-content-around text-center mt-3">
              <div class="p-2 border rounded" style="width: 22%;">
                <div class="fs-4 fw-bold text-success">{{ ageingStats['0-2'] }}</div>
                <div class="small text-muted">0–2 days</div>
              </div>
              <div class="p-2 border rounded" style="width: 22%;">
                <div class="fs-4 fw-bold text-primary">{{ ageingStats['3-5'] }}</div>
                <div class="small text-muted">3–5 days</div>
              </div>
              <div class="p-2 border rounded" style="width: 22%;">
                <div class="fs-4 fw-bold text-warning">{{ ageingStats['6-10'] }}</div>
                <div class="small text-muted">6–10 days</div>
              </div>
              <div class="p-2 border rounded" style="width: 22%;">
                <div class="fs-4 fw-bold text-danger">{{ ageingStats['10+'] }}</div>
                <div class="small text-muted">10+ days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Audit Trail Snippet -->
      <div class="card p-3 shadow-sm">
        <h6 class="fw-bold mb-3"><i class="bi bi-activity"></i> Recent Platform Activity</h6>
        <div class="list-group list-group-flush">
          <div *ngFor="let a of recentLogs" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{{ a.user }}</strong>: {{ a.description }}
            </div>
            <small class="text-muted">{{ a.timestamp | date:'shortTime' }}</small>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  openComplaintsCount = 0;
  highAgeComplaints = 0;
  pendingGatePasses = 0;
  pendingCertificates = 0;
  recentLogs: AuditLog[] = [];
  recurringIssue: any = null;

  staffWorkload: { [key: string]: number } = {
    'Plumbing Team': 0,
    'Electrical Team': 0,
    'Cleaning Team': 0
  };

  ageingStats = { '0-2': 0, '3-5': 0, '6-10': 0, '10+': 0 };

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.refreshAnalytics();
  }

  refreshAnalytics(): void {
    const complaints = this.storage.get<Complaint[]>('COMPLAINTS') || [];
    this.openComplaintsCount = complaints.filter(c => c.status !== 'Closed').length;

    // Calculate staff workload
    complaints.forEach(c => {
      if (c.assignedStaff && this.staffWorkload[c.assignedStaff] !== undefined) {
        this.staffWorkload[c.assignedStaff]++;
      }
    });

    // Complaint Ageing calculation
    complaints.forEach(c => {
      const days = Math.floor(Math.abs(Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      if (days <= 2) this.ageingStats['0-2']++;
      else if (days <= 5) this.ageingStats['3-5']++;
      else if (days <= 10) this.ageingStats['6-10']++;
      else {
        this.ageingStats['10+']++;
        if (c.status !== 'Closed') this.highAgeComplaints++;
      }
    });

    // Detect recurring issue
    const plumbingHostelA = complaints.filter(c => c.category === 'Plumbing' && c.location === 'Hostel A');
    if (plumbingHostelA.length >= 3) {
      this.recurringIssue = {
        message: `High frequency of Plumbing issues (${plumbingHostelA.length}) flagged in Hostel A.`,
        recommendation: 'Inspect the primary vertical pipe joint and water pump delivery lines in Hostel A block.'
      };
    }

    const passes = this.storage.get<GatePass[]>('GATE_PASSES') || [];
    this.pendingGatePasses = passes.filter(p => p.status === 'Pending').length;

    const certs = this.storage.get<CertificateRequest[]>('CERTIFICATES') || [];
    this.pendingCertificates = certs.filter(c => c.status === 'Requested').length;

    const logs = this.storage.get<AuditLog[]>('AUDIT_LOGS') || [];
    this.recentLogs = logs.slice(0, 5);
  }
}