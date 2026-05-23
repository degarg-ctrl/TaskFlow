import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {/* User Icon Avatar */}
        <View style={styles.avatarContainer}>
          <Feather name="user" size={40} color="#6366f1" />
        </View>

        {/* User Details */}
        <Text style={styles.userName}>{user?.name || 'User Account'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'email@domain.com'}</Text>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Feather name="shield" size={16} color="#64748b" style={styles.infoIcon} />
          <Text style={styles.infoText}>Secured with JWT auth</Text>
        </View>
      </View>

      {/* Logout Action Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.8}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={18} color="#ffffff" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
    padding: 24,
    justifyContent: 'center'
  },
  profileCard: {
    backgroundColor: '#0d0e12',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)'
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#1e293b',
    marginVertical: 16
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoIcon: {
    marginRight: 8
  },
  infoText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500'
  },
  logoutButton: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#ef4444', // Red button
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  logoutIcon: {
    marginRight: 8
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold'
  }
});
