import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../context/EventsContext';

export default function EventCard({ event }) {
  const router = useRouter();
  const { isBookmarked, toggleBookmark } = useEvents();
  const bookmarked = isBookmarked(event.id);

  const handleCardPress = () => {
    router.push(`/event/${event.id}`);
  };

  const handleBookmarkPress = (e) => {
    e.stopPropagation?.();
    toggleBookmark(event.id);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={handleCardPress}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${event.title}`}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{event.category}</Text>
        </View>

        <Pressable
          onPress={handleBookmarkPress}
          style={({ pressed }) => [
            styles.bookmarkButton,
            pressed && styles.bookmarkButtonPressed,
          ]}
          hitSlop={8}
          accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark event'}
        >
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={bookmarked ? '#F59E0B' : '#FFFFFF'}
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.facultyText} numberOfLines={1}>
          {event.faculty}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color="#64748B" />
          <Text style={styles.metaText}>{event.date}</Text>
          <Text style={styles.metaDivider}>•</Text>
          <Ionicons name="time-outline" size={14} color="#64748B" />
          <Text style={styles.metaText} numberOfLines={1}>
            {event.time.split(' - ')[0]}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color="#64748B" />
          <Text style={styles.metaText} numberOfLines={1}>
            {event.venue}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButtonPressed: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    transform: [{ scale: 0.92 }],
  },
  content: {
    padding: 16,
  },
  facultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 6,
    fontWeight: '500',
  },
  metaDivider: {
    fontSize: 13,
    color: '#CBD5E1',
    marginHorizontal: 8,
  },
});
