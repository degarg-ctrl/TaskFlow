import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FilterBar({ activeFilter, onChangeFilter }) {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'done', label: 'Done' }
  ];

  return (
    <View style={styles.container}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;
        return (
          <TouchableOpacity
            key={filter.key}
            activeOpacity={0.7}
            onPress={() => onChangeFilter(filter.key)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#111827', // Dark charcoal/slate
    borderRadius: 8,
    padding: 4,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#1f2937'
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6
  },
  activeTab: {
    backgroundColor: '#6366f1' // Premium Indigo
  },
  tabText: {
    fontSize: 14,
    color: '#9ca3af', // Grey text
    fontWeight: '600'
  },
  activeTabText: {
    color: '#ffffff' // White text when active
  }
});
