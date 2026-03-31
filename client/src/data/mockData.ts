// Mock Data for College Management System

export type UserRole = 'student' | 'faculty' | 'hod' | 'principal' | 'coe' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  year?: number;
  avatar?: string;
}

export const mockUsers: User[] = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@college.edu', role: 'student', department: 'Computer Science' },
  { id: '2', name: 'Dr. Priya Patel', email: 'priya@college.edu', role: 'faculty', department: 'Computer Science' },
  { id: '3', name: 'Dr. Anil Kumar', email: 'anil@college.edu', role: 'hod', department: 'Computer Science' },
  { id: '4', name: 'Dr. Sunita Verma', email: 'sunita@college.edu', role: 'principal' },
  { id: '5', name: 'Mr. Rajesh Singh', email: 'rajesh@college.edu', role: 'coe' },
  { id: '6', name: 'Admin User', email: 'admin@college.edu', role: 'admin' },
];

export interface AttendanceRecord {
  subject: string;
  subjectCode: string;
  totalClasses: number;
  attended: number;
  percentage: number;
}

export const mockAttendance: AttendanceRecord[] = [
  { subject: 'Data Structures', subjectCode: 'CS301', totalClasses: 45, attended: 42, percentage: 93 },
  { subject: 'Database Systems', subjectCode: 'CS302', totalClasses: 40, attended: 35, percentage: 88 },
  { subject: 'Operating Systems', subjectCode: 'CS303', totalClasses: 42, attended: 38, percentage: 90 },
  { subject: 'Computer Networks', subjectCode: 'CS304', totalClasses: 38, attended: 30, percentage: 79 },
  { subject: 'Software Engineering', subjectCode: 'CS305', totalClasses: 35, attended: 33, percentage: 94 },
];

export interface InternalMark {
  subject: string;
  subjectCode: string;
  cia1: number;
  cia2: number;
  assignment: number;
  total: number;
  maxMarks: number;
}

export const mockMarks: InternalMark[] = [
  { subject: 'Data Structures', subjectCode: 'CS301', cia1: 18, cia2: 19, assignment: 9, total: 46, maxMarks: 50 },
  { subject: 'Database Systems', subjectCode: 'CS302', cia1: 16, cia2: 17, assignment: 8, total: 41, maxMarks: 50 },
  { subject: 'Operating Systems', subjectCode: 'CS303', cia1: 17, cia2: 18, assignment: 9, total: 44, maxMarks: 50 },
  { subject: 'Computer Networks', subjectCode: 'CS304', cia1: 15, cia2: 16, assignment: 8, total: 39, maxMarks: 50 },
  { subject: 'Software Engineering', subjectCode: 'CS305', cia1: 19, cia2: 18, assignment: 10, total: 47, maxMarks: 50 },
];

export interface Notice {
  id: string;
  title: string;
  content: string;
  date?: string;
  createdAt?: string;
  priority: 'high' | 'medium' | 'low';
  author: string;
  authorRole: UserRole;
}

export const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'End Semester Examination Schedule',
    content: 'The end semester examinations will commence from December 15, 2024. Detailed timetable will be published soon.',
    date: '2024-12-01',
    priority: 'high',
    author: 'Dr. Sunita Verma',
    authorRole: 'principal',
  },
  {
    id: '2',
    title: 'Workshop on AI/ML',
    content: 'A two-day workshop on Artificial Intelligence and Machine Learning will be conducted on December 10-11.',
    date: '2024-12-03',
    priority: 'medium',
    author: 'Dr. Priya Patel',
    authorRole: 'faculty',
  },
  {
    id: '3',
    title: 'Library Timing Change',
    content: 'Library will remain open till 10 PM during examination period.',
    date: '2024-12-05',
    priority: 'low',
    author: 'Admin User',
    authorRole: 'admin',
  },
];

export interface Grievance {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'escalated';
  submittedBy: string;
  submittedDate?: string;
  createdAt?: string;
  category: string;
  department?: string;
}

