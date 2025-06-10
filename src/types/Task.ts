
export interface Task {
  id: string;
  title: string;
  description: string | null;
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

// Type for creating new tasks (omitting server-generated fields)
export type CreateTaskInput = {
  title: string;
  description: string;
  category: string;
  priority: Priority;
  deadline: string;
  completed: boolean;
};
