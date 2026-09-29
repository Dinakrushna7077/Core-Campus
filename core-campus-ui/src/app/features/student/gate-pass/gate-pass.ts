import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { AuditNotificationService } from '../../../core/services/audit-notification.service';
import { GatePass,User } from '../../../core/models/campus.models';

@Component({
  selector: 'app-student-gate-pass',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold mb-0">Digital Gate Pass System</h4>
        <button class="btn btn-primary" (click)="showForm = !showForm">
          <i class="bi bi-door-open-fill"></i> {{ showForm ? 'Close' : 'Request Out-Pass' }}
        </button>
      </div>

      <div *ngIf="showForm" class="card border-0 shadow-sm p-4 mb-4">
        <h5 class="fw-bold mb-3">Gate Pass Application</h5>
        <form (ngSubmit)="applyPass()">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label small fw-semibold">Date</label>
              <input type="date" class="form-control" [(ngModel)]="form.date" name="date" required>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-semibold">Leaving Time</label>
              <input type="time" class="form-control" [(ngModel)]="form.leavingTime" name="leavingTime" required>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-semibold">Expected Return Time</label>
              <input type="time" class="form-control" [(ngModel)]="form.returnTime" name="returnTime" required>
            </div>
            <div class="col-12">
              <label class="form-label small fw-semibold">Purpose / Reason</label>
              <input type="text" class="form-control" [(ngModel)]="form.reason" name="reason" placeholder="e.g. Market visit, Medical appointment" required>
            </div>
          </div>
          <button type="submit" class="btn btn-success mt-3"><i class="bi bi-send-fill"></i> Submit Pass Request</button>
        </form>
      </div>

      <div class="row g-4">
        <!-- Pass History -->
        <div class="col-lg-7">
          <div class="card border-0 shadow-sm p-3">
            <h5 class="fw-bold mb-3">Pass Request Records</h5>
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Pass ID</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of passes">
                    <td><strong>{{ item.id }}</strong></td>
                    <td>
                      <div>{{ item.date }}</div>
                      <small class="text-muted">{{ item.leavingTime }} - {{ item.returnTime }}</small>
                    </td>
                    <td>{{ item.reason }}</td>
                    <td>
                      <span class="badge" [ngClass]="{
                        'bg-warning text-dark': item.status === 'Pending',
                        'bg-success': item.status === 'Approved',
                        'bg-danger': item.status === 'Rejected'
                      }">{{ item.status }}</span>
                    </td>
                    <td>
                      <button *ngIf="item.status === 'Approved'" class="btn btn-sm btn-outline-primary" (click)="selectedPass = item">
                        <i class="bi bi-qr-code"></i> View Pass
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Generated Digital Pass Preview -->
        <div class="col-lg-5" *ngIf="selectedPass">
          <div class="card border-primary shadow p-4 text-center">
            <div class="badge bg-success mb-2 align-self-center py-2 px-3">VERIFIED DIGITAL PASS</div>
            <h5 class="fw-bold mb-1">{{ selectedPass.studentName }}</h5>
            <p class="text-muted small mb-3">ID: {{ selectedPass.studentId }} | Pass: {{ selectedPass.id }}</p>

            <div class="border border-2 border-dark p-3 d-inline-block mx-auto mb-3 bg-white" style="width: 140px; height: 140px;">
              <div class="d-flex align-items-center justify-content-center h-100 flex-column text-muted">
                <i class="bi bi-qr-code-scan fs-1 text-dark"></i>
                <span style="font-size: 0.65rem;">[DEMO QR]</span>
              </div>
            </div>

            <div class="text-start bg-light p-3 rounded small mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Valid Date:</span>
                <strong>{{ selectedPass.date }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Window:</span>
                <strong>{{ selectedPass.leavingTime }} to {{ selectedPass.returnTime }}</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Reason:</span>
                <span>{{ selectedPass.reason }}</span>
              </div>
            </div>

            <button class="btn btn-outline-secondary btn-sm" (click)="selectedPass = null">Close Preview</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentGatePassComponent implements OnInit {
  showForm = false;
  user: User | null = null;
  passes: GatePass[] = [];
  selectedPass: GatePass | null = null;
  form = { date: '', leavingTime: '', returnTime: '', reason: '' };

  constructor(private storage: StorageService, private audit: AuditNotificationService) {}

  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
    this.loadPasses();
  }

  loadPasses(): void {
    const list = this.storage.get<GatePass[]>('GATE_PASSES') || [];
    this.passes = list.filter(p => p.studentId === this.user?.id);
    if (this.passes.length > 0 && this.passes[0].status === 'Approved') {
      this.selectedPass = this.passes[0];
    }
  }

  applyPass(): void {
    if (!this.form.date || !this.form.leavingTime || !this.form.returnTime || !this.form.reason) return;
    const all = this.storage.get<GatePass[]>('GATE_PASSES') || [];
    const newPass: GatePass = {
      id: 'GP' + Math.floor(1000 + Math.random() * 9000),
      studentId: this.user?.id || 'STU001',
      studentName: this.user?.name || 'Dinakrushna Mohanta',
      date: this.form.date,
      leavingTime: this.form.leavingTime,
      returnTime: this.form.returnTime,
      reason: this.form.reason,
      status: 'Pending'
    };
    all.unshift(newPass);
    this.storage.set('GATE_PASSES', all);
    this.audit.logAudit(this.user?.name || 'Student', 'Requested Gate Pass', 'GatePass', newPass.id, `Valid on ${newPass.date}`);
    this.showForm = false;
    this.form = { date: '', leavingTime: '', returnTime: '', reason: '' };
    this.loadPasses();
  }
}