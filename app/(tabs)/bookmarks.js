import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../../context/EventsContext';
import EventCard from '../../components/EventCard';
import ConfirmModal from '../../components/ConfirmModal';

export default function BookmarksScreen() {
  const router = useRouter();
  const { bookmarkedEvents, toggleBookmark, bookmarkedIds } = useEvents();
  const [clearModalVisible, setClearModalVisible] = useState(false);

  const handleClearAll = () => {
    // Clear all bookmarks
    bookmarkedIds.forEach((id) => toggleBookmark(id, true));
    setClearModalVisible(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.infoBox}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Saved Events Schedule</Text>
          {bookmarkedEvents.length > 0 && (
            <Pressable
              onPress={() => setClearModalVisible(true)}
              style={({ pressed }) => [
                styles.clearButton,
                pressed && styles.pressed,
              ]}
              hitSlop={8}
            >
              <Text style={styles.clearText}>Clear All</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.subtitle}>
          Events bookmarked from the Explore tab or detail pages automatically sync to your saved list.
        </Text>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="bookmark" size={14} color="#4F46E5" />
            <Text style={styles.badgeText}>
              {bookmarkedEvents.length} {bookmarkedEvents.length === 1 ? 'Event' : 'Events'} Saved
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="bookmark-outline" size={48} color="#94A3B8" />
      </View>
      <Text style={styles.emptyTitle}>No Saved Events Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the bookmark icon on any event card or inside the event details screen to save it here.
      </Text>
      <Pressable
        style={({ pressed }) => [styles.exploreBtn, pressed && styles.pressed]}
        onPress={() => router.push('/(tabs)')}
      >
        <Ionicons name="compass-outline" size={18} color="#FFFFFF" />
        <Text style={styles.exploreBtnText}>Browse Campus Events</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarkedEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      <ConfirmModal
        visible={clearModalVisible}
        title="Clear All Bookmarks?"
        message="Are you sure you want to remove all saved events from your bookmarks list?"
        confirmText="Yes, Clear All"
        cancelText="Keep"
        icon="trash-outline"
        iconColor="#EF4444"
        onConfirm={handleClearAll}
        onCancel={() => setClearModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 12,
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  emptyContainer: {
    paddingVertical: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
  },
});
