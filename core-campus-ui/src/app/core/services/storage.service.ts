import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User, Staff, Complaint } from '../models/campus.models';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly PREFIX = 'CAMPUS_ONE_';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get<T>(key: string): T | null {
    if (!this.isBrowser) return null;
    try {
      const data = localStorage.getItem(this.PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, data: T): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage set error', e);
    }
  }

  remove(key: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (e) {
      console.error('Storage remove error', e);
    }
  }

  clearAllDemoData(): void {
    if (!this.isBrowser) return;
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(this.PREFIX)) {
          localStorage.removeItem(k);
        }
      });
      this.seedDemoData(true);
    } catch (e) {
      console.error('Storage clear error', e);
    }
  }

  initData(): void {
    if (!this.isBrowser) return;
    if (!this.get('INITIALIZED_V2')) {
      this.seedDemoData(true);
    } else {
      this.syncUserAccounts();
    }
  }

  private syncUserAccounts(): void {
    const existing = this.get<User[]>('USERS') || [];
    const masterUsers = this.getMasterUsers();
    
    // Merge or replace users to ensure working credentials without losing test additions
    const userMap = new Map<string, User>();
    existing.forEach(u => userMap.set(u.email.toLowerCase(), u));
    masterUsers.forEach(u => userMap.set(u.email.toLowerCase(), u));

    this.set('USERS', Array.from(userMap.values()));
    this.set('STAFF_MEMBERS', this.getDemoStaffList());
  }

  private getDemoStaffList(): Staff[] {
    return [
      { staffId: 'STF001', name: 'Plumbing Team', category: 'Plumbing', department: 'Hostel Maintenance' },
      { staffId: 'STF002', name: 'Electrical Team', category: 'Electrical', department: 'Maintenance' },
      { staffId: 'STF003', name: 'Cleaning Team', category: 'Cleaning', department: 'Housekeeping' },
      { staffId: 'STF004', name: 'Carpenter Team', category: 'Carpentry', department: 'Maintenance' },
      { staffId: 'STF005', name: 'Hostel Warden', category: 'Hostel', department: 'Hostel Administration' },
      { staffId: 'STF006', name: 'Security Team', category: 'Security', department: 'Campus Security' }
    ];
  }

  private getDemoStaffUsers(): User[] {
    const list = this.getDemoStaffList();
    return [
      {
        id: 'STF001',
        email: 'plumber@corecampus.demo',
        password: 'plumber123',
        name: 'Plumbing Team',
        role: 'STAFF',
        staffDetails: list[0]
      },
      {
        id: 'STF002',
        email: 'electrician@corecampus.demo',
        password: 'electrician123',
        name: 'Electrical Team',
        role: 'STAFF',
        staffDetails: list[1]
      },
      {
        id: 'STF003',
        email: 'cleaner@corecampus.demo',
        password: 'cleaner123',
        name: 'Cleaning Team',
        role: 'STAFF',
        staffDetails: list[2]
      },
      {
        id: 'STF004',
        email: 'carpenter@corecampus.demo',
        password: 'carpenter123',
        name: 'Carpenter Team',
        role: 'STAFF',
        staffDetails: list[3]
      },
      {
        id: 'STF005',
        email: 'warden@corecampus.demo',
        password: 'warden123',
        name: 'Hostel Warden',
        role: 'STAFF',
        staffDetails: list[4]
      },
      {
        id: 'STF006',
        email: 'security@corecampus.demo',
        password: 'security123',
        name: 'Security Team',
        role: 'STAFF',
        staffDetails: list[5]
      }
    ];
  }

  private getMasterUsers(): User[] {
    return [
      {
        id: 'STU001',
        email: 'student@corecampus.demo',
        password: 'student123',
        name: 'Dinakrushna Mohanta',
        role: 'STUDENT',
        studentDetails: {
          studentId: 'STU001',
          rollNo: 'MCA001',
          course: 'MCA',
          year: '2nd Year',
          hostel: 'Hostel A',
          room: 'A-204'
        }
      },
      {
        id: 'STU001_LEGACY',
        email: 'student@campusone.demo',
        password: 'student123',
        name: 'Dinakrushna Mohanta',
        role: 'STUDENT',
        studentDetails: {
          studentId: 'STU001',
          rollNo: 'MCA001',
          course: 'MCA',
          year: '2nd Year',
          hostel: 'Hostel A',
          room: 'A-204'
        }
      },
      {
        id: 'ADM001',
        email: 'admin@corecampus.demo',
        password: 'admin123',
        name: 'Campus Administrator',
        role: 'ADMIN'
      },
      {
        id: 'ADM001_LEGACY',
        email: 'admin@campusone.demo',
        password: 'admin123',
        name: 'Campus Administrator',
        role: 'ADMIN'
      },
      ...this.getDemoStaffUsers()
    ];
  }

  private seedDemoData(force: boolean = false): void {
    if (this.get('INITIALIZED_V2') && !force) return;

    this.set('USERS', this.getMasterUsers());
    this.set('STAFF_MEMBERS', this.getDemoStaffList());
    this.set('STAFF', [
      'Plumbing Team',
      'Electrical Team',
      'Cleaning Team',
      'Carpenter Team',
      'Hostel Warden',
      'Security Team',
      'Academic Office'
    ]);

    const now = new Date();
    const subDays = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

    const complaints: Complaint[] = [
      {
        id: 'CMP001',
        studentId: 'STU001',
        studentName: 'Dinakrushna Mohanta',
        title: 'Water leakage in Hostel A',
        category: 'Plumbing',
        location: 'Hostel A',
        room: 'A-204',
        description: 'Severe bathroom tap leakage causing water loss.',
        priority: 'High',
        assignedStaff: 'Plumbing Team',
        assignedStaffId: 'STF001',
        assignedStaffName: 'Plumbing Team',
        assignedAt: subDays(1),
        acceptedAt: subDays(1),
        startedAt: subDays(0),
        status: 'In Progress',
        createdAt: subDays(2)
      },
      {
        id: 'CMP002',
        studentId: 'STU001',
        studentName: 'Dinakrushna Mohanta',
        title: 'Fan not working',
        category: 'Electrical',
        location: 'Hostel A',
        room: 'A-204',
        description: 'Ceiling regulator sparking and fan stopped spinning.',
        priority: 'High',
        assignedStaff: 'Electrical Team',
        assignedStaffId: 'STF002',
        assignedStaffName: 'Electrical Team',
        assignedAt: subDays(1),
        status: 'Assigned',
        createdAt: subDays(1)
      },
      {
        id: 'CMP003',
        studentId: 'STU001',
        studentName: 'Dinakrushna Mohanta',
        title: 'Hostel corridor cleaning required',
        category: 'Cleaning',
        location: 'Hostel A',
        room: '2nd Floor Corridor',
        description: 'Dustbins overflowing near staircase.',
        priority: 'Medium',
        assignedStaff: 'Cleaning Team',
        assignedStaffId: 'STF003',
        assignedStaffName: 'Cleaning Team',
        assignedAt: subDays(3),
        acceptedAt: subDays(3),
        startedAt: subDays(2),
        resolvedAt: subDays(1),
        resolutionNote: 'Corridor washed, waste bags replaced and sanitized.',
        status: 'Resolved',
        createdAt: subDays(4)
      }
    ];
    this.set('COMPLAINTS', complaints);

    // Initial Audit logs
    this.set('AUDIT_LOGS', [
      {
        id: 'LOG101',
        user: 'Plumbing Team',
        action: 'Work Started',
        entityType: 'Complaint',
        entityId: 'CMP001',
        timestamp: subDays(0),
        description: 'Plumbing Team marked CMP001 as In Progress.'
      },
      {
        id: 'LOG102',
        user: 'Campus Administrator',
        action: 'Complaint Assigned',
        entityType: 'Complaint',
        entityId: 'CMP002',
        timestamp: subDays(1),
        description: 'Admin assigned CMP002 to Electrical Team.'
      }
    ]);

    // Seed Attendance
    this.set('ATTENDANCE', [
      { id: 'ATT1', studentId: 'STU001', subject: '.NET Core & C#', present: 46, total: 50, percentage: 92 },
      { id: 'ATT2', studentId: 'STU001', subject: 'DBMS & SQL', present: 42, total: 50, percentage: 84 },
      { id: 'ATT3', studentId: 'STU001', subject: 'Advanced Java', present: 39, total: 50, percentage: 78 },
      { id: 'ATT4', studentId: 'STU001', subject: 'Discrete Mathematics', present: 44, total: 50, percentage: 88 },
      { id: 'ATT5', studentId: 'STU001', subject: 'Cloud Computing', present: 35, total: 50, percentage: 70 }
    ]);

    // Seed Timetable
    this.set('TIMETABLE', [
      { id: 'TT1', day: 'Monday', subject: '.NET Core & C#', faculty: 'Dr. S. Mishra', room: 'Room 201', startTime: '09:00 AM', endTime: '10:00 AM', status: 'SCHEDULED', course: 'MCA', year: '2nd Year' },
      { id: 'TT2', day: 'Monday', subject: 'DBMS & SQL', faculty: 'Prof. R. Sharma', room: 'Lab 2', startTime: '10:00 AM', endTime: '12:00 PM', status: 'SCHEDULED', course: 'MCA', year: '2nd Year' },
      { id: 'TT3', day: 'Monday', subject: 'Advanced Java', faculty: 'Prof. K. Patnaik', room: 'Room 105', startTime: '01:30 PM', endTime: '02:30 PM', status: 'SCHEDULED', course: 'MCA', year: '2nd Year' },
      { id: 'TT4', day: 'Tuesday', subject: 'Discrete Mathematics', faculty: 'Dr. A. Behera', room: 'Room 202', startTime: '09:00 AM', endTime: '10:00 AM', status: 'SCHEDULED', course: 'MCA', year: '2nd Year' }
    ]);

    // Seed Notices
    this.set('NOTICES', [
      {
        id: 'NOT1',
        title: 'MCA 2nd Year Project Guidelines Submission',
        description: 'All 2nd year MCA students must submit final project synopses by Friday.',
        category: 'Academic',
        priority: 'Important',
        targetAudience: { course: 'MCA', year: '2nd Year' },
        createdAt: subDays(0),
        readBy: []
      },
      {
        id: 'NOT2',
        title: 'Hostel A Water Maintenance Notice',
        description: 'Water supply to Hostel A will be suspended between 2 PM and 4 PM tomorrow for tank cleaning.',
        category: 'Hostel',
        priority: 'Urgent',
        targetAudience: { hostel: 'Hostel A' },
        createdAt: subDays(1),
        readBy: ['STU001']
      }
    ]);

    // Seed Gate Passes
    this.set('GATE_PASSES', [
      {
        id: 'GP1001',
        studentId: 'STU001',
        studentName: 'Dinakrushna Mohanta',
        date: new Date().toISOString().split('T')[0],
        leavingTime: '05:00 PM',
        returnTime: '08:30 PM',
        reason: 'Market visit for academic supplies',
        status: 'Approved',
        qrData: 'CAMPUS1-GP1001-STU001-APPROVED',
        approvedAt: subDays(0)
      }
    ]);

    // Seed Certificates
    this.set('CERTIFICATES', [
      {
        id: 'CR1001',
        studentId: 'STU001',
        studentName: 'Dinakrushna Mohanta',
        type: 'Bonafide Certificate',
        purpose: 'Application for State Scholarship',
        status: 'Requested',
        createdAt: subDays(1)
      }
    ]);

    // Seed Fees
    this.set('FEES', [
      { id: 'FEE1', studentId: 'STU001', type: 'Tuition Fee - 4th Sem', total: 45000, paid: 40000, pending: 5000, dueDate: '2026-09-30', status: 'Partial' },
      { id: 'FEE2', studentId: 'STU001', type: 'Hostel & Mess Fee', total: 22000, paid: 22000, pending: 0, dueDate: '2026-08-15', status: 'Paid' }
    ]);

    // Seed Mess
    this.set('MESS_MENU', [
      { id: 'M1', day: 'Monday', breakfast: 'Idli, Sambar, Chutney', lunch: 'Rice, Dal, Paneer Butter Masala', snacks: 'Veg Pakora, Chai', dinner: 'Roti, Dal Tadka, Mix Veg' },
      { id: 'M2', day: 'Tuesday', breakfast: 'Puri, Aloo Dum', lunch: 'Rice, Dalma, Fish Curry / Soya', snacks: 'Samosa, Tea', dinner: 'Roti, Tadka Dal, Egg Bhurji' }
    ]);

    // Seed Notifications
    this.set('NOTIFICATIONS', [
      { id: 'N1', userId: 'STU001', title: 'Work Started', message: 'Plumbing Team has started work on CMP001', type: 'COMPLAINT', isRead: false, createdAt: subDays(0) }
    ]);

    this.set('INITIALIZED_V2', true);
  }
}