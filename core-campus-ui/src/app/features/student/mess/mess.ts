import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { MessFeedback, MessMenu, User } from '../../../core/models/campus.models';

@Component({
  selector: 'app-student-mess',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <h4 class="fw-bold mb-4">Hostel Mess Menu & Feedback</h4>

      <div class="row g-4 mb-4">
        <!-- Daily Menu Cards -->
        <div class="col-md-6" *ngFor="let m of weeklyMenu">
          <div class="card border-0 shadow-sm p-4 h-100">
            <h5 class="fw-bold text-primary mb-3"><i class="bi bi-calendar-check"></i> {{ m.day }}</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item px-0"><strong>Breakfast:</strong> {{ m.breakfast }}</li>
              <li class="list-group-item px-0"><strong>Lunch:</strong> {{ m.lunch }}</li>
              <li class="list-group-item px-0"><strong>Evening Snacks:</strong> {{ m.snacks }}</li>
              <li class="list-group-item px-0"><strong>Dinner:</strong> {{ m.dinner }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Feedback Section -->
      <div class="card border-0 shadow-sm p-4">
        <h5 class="fw-bold mb-3">Provide Daily Mess Feedback</h5>
        <form (ngSubmit)="submitFeedback()">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label small fw-semibold">Rating (1 to 5 Stars)</label>
              <select class="form-select" [(ngModel)]="rating" name="rating">
                <option [value]="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                <option [value]="4">⭐⭐⭐⭐ 4 - Good</option>
                <option [value]="3">⭐⭐⭐ 3 - Average</option>
                <option [value]="2">⭐⭐ 2 - Poor</option>
                <option [value]="1">⭐ 1 - Very Bad</option>
              </select>
            </div>
            <div class="col-md-9">
              <label class="form-label small fw-semibold">Comments & Dietary Notes</label>
              <input type="text" class="form-control" [(ngModel)]="comment" name="comment" placeholder="Describe taste, cleanliness, or item availability..." required>
            </div>
          </div>
          <button type="submit" class="btn btn-success mt-3"><i class="bi bi-star-fill"></i> Submit Review</button>
        </form>
      </div>
    </div>
  `
})
export class StudentMessComponent implements OnInit {
  weeklyMenu: MessMenu[] = [];
  rating = 4;
  comment = '';
  user: User | null = null;

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.user = this.storage.get<User>('CURRENT_USER');
    this.weeklyMenu = this.storage.get<MessMenu[]>('MESS_MENU') || [];
  }

  submitFeedback(): void {
    if (!this.comment) return;
    const all = this.storage.get<MessFeedback[]>('MESS_FEEDBACK') || [];
    all.unshift({
      id: 'MF' + Date.now(),
      studentName: this.user?.name || 'Dinakrushna Mohanta',
      rating: Number(this.rating),
      comment: this.comment,
      date: new Date().toISOString()
    });
    this.storage.set('MESS_FEEDBACK', all);
    alert('Thank you! Mess feedback registered.');
    this.comment = '';
  }
}