export const mockGrievances: Grievance[] = [
  // {
  //   id: 'GRV001',
  //   title: 'AC not working in Lab 3',
  //   description: 'The air conditioning unit in Computer Lab 3 has not been functioning for the past week.',
  //   status: 'in-progress',
  //   submittedBy: 'Rahul Sharma',
  //   submittedDate: '2024-12-01',
  //   category: 'Infrastructure',
  //   department: 'Computer Science',
  // },
  // {
  //   id: 'GRV002',
  //   title: 'Attendance discrepancy',
  //   description: 'My attendance for CS302 shows 75% but I have attended all classes.',
  //   status: 'pending',
  //   submittedBy: 'Priya Mehta',
  //   submittedDate: '2024-12-03',
  //   category: 'Academic',
  //   department: 'Computer Science',
  // },
  // {
  //   id: 'GRV003',
  //   title: 'Exam hall allocation issue',
  //   description: 'The exam schedule shows conflicting timing for two subjects.',
  //   status: 'escalated',
  //   submittedBy: 'Amit Kumar',
  //   submittedDate: '2024-12-05',
  //   category: 'Examination',
  // },
];

export interface FeedbackReport {
  facultyName: string;
  subject: string;
  avgRating: number;
  totalResponses: number;
  categories: {
    teaching: number;
    communication: number;
    punctuality: number;
    knowledge: number;
  };
}

export const mockFeedback: FeedbackReport[] = [
  {
    facultyName: 'Dr. Priya Patel',
    subject: 'Data Structures',
    avgRating: 4.5,
    totalResponses: 45,
    categories: { teaching: 4.6, communication: 4.4, punctuality: 4.7, knowledge: 4.8 },
  },
  {
    facultyName: 'Dr. Ravi Kumar',
    subject: 'Database Systems',
    avgRating: 4.2,
    totalResponses: 42,
    categories: { teaching: 4.3, communication: 4.1, punctuality: 4.0, knowledge: 4.5 },
  },
  {
    facultyName: 'Prof. Meena Shah',
    subject: 'Operating Systems',
    avgRating: 4.7,
    totalResponses: 48,
    categories: { teaching: 4.8, communication: 4.6, punctuality: 4.9, knowledge: 4.7 },
  },
];

export interface ExamSchedule {
  id: string;
  subject: string;
  subjectCode: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
}

export const mockExamSchedule: ExamSchedule[] = [
  { id: '1', subject: 'Data Structures', subjectCode: 'CS301', date: '2024-12-15', time: '09:00 AM', duration: '3 hours', venue: 'Exam Hall A' },
  { id: '2', subject: 'Database Systems', subjectCode: 'CS302', date: '2024-12-17', time: '09:00 AM', duration: '3 hours', venue: 'Exam Hall B' },
  { id: '3', subject: 'Operating Systems', subjectCode: 'CS303', date: '2024-12-19', time: '02:00 PM', duration: '3 hours', venue: 'Exam Hall A' },
  { id: '4', subject: 'Computer Networks', subjectCode: 'CS304', date: '2024-12-21', time: '09:00 AM', duration: '3 hours', venue: 'Exam Hall C' },
  { id: '5', subject: 'Software Engineering', subjectCode: 'CS305', date: '2024-12-23', time: '02:00 PM', duration: '3 hours', venue: 'Exam Hall B' },
];

export interface DepartmentStats {
  department: string;
  totalStudents: number;
  totalFaculty: number;
  avgAttendance: number;
  avgPerformance: number;
}

export const mockDepartmentStats: DepartmentStats[] = [
  { department: 'Computer Science', totalStudents: 240, totalFaculty: 18, avgAttendance: 87, avgPerformance: 78 },
  { department: 'Electronics', totalStudents: 180, totalFaculty: 15, avgAttendance: 82, avgPerformance: 75 },
  { department: 'Mechanical', totalStudents: 200, totalFaculty: 16, avgAttendance: 85, avgPerformance: 72 },
  { department: 'Civil', totalStudents: 160, totalFaculty: 12, avgAttendance: 88, avgPerformance: 76 },
];

export const roleLabels: Record<UserRole, string> = {
  student: 'Student',
  faculty: 'Faculty',
  hod: 'Head of Department',
  principal: 'Principal',
  coe: 'Controller of Examinations',
  admin: 'Administrator',
};

export const roleColors: Record<UserRole, string> = {
  student: 'bg-primary',
  faculty: 'bg-accent',
  hod: 'bg-warning',
  principal: 'bg-destructive',
  coe: 'bg-success',
  admin: 'bg-primary',
};
