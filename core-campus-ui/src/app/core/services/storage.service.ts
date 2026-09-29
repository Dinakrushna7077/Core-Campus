import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly PREFIX = 'CAMPUS_ONE_';

  get<T>(key: string): T | null {
    const data = localStorage.getItem(this.PREFIX + key);
    return data ? JSON.parse(data) : null;
  }

  set<T>(key: string, data: T): void {
    localStorage.setItem(this.PREFIX + key, JSON.stringify(data));
  }

  remove(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  clearAllDemoData(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    this.seedDemoData(true);
  }

  initData(): void {
    if (!this.get('INITIALIZED')) {
      this.seedDemoData(false);
    }
  }

  private seedDemoData(force: boolean = false): void {
    if (this.get('INITIALIZED') && !force) return;

    // Seed Demo Users
    this.set('USERS', [
      {
        id: 'STU001',
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
        email: 'admin@campusone.demo',
        password: 'admin123',
        name: 'Campus Administrator',
        role: 'ADMIN'
      }
    ]);

    // Seed Staff
    this.set('STAFF', [
      'Plumbing Team',
      'Electrical Team',
      'Cleaning Team',
      'Academic Office',
      'Hostel Warden'
    ]);

    // Attendance Records for Dinakrushna
    this.set('ATTENDANCE', [
      { id: 'ATT1', studentId: 'STU001', subject: '.NET Core & C#', present: 46, total: 50, percentage: 92 },
      { id: 'ATT2', studentId: 'STU001', subject: 'DBMS & SQL', present: 42, total: 50, percentage: 84 },
      { id: 'ATT3', studentId: 'STU001', subject: 'Advanced Java', present: 39, total: 50, percentage: 78 },
      { id: 'ATT4', studentId: 'STU001', subject: 'Discrete Mathematics', present: 44, total: 50, percentage: 88 },
      { id: 'ATT5', studentId: 'STU001', subject: 'Cloud Computing', present: 35, total: 50, percentage: 70 }
    ]);

    // Timetable Entries
    this.set('TIMETABLE', [
      { id: 'TT1', day: 'Monday', subject: '.NET Core & C#', faculty: 'Dr. S. Mishra', room: 'Room 201', startTime: '09:00 AM', endTime: '10:00 AM', status: 'SCHEDULED', course: 'MCA', year: '2nd Year' },
      { id: 'TT2', day: 'Monday', subject: 'DBMS & SQL', faculty: 'Prof. R. Sharma', room: 'Lab 2', startTime: '10:00 AM', endTime: '12:00 PM', status: 'SCHEDULED', course: 'MCA', year: '2nd Year' },
      { id: 'TT3', day: 'Monday', subject: 'Advanced Java', faculty: 'Prof. K. Patnaik', room: 'Room 105', startTime: '01:30 PM', endTime: '02:30 PM', status: 'SCHEDULED', course: 'MCA', year: '2nd Year' },
      { id: 'TT4', day: 'Tuesday', subject: 'Discrete Mathematics', faculty: 'Dr. A. Behera', room: 'Room 202', startTime: '09:00 AM', endTime: '10:00 AM', status: 'SCHEDULED', course: 'MCA', year: '2nd Year' },
      { id: 'TT5', day: 'Tuesday', subject: 'Cloud Computing', faculty: 'Prof. N. Jena', room: 'Room 201', startTime: '10:00 AM', endTime: '11:00 AM', status: 'SCHEDULED', course: 'MCA', year: '2nd Year' }
    ]);

    // Seed Complaints (Realistic Ageing & Distribution)
    const now = new Date();
    const subDays = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

    this.set('COMPLAINTS', [
      {
        id: 'CMP1021',
        studentId: 'STU001',
        studentName: 'Dinakrushna Mohanta',
        category: 'Plumbing',
        location: 'Hostel A',
        room: 'A-204',
        description: 'Bathroom tap leaking continuously for several days.',
        priority: 'High',
        status: 'Pending',
        createdAt: subDays(1)
      },
      {
        id: 'CMP1018',
        studentId: 'STU002',
        studentName: 'Rahul Nayak',
        category: 'Plumbing',
        location: 'Hostel A',
        room: 'A-102',
        description: 'Shower head broken and water pressure low.',
        priority: 'Medium',
        assignedStaff: 'Plumbing Team',
        status: 'In Progress',
        createdAt: subDays(4)
      },
      {
        id: 'CMP1015',
        studentId: 'STU003',
        studentName: 'Swati Das',
        category: 'Plumbing',
        location: 'Hostel A',
        room: 'A-312',
        description: 'Main drainage block on 3rd-floor common washroom.',
        priority: 'High',
        assignedStaff: 'Plumbing Team',
        status: 'Assigned',
        createdAt: subDays(8)
      },
      {
        id: 'CMP1009',
        studentId: 'STU004',
        studentName: 'Pooja Sethi',
        category: 'Electrical',
        location: 'Hostel B',
        room: 'B-105',
        description: 'Ceiling fan making squeaking noise and running slow.',
        priority: 'Low',
        assignedStaff: 'Electrical Team',
        status: 'In Progress',
        createdAt: subDays(11)
      },
      {
        id: 'CMP1005',
        studentId: 'STU005',
        studentName: 'Amit Tripathy',
        category: 'Wi-Fi',
        location: 'Library',
        room: 'Reading Hall 1',
        description: 'No internet access on 5GHz band.',
        priority: 'Medium',
        status: 'Pending',
        createdAt: subDays(2)
      }
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

    // Seed Mess Menus
    this.set('MESS_MENU', [
      { id: 'M1', day: 'Monday', breakfast: 'Idli, Sambar, Coconut Chutney, Tea/Coffee', lunch: 'Rice, Dal, Paneer Butter Masala, Papad, Curd', snacks: 'Veg Pakora, Masala Chai', dinner: 'Roti, Dal Tadka, Mix Veg, Gulab Jamun' },
      { id: 'M2', day: 'Tuesday', breakfast: 'Puri, Aloo Dum, Boiled Egg/Banana', lunch: 'Rice, Dalma, Fish Curry / Soya Chunk Curry, Salad', snacks: 'Samosa, Tea', dinner: 'Roti, Tadka Dal, Egg Bhurji / Paneer' }
    ]);

    // Seed Mess Feedback
    this.set('MESS_FEEDBACK', [
      { id: 'MF1', studentName: 'Dinakrushna Mohanta', rating: 4, comment: 'Paneer quality was good on Monday.', date: subDays(1) }
    ]);

    // Seed Notifications
    this.set('NOTIFICATIONS', [
      { id: 'N1', userId: 'STU001', title: 'Gate Pass Approved', message: 'Your Gate Pass GP1001 has been approved by the Warden.', type: 'GATE_PASS', isRead: false, createdAt: subDays(0) },
      { id: 'N2', userId: 'STU001', title: 'New Notice Posted', message: 'MCA 2nd Year Project Guidelines Submission has been posted.', type: 'NOTICE', isRead: false, createdAt: subDays(0) }
    ]);

    // Seed Audit Logs
    this.set('AUDIT_LOGS', [
      { id: 'LOG1', user: 'Campus Administrator', action: 'Approved Gate Pass', entityType: 'GatePass', entityId: 'GP1001', timestamp: subDays(0), description: 'Admin approved Gate Pass GP1001 for Dinakrushna Mohanta.' }
    ]);

    this.set('INITIALIZED', true);
  }
}