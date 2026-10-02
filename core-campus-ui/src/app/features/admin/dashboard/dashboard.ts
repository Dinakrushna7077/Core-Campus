import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { Complaint, AuditLog, GatePass, CertificateRequest,Staff } from '../../../core/models/campus.models';


//



interface StaffWorkloadRow {
  name: string;
  category: string;
  assigned: number;
  accepted: number;
  inProgress: number;
  resolved: number;
}

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

      <!-- Staff Summary KPI Row -->
      <div class="row g-3 mb-4">
        <div class="col-md">
          <div class="card p-3 border-0 bg-white shadow-sm">
            <small class="text-muted">Total Staff</small>
            <h4 class="fw-bold my-1 text-dark">{{ totalStaffCount }}</h4>
          </div>
        </div>
        <div class="col-md">
          <div class="card p-3 border-0 bg-white shadow-sm">
            <small class="text-muted">Active Staff</small>
            <h4 class="fw-bold my-1 text-primary">{{ activeStaffCount }}</h4>
          </div>
        </div>
        <div class="col-md">
          <div class="card p-3 border-0 bg-white shadow-sm">
            <small class="text-muted">Pending Assignments</small>
            <h4 class="fw-bold my-1 text-warning">{{ pendingAssignmentsCount }}</h4>
          </div>
        </div>
        <div class="col-md">
          <div class="card p-3 border-0 bg-white shadow-sm">
            <small class="text-muted">In Progress Tasks</small>
            <h4 class="fw-bold my-1 text-danger">{{ inProgressCount }}</h4>
          </div>
        </div>
        <div class="col-md">
          <div class="card p-3 border-0 bg-white shadow-sm">
            <small class="text-muted">Resolved Tasks</small>
            <h4 class="fw-bold my-1 text-success">{{ resolvedTodayCount }}</h4>
          </div>
        </div>
      </div>

      <!-- Staff Workload Live Table -->
      <div class="card border-0 shadow-sm p-3 mb-4">
        <h6 class="fw-bold mb-3"><i class="bi bi-people-fill text-primary me-2"></i> Worker & Staff Workload Distribution</h6>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Staff Team</th>
                <th>Category</th>
                <th>Assigned</th>
                <th>Accepted</th>
                <th>In Progress</th>
                <th>Resolved</th>
                <th>Active Workload</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of staffWorkloadTable">
                <td class="fw-bold">{{ s.name }}</td>
                <td><span class="badge bg-secondary">{{ s.category }}</span></td>
                <td><span class="badge bg-warning text-dark">{{ s.assigned }}</span></td>
                <td><span class="badge bg-info text-white">{{ s.accepted }}</span></td>
                <td><span class="badge bg-danger">{{ s.inProgress }}</span></td>
                <td><span class="badge bg-success">{{ s.resolved }}</span></td>
                <td>
                  <strong>{{ s.assigned + s.accepted + s.inProgress }}</strong> active tasks
                </td>
              </tr>
            </tbody>
          </table>
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

      <!-- Complaint Ageing Breakdown -->
      <div class="card p-3 mb-4 shadow-sm">
        <h6 class="fw-bold mb-3"><i class="bi bi-hourglass-split"></i> Complaint Ageing Breakdown</h6>
        <div class="d-flex justify-content-around text-center">
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
  totalStaffCount = 0;
  activeStaffCount = 0;
  pendingAssignmentsCount = 0;
  inProgressCount = 0;
  resolvedTodayCount = 0;

  staffWorkloadTable: StaffWorkloadRow[] = [];
  ageingStats = { '0-2': 0, '3-5': 0, '6-10': 0, '10+': 0 };
  recurringIssue: any = null;
  recentLogs: AuditLog[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.refreshAnalytics();
  }

  refreshAnalytics(): void {
    const complaints = this.storage.get<Complaint[]>('COMPLAINTS') || [];
    this.openComplaintsCount = complaints.filter(c => c.status !== 'Closed').length;

    const staffList = this.storage.get<Staff[]>('STAFF_MEMBERS') || [];
    this.totalStaffCount = staffList.length;

    // Reset table
    this.staffWorkloadTable = staffList.map(s => ({
      name: s.name,
      category: s.category,
      assigned: 0,
      accepted: 0,
      inProgress: 0,
      resolved: 0
    }));

    complaints.forEach(c => {
      const match = this.staffWorkloadTable.find(
        row => row.name === c.assignedStaffName || row.name === c.assignedStaff
      );
      if (match) {
        if (c.status === 'Assigned') match.assigned++;
        else if (c.status === 'Accepted') match.accepted++;
        else if (c.status === 'In Progress') match.inProgress++;
        else if (c.status === 'Resolved' || c.status === 'Closed') match.resolved++;
      }

      if (c.status === 'Pending' && !c.assignedStaff) {
        this.pendingAssignmentsCount++;
      }
      if (c.status === 'In Progress') {
        this.inProgressCount++;
      }
      if (c.status === 'Resolved' || c.status === 'Closed') {
        this.resolvedTodayCount++;
      }

      // Ageing
      const days = Math.floor(Math.abs(Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      if (days <= 2) this.ageingStats['0-2']++;
      else if (days <= 5) this.ageingStats['3-5']++;
      else if (days <= 10) this.ageingStats['6-10']++;
      else {
        this.ageingStats['10+']++;
        if (c.status !== 'Closed') this.highAgeComplaints++;
      }
    });

    this.activeStaffCount = this.staffWorkloadTable.filter(
      s => (s.assigned + s.accepted + s.inProgress) > 0
    ).length;

    // Recurring issue detection
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