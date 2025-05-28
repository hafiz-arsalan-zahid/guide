
import type { NavItem } from '@/lib/types';
import { LayoutDashboard, CheckSquare, GraduationCap, BookOpen, CalendarDays, FileText, Brain, Cog, MessageSquareQuote } from 'lucide-react'; // Changed MessageSquareQuestion to MessageSquareQuote

export const APP_NAME = "FocusFlow";

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/todos', label: 'Todo List', icon: CheckSquare },
  { href: '/marks', label: 'Marks Manager', icon: GraduationCap },
  { href: '/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/timetable', label: 'Timetable', icon: CalendarDays },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/study-guide', label: 'AI Study Guide', icon: Brain },
  { href: '/conceptor', label: 'Conceptor AI', icon: MessageSquareQuote }, // Changed
  { href: '/settings', label: 'Settings', icon: Cog },
];
