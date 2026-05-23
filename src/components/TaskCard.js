import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import PriorityBadge from './PriorityBadge';

export default function TaskCard({ task, onToggleStatus, onDelete }) {
  const { title, note, priority, dueDate, status } = task;
  const isDone = status === 'done';

  // Format Due Date cleanly (e.g. May 23, 2026)
  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return null;
    }
  };

  const formattedDate = formatDueDate(dueDate);

  return (
    <View style={[styles.card, isDone && styles.cardCompleted]}>
      {/* Status Checkbox */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onToggleStatus}
        style={styles.checkboxContainer}
      >
        <Feather
          name={isDone ? 'check-circle' : 'circle'}
          size={22}
          color={isDone ? '#10b981' : '#94a3b8'}
        />
      </TouchableOpacity>

      {/* Task Details */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.title, isDone && styles.titleCompleted]}>
          {title}
        </Text>
        
        {note ? (
          <Text style={[styles.note, isDone && styles.noteCompleted]} numberOfLines={2}>
            {note}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <PriorityBadge priority={priority} />
          
          {formattedDate ? (
            <View style={styles.dateContainer}>
              <Feather name="calendar" size={12} color="#64748b" style={styles.calendarIcon} />
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Delete Action Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onDelete}
        style={styles.deleteButton}
      >
        <Feather name="trash-2" size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#0f172a', // Slate 900
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#1e293b', // Slate 800
    alignItems: 'center'
  },
  cardCompleted: {
    opacity: 0.65,
    backgroundColor: '#0b0f19',
    borderColor: '#111827'
  },
  checkboxContainer: {
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  detailsContainer: {
    flex: 1,
    paddingRight: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc', // Slate 50
    marginBottom: 4
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#64748b' // Slate 500
  },
  note: {
    fontSize: 13,
    color: '#94a3b8', // Slate 400
    marginBottom: 8,
    lineHeight: 18
  },
  noteCompleted: {
    color: '#475569' // Slate 600
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  calendarIcon: {
    marginRight: 4
  },
  dateText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500'
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.08)' // Subtle red tint
  }
});
