import React, { useState, useEffect, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTaskStore } from '../store/taskStore';
import TaskCard from '../components/TaskCard';
import FilterBar from '../components/FilterBar';

export default function TasksScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const { tasks, loading, error, fetchTasks, updateTask, deleteTask } = useTaskStore();

  // Fetch tasks on initial mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Derived tasks list based on activeFilter status
  const filteredTasks = useMemo(() => {
    if (activeFilter === 'all') return tasks;
    return tasks.filter((task) => task.status === activeFilter);
  }, [tasks, activeFilter]);

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'active' ? 'done' : 'active';
    await updateTask(task._id, { status: nextStatus });
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  return (
    <View style={styles.container}>
      {/* Status Filter Tab Bar */}
      <FilterBar activeFilter={activeFilter} onChangeFilter={setActiveFilter} />

      {/* Error Message Box */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Task List */}
      {loading && tasks.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggleStatus={() => handleToggleStatus(item)}
              onDelete={() => handleDeleteTask(item._id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchTasks}
              tintColor="#6366f1"
              colors={['#6366f1']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={48} color="#475569" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No tasks found</Text>
              <Text style={styles.emptySubText}>
                {activeFilter === 'all'
                  ? "Tap the '+' button below to create your first task!"
                  : `You have no tasks matching the '${activeFilter}' filter.`}
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Add Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Feather name="plus" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
    paddingHorizontal: 16
  },
  listContent: {
    paddingBottom: 100, // Leave space for floating action button
    flexGrow: 1
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24
  },
  emptyIcon: {
    marginBottom: 16
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8
  },
  emptySubText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6
  }
});
