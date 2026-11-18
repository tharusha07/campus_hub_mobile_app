import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../../context/EventsContext';
import EventCard from '../../components/EventCard';
import FilterModal from '../../components/FilterModal';

export default function ExploreScreen() {
  const {
    filteredEvents,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useEvents();

  const [modalVisible, setModalVisible] = useState(false);

  const clearCategory = () => {
    setSelectedCategory('All');
  };

  const renderHeader = () => (
    <View style={styles.headerArea}>
      <View style={styles.welcomeBox}>
        <Text style={styles.subGreeting}>University of Kelaniya</Text>
        <Text style={styles.mainGreeting}>Campus Events & Workshops</Text>
        <Text style={styles.summaryText}>
          Discover conferences, competitions, hackathons, and cultural festivals happening around the campus.
        </Text>
      </View>

      {/* Search Bar + Filter Trigger */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            placeholder="Search by title, faculty, or venue..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.filterButton,
            selectedCategory !== 'All' && styles.filterButtonActive,
            pressed && styles.pressed,
          ]}
          onPress={() => setModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Open filter modal"
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={selectedCategory !== 'All' ? '#FFFFFF' : '#4F46E5'}
          />
        </Pressable>
      </View>

      {/* Active Filter Indicator */}
      {selectedCategory !== 'All' && (
        <View style={styles.activeFilterPill}>
          <Text style={styles.activeFilterText}>
            Category: <Text style={styles.activeFilterBold}>{selectedCategory}</Text>
          </Text>
          <Pressable onPress={clearCategory} hitSlop={6}>
            <Ionicons name="close" size={16} color="#4F46E5" />
          </Pressable>
        </View>
      )}

      <View style={styles.countRow}>
        <Text style={styles.countText}>
          Showing <Text style={styles.countBold}>{filteredEvents.length}</Text> events
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={56} color="#CBD5E1" />
      <Text style={styles.emptyTitle}>No Events Found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search query or reset your category filter.
      </Text>
      <Pressable
        style={styles.resetButton}
        onPress={() => {
          setSearchQuery('');
          setSelectedCategory('All');
        }}
      >
        <Text style={styles.resetButtonText}>Reset All Filters</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* FlatList rendering hard-coded data */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal for data filtering */}
      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
  headerArea: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  welcomeBox: {
    marginBottom: 16,
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  subGreeting: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  mainGreeting: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4338CA',
  },
  activeFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 12,
    color: '#3730A3',
  },
  activeFilterBold: {
    fontWeight: '700',
  },
  countRow: {
    marginBottom: 12,
  },
  countText: {
    fontSize: 13,
    color: '#64748B',
  },
  countBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
  },
});
