import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { EVENTS_DATA } from '../data/eventsData';
import { triggerImmediateNotification, registerForPushNotificationsAsync } from '../utils/notifications';

const EventsContext = createContext();

export function EventsProvider({ children }) {
  const [events] = useState(EVENTS_DATA);
  const [bookmarkedIds, setBookmarkedIds] = useState(['1', '4']); // default initial bookmarks for realistic demo
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // AppState management
  const appState = useRef(AppState.currentState);
  const [appStateStatus, setAppStateStatus] = useState(AppState.currentState);
  const [appStateHistory, setAppStateHistory] = useState([
    {
      id: Date.now().toString(),
      state: AppState.currentState,
      time: new Date().toLocaleTimeString(),
      description: 'App initialized in foreground',
    },
  ]);
  const [bannerMessage, setBannerMessage] = useState(null);

  // Initialize notifications permission
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  // React Native AppState listener to detect background/foreground transitions
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const prev = appState.current;
      const timeStr = new Date().toLocaleTimeString();

      let transitionDesc = `Transitioned from [${prev}] to [${nextAppState}]`;

      if (prev.match(/inactive|background/) && nextAppState === 'active') {
        transitionDesc = 'App resumed to FOREGROUND (Active)';
        setBannerMessage(`👋 Welcome back! (Foreground at ${timeStr})`);
        setTimeout(() => setBannerMessage(null), 4000);
      } else if (nextAppState.match(/inactive|background/)) {
        transitionDesc = 'App moved to BACKGROUND / Inactive';
      }

      console.log(`[AppState] ${transitionDesc}`);

      setAppStateHistory((prevHistory) => [
        {
          id: `${Date.now()}_${Math.random()}`,
          state: nextAppState,
          time: timeStr,
          description: transitionDesc,
        },
        ...prevHistory.slice(0, 9), // keep last 10 entries
      ]);

      appState.current = nextAppState;
      setAppStateStatus(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Toggle bookmark state and trigger notification
  const toggleBookmark = async (eventId, silent = false) => {
    const event = events.find((e) => e.id === eventId);
    const wasBookmarked = bookmarkedIds.includes(eventId);

    if (wasBookmarked) {
      setBookmarkedIds((prev) => prev.filter((id) => id !== eventId));
      if (!silent && event) {
        await triggerImmediateNotification(
          'Bookmark Removed',
          `"${event.title}" was removed from your saved list.`,
          { eventId }
        );
      }
    } else {
      setBookmarkedIds((prev) => [...prev, eventId]);
      if (!silent && event) {
        await triggerImmediateNotification(
          '⭐ Event Bookmarked!',
          `"${event.title}" has been saved to your Bookmarks tab.`,
          { eventId }
        );
      }
    }
  };

  const isBookmarked = (eventId) => bookmarkedIds.includes(eventId);

  const bookmarkedEvents = events.filter((e) => bookmarkedIds.includes(e.id));

  // Filtered list based on category & search query
  const filteredEvents = events.filter((e) => {
    const matchesCategory =
      selectedCategory === 'All' || e.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <EventsContext.Provider
      value={{
        events,
        bookmarkedIds,
        bookmarkedEvents,
        isBookmarked,
        toggleBookmark,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        filteredEvents,
        appStateStatus,
        appStateHistory,
        bannerMessage,
        setBannerMessage,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}
