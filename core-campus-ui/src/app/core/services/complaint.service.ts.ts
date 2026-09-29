import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Complaint } from '../models/campus.models';
import { AuditNotificationService } from './audit-notification.service';

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  constructor(private storage: StorageService, private audit: AuditNotificationService) {}

  getAll(): Complaint[] {
    return this.storage.get<Complaint[]>('COMPLAINTS') || [];
  }

  create(c: Partial<Complaint>): Complaint {
    const list = this.getAll();
    const newComplaint: Complaint = {
      id: 'CMP' + Math.floor(1000 + Math.random() * 9000),
      studentId: c.studentId || 'STU001',
      studentName: c.studentName || 'Dinakrushna Mohanta',
      category: c.category || 'Plumbing',
      location: c.location || 'Hostel A',
      room: c.room || 'A-204',
      description: c.description || '',
      priority: c.priority || 'Medium',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    list.unshift(newComplaint);
    this.storage.set('COMPLAINTS', list);
    this.audit.logAudit(newComplaint.studentName, 'Reported Complaint', 'Complaint', newComplaint.id, `Reported ${newComplaint.category} issue at ${newComplaint.location}`);
    return newComplaint;
  }

  update(complaint: Complaint, adminName: string): void {
    const list = this.getAll();
    const index = list.findIndex(x => x.id === complaint.id);
    if (index !== -1) {
      list[index] = complaint;
      this.storage.set('COMPLAINTS', list);
      this.audit.logAudit(adminName, `Updated Complaint status to ${complaint.status}`, 'Complaint', complaint.id, `Assigned: ${complaint.assignedStaff || 'None'}`);

      if (complaint.status === 'Resolved') {
        this.audit.notify(complaint.studentId, 'Complaint Resolved', `Your complaint ${complaint.id} has been marked resolved. Please confirm closure.`, 'COMPLAINT');
      }
    }
  }

  calculateAge(dateString: string): number {
    const created = new Date(dateString).getTime();
    const diffTime = Math.abs(Date.now() - created);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
}