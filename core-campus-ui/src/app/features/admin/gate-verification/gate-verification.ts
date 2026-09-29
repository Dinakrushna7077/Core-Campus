import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { GatePass } from '../../../core/models/campus.models';

@Component({
  selector: 'app-gate-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <h4 class="fw-bold mb-3">Security Gate Verification Console</h4>
      <div class="row">
        <div class="col-md-6">
          <div class="card p-3 mb-4">
            <label class="form-label fw-bold">Scan / Enter Gate Pass ID</label>
            <div class="input-group mb-3">
              <input type="text" class="form-control" [(ngModel)]="searchPassId" placeholder="e.g. GP1001">
              <button class="btn btn-primary" (click)="verifyPass()">Verify Pass</button>
            </div>

            <!-- Verification Output -->
            <div *ngIf="verificationResult" class="p-3 rounded text-center" [ngClass]="verificationResult.isValid ? 'bg-success text-white' : 'bg-danger text-white'">
              <i class="bi fs-1" [ngClass]="verificationResult.isValid ? 'bi-patch-check-fill' : 'bi-x-octagon-fill'"></i>
              <h4 class="mt-2">{{ verificationResult.statusText }}</h4>
              <div *ngIf="verificationResult.pass" class="small mt-2">
                <div>Student: {{ verificationResult.pass.studentName }} ({{ verificationResult.pass.studentId }})</div>
                <div>Time: Out {{ verificationResult.pass.leavingTime }} | Return: {{ verificationResult.pass.returnTime }}</div>
                <div>Reason: {{ verificationResult.pass.reason }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Available Passes for Security -->
        <div class="col-md-6">
          <div class="card p-3">
            <h6 class="fw-bold mb-3">Active Approved Passes Today</h6>
            <ul class="list-group">
              <li *ngFor="let p of approvedPasses" class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{{ p.id }}</strong> - {{ p.studentName }}
                  <div class="small text-muted">{{ p.leavingTime }} - {{ p.returnTime }}</div>
                </div>
                <button class="btn btn-sm btn-outline-primary" (click)="quickCheck(p.id)">Check</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GateVerificationComponent implements OnInit {
  searchPassId = '';
  approvedPasses: GatePass[] = [];
  verificationResult: { isValid: boolean; statusText: string; pass?: GatePass } | null = null;

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    const list = this.storage.get<GatePass[]>('GATE_PASSES') || [];
    this.approvedPasses = list.filter(p => p.status === 'Approved');
  }

  verifyPass(): void {
    const list = this.storage.get<GatePass[]>('GATE_PASSES') || [];
    const pass = list.find(p => p.id.toUpperCase() === this.searchPassId.trim().toUpperCase());

    if (pass && pass.status === 'Approved') {
      this.verificationResult = { isValid: true, statusText: 'VALID GATE PASS', pass };
    } else {
      this.verificationResult = { isValid: false, statusText: 'INVALID OR EXPIRED PASS' };
    }
  }

  quickCheck(id: string): void {
    this.searchPassId = id;
    this.verifyPass();
  }
}