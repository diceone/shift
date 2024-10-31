export interface AdminSettings {
  username: string;
  password: string;
  logo: string;
  companyName: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string; // Added color field
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  start: string;
  end: string;
  type: 'custom' | 'morning' | 'afternoon' | 'night';
  comment?: string;
  tagIds?: string[];
}

export type CalendarView = 'month' | 'week' | 'day';