import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { AttendanceRecord,User } from '../../../core/models/campus.models';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 class="fw-bold mb-0">Class Attendance Summary</h4>
          <small class="text-muted">Minimum 75% attendance required for semester examinations</small>
        </div>
      </div>

      <div class="row g-3">
        <div *ngFor="let record of attendanceList" class="col-md-6 col-lg-4">
          <div class="card p-3 border-0 shadow-sm h-100" [ngClass]="{'border-start border-danger border-4': record.percentage < 75}">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h6 class="fw-bold text-dark mb-0">{{ record.subject }}</h6>
              <span class="badge" [ngClass]="record.percentage < 75 ? 'bg-danger' : 'bg-success'">
                {{ record.percentage }}%
              </span>
            </div>

            <div class="small text-muted mb-2">
              Attended: <strong>{{ record.present }}</strong> / {{ record.total }} sessions
            </div>

            <div class="progress" style="height: 8px;">
              <div
                class="progress-bar"
                [ngClass]="record.percentage < 75 ? 'bg-danger' : 'bg-success'"
                [style.width.%]="record.percentage"
              ></div>
            </div>

            <div *ngIf="record.percentage < 75" class="small text-danger fw-semibold mt-2">
              <i class="bi bi-exclamation-triangle-fill"></i> Below mandatory 75% threshold!
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentAttendanceComponent implements OnInit {
  attendanceList: AttendanceRecord[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    const user = this.storage.get<User>('CURRENT_USER');
    const all = this.storage.get<AttendanceRecord[]>('ATTENDANCE') || [];
    this.attendanceList = all.filter(a => a.studentId === user?.id);
  }
}