import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StorageService } from './core/services/storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('core-campus-ui');
  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    // Seeds demo users, complaints, timetable, and notices on first launch
    this.storage.initData();
  }
}
