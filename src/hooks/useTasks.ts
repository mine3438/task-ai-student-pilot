
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/Task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tasks from Supabase
  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      if (data) {
        const formattedTasks: Task[] = data.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          deadline: new Date(task.deadline),
          priority: task.priority as 'High' | 'Medium' | 'Low',
          category: task.category as 'Assignment' | 'Exam' | 'Study' | 'Personal',
          completed: task.completed,
          createdAt: new Date(task.created_at)
        }));

        setTasks(formattedTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: task.title,
          description: task.description,
          deadline: task.deadline.toISOString(),
          priority: task.priority,
          category: task.category,
          completed: task.completed
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        return;
      }

      if (data) {
        const newTask: Task = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          deadline: new Date(data.deadline),
          priority: data.priority as 'High' | 'Medium' | 'Low',
          category: data.category as 'Assignment' | 'Exam' | 'Study' | 'Personal',
          completed: data.completed,
          createdAt: new Date(data.created_at)
        };

        setTasks(prev => [newTask, ...prev]);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Update an existing task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.deadline !== undefined) updateData.deadline = updates.deadline.toISOString();
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.completed !== undefined) updateData.completed = updates.completed;

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating task:', error);
        return;
      }

      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        return;
      }

      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};
