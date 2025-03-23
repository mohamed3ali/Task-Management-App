export interface Task {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  userId: string;
  category: 'work' | 'personal' | 'shopping' | 'other';
  completed: boolean;
}
