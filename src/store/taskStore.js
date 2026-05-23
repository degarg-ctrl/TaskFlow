import { create } from 'zustand';
import client from '../api/client';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await client.get('/api/tasks');
      set({ tasks: response.data.data, loading: false });
    } catch (error) {
      const errorMsg = error.message || 'Failed to fetch tasks.';
      set({ error: errorMsg, loading: false });
    }
  },

  addTask: async (title, note, priority, dueDate) => {
    set({ loading: true, error: null });
    try {
      const response = await client.post('/api/tasks', {
        title,
        note,
        priority,
        dueDate
      });
      const newTask = response.data.data;
      
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        loading: false
      }));
      return { success: true };
    } catch (error) {
      const errorMsg = error.message || 'Failed to create task.';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  updateTask: async (id, updates) => {
    // Keep old tasks list in case we need to roll back
    const previousTasks = get().tasks;
    
    // Optimistically update the UI
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === id ? { ...task, ...updates } : task
      )
    }));

    try {
      const response = await client.put(`/api/tasks/${id}`, updates);
      // Synchronize state with exact backend values
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? response.data.data : task
        )
      }));
      return { success: true };
    } catch (error) {
      // Rollback on error
      set({ tasks: previousTasks, error: error.message });
      return { success: false, error: error.message };
    }
  },

  deleteTask: async (id) => {
    const previousTasks = get().tasks;

    // Optimistically update UI
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== id)
    }));

    try {
      await client.delete(`/api/tasks/${id}`);
      return { success: true };
    } catch (error) {
      // Rollback on error
      set({ tasks: previousTasks, error: error.message });
      return { success: false, error: error.message };
    }
  },

  reset: () => {
    set({ tasks: [], loading: false, error: null });
  }
}));
