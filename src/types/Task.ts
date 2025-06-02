
export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Assignment' | 'Exam' | 'Study' | 'Personal';
  completed: boolean;
  createdAt: Date;
}
