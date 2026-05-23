import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useTaskStore } from '../store/taskStore';

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState('low');
  
  // Date states
  const [dueDate, setDueDate] = useState(null);
  const [selectedDatePreset, setSelectedDatePreset] = useState('none'); // 'none' | 'today' | 'tomorrow' | 'week' | 'custom'
  const [customDateStr, setCustomDateStr] = useState('');

  const { addTask, loading, error } = useTaskStore();
  const [validationError, setValidationError] = useState('');

  // Handle setting due date via presets
  const handleSelectPreset = (preset) => {
    setSelectedDatePreset(preset);
    const now = new Date();
    
    if (preset === 'none') {
      setDueDate(null);
      setCustomDateStr('');
    } else if (preset === 'today') {
      now.setHours(23, 59, 59, 999);
      setDueDate(now.toISOString());
      setCustomDateStr(now.toISOString().split('T')[0]);
    } else if (preset === 'tomorrow') {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);
      setDueDate(tomorrow.toISOString());
      setCustomDateStr(tomorrow.toISOString().split('T')[0]);
    } else if (preset === 'week') {
      const nextWeek = new Date(now);
      nextWeek.setDate(now.getDate() + 7);
      nextWeek.setHours(23, 59, 59, 999);
      setDueDate(nextWeek.toISOString());
      setCustomDateStr(nextWeek.toISOString().split('T')[0]);
    } else if (preset === 'custom') {
      // Clear to let user type custom YYYY-MM-DD
      setDueDate(null);
    }
  };

  const handleCustomDateChange = (text) => {
    setCustomDateStr(text);
    // Simple verification for YYYY-MM-DD format
    const dateReg = /^\d{4}-\d{2}-\d{2}$/;
    if (dateReg.test(text)) {
      const parsed = new Date(text);
      if (!isNaN(parsed.getTime())) {
        setDueDate(parsed.toISOString());
        setValidationError('');
      } else {
        setValidationError('Invalid date value.');
      }
    } else {
      setDueDate(null);
    }
  };

  const handleSave = async () => {
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Task title is required.');
      return;
    }

    if (selectedDatePreset === 'custom' && customDateStr && !dueDate) {
      setValidationError('Please enter a valid custom date in YYYY-MM-DD format.');
      return;
    }

    const result = await addTask(
      title.trim(),
      note.trim() || undefined,
      priority,
      dueDate
    );

    if (result.success) {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Error message box */}
        {(validationError || error) ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{validationError || error}</Text>
          </View>
        ) : null}

        {/* Task Title */}
        <Text style={styles.label}>Task Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#64748b"
          autoFocus
          value={title}
          onChangeText={setTitle}
        />

        {/* Task Note */}
        <Text style={styles.label}>Description / Note</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add some details..."
          placeholderTextColor="#64748b"
          multiline
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
        />

        {/* Priority Selector */}
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityContainer}>
          {['low', 'medium', 'high'].map((p) => {
            const isSelected = priority === p;
            let activeColor = '#10b981'; // green for low
            if (p === 'medium') activeColor = '#f59e0b'; // amber
            if (p === 'high') activeColor = '#ef4444'; // red

            return (
              <TouchableOpacity
                key={p}
                activeOpacity={0.7}
                onPress={() => setPriority(p)}
                style={[
                  styles.priorityButton,
                  isSelected && { backgroundColor: activeColor, borderColor: activeColor }
                ]}
              >
                <Text style={[styles.priorityText, isSelected && styles.activePriorityText]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Due Date Presets */}
        <Text style={styles.label}>Due Date</Text>
        <View style={styles.datePresetRow}>
          {[
            { key: 'none', label: 'None' },
            { key: 'today', label: 'Today' },
            { key: 'tomorrow', label: 'Tomorrow' },
            { key: 'week', label: 'In a Week' },
            { key: 'custom', label: 'Custom' }
          ].map((preset) => {
            const isSelected = selectedDatePreset === preset.key;
            return (
              <TouchableOpacity
                key={preset.key}
                activeOpacity={0.7}
                onPress={() => handleSelectPreset(preset.key)}
                style={[styles.presetButton, isSelected && styles.activePresetButton]}
              >
                <Text style={[styles.presetText, isSelected && styles.activePresetText]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Date Input Field */}
        {selectedDatePreset === 'custom' ? (
          <View style={styles.customDateBox}>
            <Text style={styles.subLabel}>Enter Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2026-05-23"
              placeholderTextColor="#64748b"
              maxLength={10}
              value={customDateStr}
              onChangeText={handleCustomDateChange}
            />
          </View>
        ) : null}

        {/* Form Action Controls */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.saveButtonText}>Create Task</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16'
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
    marginTop: 16
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 6
  },
  input: {
    backgroundColor: '#0d0e12',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 15,
    color: '#f8fafc'
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top'
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 10
  },
  priorityButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0e12'
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8'
  },
  activePriorityText: {
    color: '#ffffff'
  },
  datePresetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  presetButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 8,
    backgroundColor: '#0d0e12',
    marginBottom: 4
  },
  activePresetButton: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1'
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8'
  },
  activePresetText: {
    color: '#ffffff'
  },
  customDateBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#111827',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 12
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0e12'
  },
  cancelButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600'
  },
  saveButton: {
    flex: 2,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold'
  }
});
