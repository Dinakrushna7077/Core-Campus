import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { FeeRecord,User } from '../../../core/models/campus.models';

@Component({
  selector: 'app-student-fees',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h4 class="fw-bold mb-4">Semester Fees & Outstanding Dues</h4>

      <div class="row g-4">
        <div class="col-md-6" *ngFor="let fee of fees">
          <div class="card border-0 shadow-sm p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold mb-0">{{ fee.type }}</h5>
              <span class="badge" [ngClass]="fee.pending === 0 ? 'bg-success' : 'bg-warning text-dark'">
                {{ fee.status }}
              </span>
            </div>

            <div class="row g-2 my-2 text-center">
              <div class="col-4 bg-light p-2 rounded">
                <small class="text-muted d-block">Total</small>
                <strong>₹{{ fee.total | number }}</strong>
              </div>
              <div class="col-4 bg-light p-2 rounded">
                <small class="text-muted d-block">Paid</small>
                <strong class="text-success">₹{{ fee.paid | number }}</strong>
              </div>
              <div class="col-4 bg-light p-2 rounded">
                <small class="text-muted d-block">Pending</small>
                <strong class="text-danger">₹{{ fee.pending | number }}</strong>
              </div>
            </div>

            <div class="small text-muted mt-2">
              <i class="bi bi-calendar"></i> Due Date: <strong>{{ fee.dueDate }}</strong>
            </div>

            <button *ngIf="fee.pending > 0" class="btn btn-outline-primary btn-sm mt-3 w-100" (click)="payDemo(fee)">
              Pay Outstanding Dues (Demo Gateway)
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentFeesComponent implements OnInit {
  fees: FeeRecord[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    const user = this.storage.get<User>('CURRENT_USER');
    const all = this.storage.get<FeeRecord[]>('FEES') || [];
    this.fees = all.filter(f => f.studentId === user?.id);
  }

  payDemo(f: FeeRecord): void {
    f.paid += f.pending;
    f.pending = 0;
    f.status = 'Paid';
    const all = this.storage.get<FeeRecord[]>('FEES') || [];
    const idx = all.findIndex(x => x.id === f.id);
    if (idx !== -1) {
      all[idx] = f;
      this.storage.set('FEES', all);
      alert('Demo Payment Processed Successfully!');
    }
  }
}