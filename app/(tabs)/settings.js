import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../../context/EventsContext';
import {
  triggerImmediateNotification,
  triggerScheduledNotification,
} from '../../utils/notifications';

export default function SettingsScreen() {
  const { appStateStatus, appStateHistory, setBannerMessage } = useEvents();
  const [scheduledCount, setScheduledCount] = useState(0);

  const handleImmediateNotification = async () => {
    const id = await triggerImmediateNotification(
      '🎉 Immediate Notification Triggered!',
      'You have successfully demonstrated expo-notifications immediate trigger.'
    );
    if (id) {
      setBannerMessage('🔔 Immediate Notification Sent!');
      setTimeout(() => setBannerMessage(null), 3500);
    }
  };

  const handleScheduledNotification = async () => {
    const id = await triggerScheduledNotification(
      '⏰ Timed Reminder (5 Seconds)',
      'HackKelaniya hackathon check-in starts shortly! (Scheduled notification test successful)',
      5
    );
    if (id) {
      setScheduledCount((prev) => prev + 1);
      Alert.alert(
        'Reminder Scheduled',
        'A local notification has been scheduled for 5 seconds from now. You can background the app or stay on this screen to observe it.'
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Student & Course Header */}
      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>Assignment 01 • MAD</Text>
        </View>
        <Text style={styles.courseTitle}>COST 32152 / COSC 32152 / BECS 3227</Text>
        <Text style={styles.deptText}>
          Department of Statistics & Computer Science, University of Kelaniya
        </Text>
      </View>

      {/* AppState API Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="pulse" size={20} color="#4F46E5" />
          <Text style={styles.cardTitle}>React Native AppState API</Text>
        </View>
        <Text style={styles.cardDescription}>
          The AppState API tracks whether the application is in the foreground, background, or transitioning (inactive).
        </Text>

        <View style={styles.statusIndicatorRow}>
          <Text style={styles.statusLabel}>Current State:</Text>
          <View
            style={[
              styles.statusPill,
              appStateStatus === 'active'
                ? styles.statusPillActive
                : styles.statusPillBackground,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                appStateStatus === 'active'
                  ? styles.statusDotActive
                  : styles.statusDotBackground,
              ]}
            />
            <Text
              style={[
                styles.statusText,
                appStateStatus === 'active'
                  ? styles.statusTextActive
                  : styles.statusTextBackground,
              ]}
            >
              {appStateStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.historyHeading}>Recent AppState Transitions:</Text>
        <View style={styles.historyList}>
          {appStateHistory.map((item, index) => (
            <View key={item.id || index} style={styles.historyItem}>
              <View style={styles.historyTimeCol}>
                <Ionicons name="time-outline" size={13} color="#94A3B8" />
                <Text style={styles.historyTime}>{item.time}</Text>
              </View>
              <Text style={styles.historyDesc}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Local Notifications Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="notifications" size={20} color="#4F46E5" />
          <Text style={styles.cardTitle}>Local Notifications API</Text>
        </View>
        <Text style={styles.cardDescription}>
          Powered by <Text style={styles.codeText}>expo-notifications</Text>. Test both immediate triggers and timed reminders below:
        </Text>

        <View style={styles.buttonCol}>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            onPress={handleImmediateNotification}
          >
            <Ionicons name="flash-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Trigger Immediate Notification</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            onPress={handleScheduledNotification}
          >
            <Ionicons name="timer-outline" size={18} color="#4F46E5" />
            <Text style={styles.secondaryButtonText}>
              Trigger 5-Second Timed Reminder {scheduledCount > 0 && `(${scheduledCount})`}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Architecture Information */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="cube-outline" size={20} color="#4F46E5" />
          <Text style={styles.cardTitle}>Core Evaluation Checklist</Text>
        </View>

        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.checkText}>View, Text, Image, Pressable UI</Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.checkText}>FlatList rendering hard-coded events</Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.checkText}>Filter Modal & Action Confirm Modal</Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.checkText}>Expo Router tabs + nested stack navigation</Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.checkText}>Global state management (Bookmarks Context)</Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.checkText}>AppState listener (Background $\leftrightarrow$ Foreground)</Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.checkText}>expo-notifications local alerts</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  badgeText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  deptText: {
    fontSize: 12,
    color: '#64748B',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
  },
  statusPillActive: {
    backgroundColor: '#DCFCE7',
  },
  statusPillBackground: {
    backgroundColor: '#FEE2E2',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotActive: {
    backgroundColor: '#16A34A',
  },
  statusDotBackground: {
    backgroundColor: '#DC2626',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextActive: {
    color: '#15803D',
  },
  statusTextBackground: {
    color: '#B91C1C',
  },
  historyHeading: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  historyList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 6,
  },
  historyTimeCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  historyDesc: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '500',
  },
  buttonCol: {
    gap: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 14,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  checkText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.8,
  },
});
