
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Task, CreateTaskInput } from '@/types/Task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('id, title, description, category, priority, deadline, completed, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        });
      } else {
        // Ensure data conforms to Task type
        const typedTasks: Task[] = (data || []).map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          category: task.category,
          priority: task.priority as 'Low' | 'Medium' | 'High',
          deadline: task.deadline,
          completed: task.completed,
          created_at: task.created_at,
          updated_at: task.updated_at,
          user_id: user.id, // Temporarily assign current user's ID
        }));
        setTasks(typedTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const addTask = async (taskData: CreateTaskInput) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create tasks",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select('id, title, description, category, priority, deadline, completed, created_at, updated_at')
        .single();

      if (error) {
        console.error('Error adding task:', error);
        toast({
          title: "Error",
          description: "Failed to create task",
          variant: "destructive",
        });
      } else {
        const newTask: Task = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          category: data.category,
          priority: data.priority as 'Low' | 'Medium' | 'High',
          deadline: data.deadline,
          completed: data.completed,
          created_at: data.created_at,
          updated_at: data.updated_at,
          user_id: user.id, // Temporarily assign current user's ID
        };
        setTasks(prevTasks => [newTask, ...prevTasks]);
        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'created_at' | 'user_id'>>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update tasks",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select('id, title, description, category, priority, deadline, completed, created_at, updated_at')
        .single();

      if (error) {
        console.error('Error updating task:', error);
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive",
        });
      } else {
        const updatedTask: Task = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          category: data.category,
          priority: data.priority as 'Low' | 'Medium' | 'High',
          deadline: data.deadline,
          completed: data.completed,
          created_at: data.created_at,
          updated_at: data.updated_at,
          user_id: user.id, // Temporarily assign current user's ID
        };
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === id ? updatedTask : task
          )
        );
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete tasks",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        });
      } else {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        toast({
          title: "Success",
          description: "Task deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
};
