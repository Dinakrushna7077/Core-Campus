import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { Notice,Complaint,AttendanceRecord,TimetableEntry,User } from '../../../core/models/campus.models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="mb-4">
        <h3 class="fw-bold text-dark">Good morning, {{ user?.name }}</h3>
        <p class="text-muted">{{ user?.studentDetails?.course }} {{ user?.studentDetails?.year }} | {{ user?.studentDetails?.hostel }} Room {{ user?.studentDetails?.room }}</p>
      </div>

      <!-- Metric KPI Cards -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card p-3 border-0 bg-primary text-white">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="small">Overall Attendance</div>
                <h2 class="fw-bold my-1">{{ avgAttendance }}%</h2>
              </div>
              <i class="bi bi-calendar-check fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card p-3 border-0 bg-warning text-dark">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="small">Open Complaints</div>
                <h2 class="fw-bold my-1">{{ openComplaintsCount }}</h2>
              </div>
              <i class="bi bi-tools fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card p-3 border-0 bg-info text-white">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="small">Pending Requests</div>
                <h2 class="fw-bold my-1">{{ pendingRequestsCount }}</h2>
              </div>
              <i class="bi bi-file-earmark-medical fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card p-3 border-0 bg-success text-white">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="small">Active Gate Passes</div>
                <h2 class="fw-bold my-1">{{ activeGatePasses }}</h2>
              </div>
              <i class="bi bi-door-open fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="card mb-4 p-3">
        <h6 class="fw-bold mb-3">Quick Workflows</h6>
        <div class="d-flex flex-wrap gap-2">
          <a routerLink="/student/complaints" class="btn btn-outline-danger"><i class="bi bi-tools"></i> Report Complaint</a>
          <a routerLink="/student/gate-pass" class="btn btn-outline-primary"><i class="bi bi-door-open"></i> Request Gate Pass</a>
          <a routerLink="/student/certificates" class="btn btn-outline-secondary"><i class="bi bi-file-earmark-check"></i> Request Certificate</a>
          <a routerLink="/student/timetable" class="btn btn-outline-info"><i class="bi bi-calendar"></i> View Timetable</a>
        </div>
      </div>

      <div class="row g-4">
        <!-- Timetable Snippet -->
        <div class="col-md-6">
          <div class="card p-3 h-100">
            <h6 class="fw-bold mb-3"><i class="bi bi-clock-history"></i> Today's Schedule</h6>
            <div *ngFor="let tt of todayTimetable" class="p-2 border-bottom d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ tt.subject }}</strong>
                <div class="small text-muted">{{ tt.faculty }} | {{ tt.room }}</div>
              </div>
              <span class="badge bg-light text-dark border">{{ tt.startTime }}</span>
            </div>
          </div>
        </div>

        <!-- Targeted Notices -->
        <div class="col-md-6">
          <div class="card p-3 h-100">
            <h6 class="fw-bold mb-3"><i class="bi bi-megaphone"></i> Latest Notices for You</h6>
            <div *ngFor="let n of targetedNotices" class="p-2 border-bottom">
              <div class="d-flex justify-content-between">
                <strong class="text-primary">{{ n.title }}</strong>
                <span class="badge bg-secondary">{{ n.category }}</span>
              </div>
              <p class="small text-muted mb-1">{{ n.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  user: User | null = null;
  avgAttendance = 84;
  openComplaintsCount = 0;
  pendingRequestsCount = 1;
  activeGatePasses = 1;
  todayTimetable: TimetableEntry[] = [];
  targetedNotices: Notice[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
    const complaints = this.storage.get<Complaint[]>('COMPLAINTS') || [];
    this.openComplaintsCount = complaints.filter(c => c.studentId === this.user?.id && c.status !== 'Closed').length;

    const timetable = this.storage.get<TimetableEntry[]>('TIMETABLE') || [];
    this.todayTimetable = timetable.slice(0, 3);

    const notices = this.storage.get<Notice[]>('NOTICES') || [];
    this.targetedNotices = notices.slice(0, 3);
  }
}