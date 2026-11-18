import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../../context/EventsContext';
import ConfirmModal from '../../components/ConfirmModal';
import { triggerImmediateNotification, triggerScheduledNotification } from '../../utils/notifications';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { events, isBookmarked, toggleBookmark } = useEvents();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState('bookmark'); // 'bookmark' or 'rsvp'

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text style={styles.notFoundTitle}>Event Not Found</Text>
        <Text style={styles.notFoundText}>
          The event you are looking for does not exist or may have been removed.
        </Text>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const bookmarked = isBookmarked(event.id);

  const handleShare = async () => {
    try {
      await Share.share({
        title: event.title,
        message: `Check out ${event.title} at ${event.venue} on ${event.date}! Organized by ${event.organizer}.`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const openBookmarkModal = () => {
    setModalAction('bookmark');
    setConfirmModalVisible(true);
  };

  const openRsvpModal = () => {
    setModalAction('rsvp');
    setConfirmModalVisible(true);
  };

  const handleModalConfirm = async () => {
    setConfirmModalVisible(false);

    if (modalAction === 'bookmark') {
      await toggleBookmark(event.id);
    } else if (modalAction === 'rsvp') {
      // Trigger a 3-second scheduled notification simulating ticket/reminder
      await triggerScheduledNotification(
        '🎟️ RSVP Confirmed!',
        `Your seat for "${event.title}" is reserved at ${event.venue}.`,
        3,
        { eventId: event.id }
      );
      // Also ensure it's saved in bookmarks
      if (!bookmarked) {
        toggleBookmark(event.id, true);
      }
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: event.category,
          headerRight: () => (
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [styles.headerIconBtn, pressed && styles.pressed]}
              hitSlop={8}
            >
              <Ionicons name="share-social-outline" size={22} color="#0F172A" />
            </Pressable>
          ),
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Event Banner Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{event.category}</Text>
          </View>
        </View>

        {/* Header Details */}
        <View style={styles.mainInfo}>
          <Text style={styles.faculty}>{event.faculty}</Text>
          <Text style={styles.title}>{event.title}</Text>

          {/* Quick Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Ionicons name="calendar" size={20} color="#4F46E5" />
              <View>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{event.date}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="time" size={20} color="#4F46E5" />
              <View>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{event.time}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="location" size={20} color="#4F46E5" />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Venue</Text>
                <Text style={styles.infoValue}>{event.venue}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="people" size={20} color="#4F46E5" />
              <View>
                <Text style={styles.infoLabel}>Capacity</Text>
                <Text style={styles.infoValue}>{event.capacity} Attendees</Text>
              </View>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* Organizer Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Organizer & Inquiries</Text>
            <View style={styles.organizerCard}>
              <View style={styles.organizerIconCircle}>
                <Ionicons name="school" size={20} color="#4F46E5" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.organizerName}>{event.organizer}</Text>
                <Text style={styles.organizerEmail}>{event.contactEmail}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.bookmarkActionButton,
            bookmarked && styles.bookmarkActionButtonActive,
            pressed && styles.pressed,
          ]}
          onPress={openBookmarkModal}
        >
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={bookmarked ? '#4F46E5' : '#64748B'}
          />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.rsvpButton,
            pressed && styles.pressed,
          ]}
          onPress={openRsvpModal}
        >
          <Ionicons name="ticket-outline" size={20} color="#FFFFFF" />
          <Text style={styles.rsvpButtonText}>Reserve / Set Reminder</Text>
        </Pressable>
      </View>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={confirmModalVisible}
        title={
          modalAction === 'bookmark'
            ? bookmarked
              ? 'Remove from Bookmarks?'
              : 'Add to Saved Bookmarks?'
            : 'Confirm Registration & Reminder?'
        }
        message={
          modalAction === 'bookmark'
            ? `Do you want to ${
                bookmarked ? 'remove' : 'add'
              } "${event.title}" ${
                bookmarked ? 'from' : 'to'
              } your personal schedule?`
            : `Confirm attendance for "${event.title}"? A local confirmation notification will be triggered shortly.`
        }
        confirmText={
          modalAction === 'bookmark'
            ? bookmarked
              ? 'Remove'
              : 'Bookmark'
            : 'Confirm RSVP'
        }
        cancelText="Cancel"
        icon={
          modalAction === 'bookmark'
            ? bookmarked
              ? 'bookmark-outline'
              : 'bookmark'
            : 'notifications-outline'
        }
        iconColor={modalAction === 'bookmark' && bookmarked ? '#EF4444' : '#4F46E5'}
        onConfirm={handleModalConfirm}
        onCancel={() => setConfirmModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingBottom: 100,
  },
  headerIconBtn: {
    padding: 6,
    marginRight: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  mainInfo: {
    padding: 20,
  },
  faculty: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 20,
  },
  infoGrid: {
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  section: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  organizerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  organizerEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bookmarkActionButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkActionButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  rsvpButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  rsvpButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
