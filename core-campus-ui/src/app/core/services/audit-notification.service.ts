import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { AuditLog, Notification } from '../models/campus.models';

@Injectable({ providedIn: 'root' })
export class AuditNotificationService {
  constructor(private storage: StorageService) {}

  logAudit(user: string, action: string, entityType: string, entityId: string, description: string): void {
    const logs = this.storage.get<AuditLog[]>('AUDIT_LOGS') || [];
    const newLog: AuditLog = {
      id: 'LOG' + (Date.now() % 100000),
      user,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      description
    };
    logs.unshift(newLog);
    this.storage.set('AUDIT_LOGS', logs);
  }

  notify(userId: string, title: string, message: string, type: any): void {
    const list = this.storage.get<Notification[]>('NOTIFICATIONS') || [];
    const n: Notification = {
      id: 'N' + (Date.now() % 100000),
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    list.unshift(n);
    this.storage.set('NOTIFICATIONS', list);
  }
}