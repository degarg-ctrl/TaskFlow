import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PriorityBadge({ priority }) {
  const normPriority = (priority || 'low').toLowerCase();

  let badgeStyle;
  let textStyle;
  let label;

  switch (normPriority) {
    case 'high':
      badgeStyle = styles.badgeHigh;
      textStyle = styles.textHigh;
      label = 'High';
      break;
    case 'medium':
      badgeStyle = styles.badgeMedium;
      textStyle = styles.textMedium;
      label = 'Medium';
      break;
    case 'low':
    default:
      badgeStyle = styles.badgeLow;
      textStyle = styles.textLow;
      label = 'Low';
      break;
  }

  return (
    <View style={[styles.badge, badgeStyle]}>
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  // Low priority
  badgeLow: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)', // Emerald tint
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1
  },
  textLow: {
    color: '#10b981'
  },
  // Medium priority
  badgeMedium: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)', // Amber tint
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderWidth: 1
  },
  textMedium: {
    color: '#f59e0b'
  },
  // High priority
  badgeHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)', // Red tint
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1
  },
  textHigh: {
    color: '#ef4444'
  }
});
