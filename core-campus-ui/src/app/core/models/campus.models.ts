export type UserRole = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  studentDetails?: Student;
}

export interface Student {
  studentId: string;
  rollNo: string;
  course: string;
  year: string;
  hostel: string;
  room: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subject: string;
  present: number;
  total: number;
  percentage: number;
}

export interface TimetableEntry {
  id: string;
  day: string;
  subject: string;
  faculty: string;
  room: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'MOVED' | 'CANCELLED';
  course: string;
  year: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface GatePass {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  leavingTime: string;
  returnTime: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  qrData?: string;
  approvedAt?: string;
}

export interface CertificateRequest {
  id: string;
  studentId: string;
  studentName: string;
  type: 'Bonafide Certificate' | 'Study Certificate' | 'Character Certificate' | 'Hostel Certificate';
  purpose: string;
  status: 'Requested' | 'Approved' | 'Generated' | 'Rejected';
  createdAt: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  category: 'Plumbing' | 'Electrical' | 'Cleaning' | 'Wi-Fi' | 'Furniture' | 'Other';
  location: string;
  room: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  assignedStaff?: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed' | 'Reopened';
  createdAt: string;
  adminNote?: string;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'Normal' | 'Important' | 'Urgent';
  targetAudience: {
    course?: string;
    year?: string;
    hostel?: string;
  };
  createdAt: string;
  readBy: string[]; // User IDs
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'REQUEST' | 'COMPLAINT' | 'NOTICE' | 'TIMETABLE' | 'GATE_PASS';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface MessMenu {
  id: string;
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface MessFeedback {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  type: string;
  total: number;
  paid: number;
  pending: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Pending';
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  description: string;
}