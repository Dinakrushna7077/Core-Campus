import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { TimetableEntry } from '../../../core/models/campus.models';

@Component({
  selector: 'app-student-timetable',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h4 class="fw-bold mb-3">Academic Timetable</h4>

      <div class="card border-0 shadow-sm p-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Day</th>
                <th>Time Window</th>
                <th>Subject</th>
                <th>Faculty</th>
                <th>Assigned Room</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of timetable">
                <td><span class="badge bg-secondary">{{ item.day }}</span></td>
                <td>{{ item.startTime }} – {{ item.endTime }}</td>
                <td class="fw-semibold">{{ item.subject }}</td>
                <td>{{ item.faculty }}</td>
                <td>
                  <span [ngClass]="{'badge bg-warning text-dark': item.status === 'MOVED'}">
                    {{ item.room }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-success': item.status === 'SCHEDULED',
                    'bg-warning text-dark': item.status === 'MOVED',
                    'bg-danger': item.status === 'CANCELLED'
                  }">{{ item.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class StudentTimetableComponent implements OnInit {
  timetable: TimetableEntry[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.timetable = this.storage.get<TimetableEntry[]>('TIMETABLE') || [];
  }
}