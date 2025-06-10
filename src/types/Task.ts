
export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  deadline: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type Priority = 'Low' | 'Medium' | 'High';
export type Category = 'Work' | 'Personal' | 'Study' | 'Health' | 'Finance' | 'Other';
