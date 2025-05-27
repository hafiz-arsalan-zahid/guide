
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  subItems?: NavItem[];
};

export type TodoPriority = 'Low' | 'Medium' | 'High';

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  dueDate?: Date;
  priority?: TodoPriority;
};

export type Mark = {
  id: string;
  subject: string;
  testName: string;
  score: number;
  totalMarks: number;
  date: Date;
};

export type Subject = {
  id: string;
  name: string;
  teacher?: string;
  resourceUrl?: string;
  color?: string; // For timetable visualization
};

export type TimetableEntry = {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  subjectId: string; // Link to Subject
  location?: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

// Added for AI Mark Analysis
export interface SubjectPerformanceForAI {
  subjectName: string;
  averagePercentage: number;
  testCount: number;
  grade: string;
}
