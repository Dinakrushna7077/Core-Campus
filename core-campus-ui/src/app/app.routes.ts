import { Routes } from '@angular/router';
import { PortalFrameComponent } from './portal-frame.component';
export const routes: Routes = [
  { path: '', component: PortalFrameComponent, data: { page: 'index.html', label: 'Sign in' } }, 
  { path: 'login', component: PortalFrameComponent, data: { page: 'index.html', label: 'Sign in' } }, 
  { path: 'student', component: PortalFrameComponent, data: { page: 'student.html', label: 'Student portal' } }, 
  { path: 'faculty', component: PortalFrameComponent, data: { page: 'faculty.html', label: 'Faculty portal' } }, 
  { path: 'admin', component: PortalFrameComponent, data: { page: 'admin.html', label: 'Administration portal' } }, 
  { path: '**', redirectTo: '' }
];
