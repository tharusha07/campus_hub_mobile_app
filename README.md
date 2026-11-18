# UniEvents — University Campus Event Guide & Scheduler

**Course:** COST 32152 / COSC 32152 / BECS 3227 — Mobile Application Development  
**Academic Year:** 2024/2025 (Semester 2)  
**Department:** Department of Statistics & Computer Science, University of Kelaniya  
**Assignment:** Assignment 01  

---

### 👤 Student Information
- **Student Name:** [Your Full Name Here]
- **Student ID:** [Your Student ID / Index Number Here]
- **Repository URL:** [https://github.com/your-username/mobile-application-assignment](https://github.com/your-username/mobile-application-assignment)
- **Demonstration Video:** [Click here to watch the demonstration video](https://youtube.com/watch?v=your-demo-link-or-gdrive) *(Unlisted YouTube / Google Drive)*

---

## 1. What is the Application, and What Problem Does It Solve?

### Problem Statement
In large academic environments like the University of Kelaniya, student life is bustling with academic seminars, inter-university hackathons, career networking fairs, cultural nights, and sporting events spread across various faculties and departments. However, information is frequently fragmented across separate bulletin boards, social media groups, and email threads. Students regularly miss deadlines, workshops, and networking opportunities because there is no centralized, mobile-first guide to browse, bookmark, and receive reminders for on-campus activities.

### Solution: UniEvents
**UniEvents** is a cross-platform mobile application designed and built with **React Native** and **Expo Router (JavaScript)**. It empowers university students, staff, and visitors to:
1. **Explore Campus Events:** Discover upcoming conferences, hackathons, and cultural gatherings categorized by faculty and interest.
2. **Search & Filter Interactively:** Instantly locate events by topic, venue, or faculty, or filter using an intuitive modal dialog.
3. **Personalized Scheduling:** Bookmark events to a synchronized "Saved Events" tab backed by centralized application state.
4. **Lifecycle Awareness:** Monitor app lifecycle events (Background $\leftrightarrow$ Foreground) utilizing the React Native `AppState` API to keep session status fresh.
5. **Timely Alerts:** Receive immediate and scheduled local notifications via `expo-notifications` whenever an event is bookmarked or a reminder is set.

---

## 2. Screen Breakdown & Architecture

The application implements **4 distinct screens** organized into a bottom tab layout combined with a nested stack layout:

| Screen | Route File | Purpose |
| :--- | :--- | :--- |
| **1. Explore Events (Home)** | `app/(tabs)/index.js` | Main feed showcasing all university events using a high-performance `FlatList`. Features a live search bar, active filter pills, event capacity badges, and a trigger button for the category filter `Modal`. |
| **2. Saved Bookmarks** | `app/(tabs)/bookmarks.js` | Displays all bookmarked/favorited events from the global state. Displays a dynamic badge count in the tab bar and allows students to view their curated schedule or clear items with confirmation. |
| **3. Status & Alerts (Lab)** | `app/(tabs)/settings.js` | Dedicated demonstration and settings screen showcasing the **AppState API** (real-time state indicator and transition history log) alongside interactive buttons to test **immediate and 5-second scheduled local notifications**. |
| **4. Event Details (Nested Stack)** | `app/event/[id].js` | Full-screen detail view containing the high-resolution event banner image, faculty tag, date, time, venue, description, organizer contacts, a share trigger, and an RSVP/Bookmark modal confirmation. |
| **5. 404 Route Fallback** | `app/+not-found.js` | Graceful fallback route for nonexistent deep-links or routes, allowing users to return cleanly to the main tab feed. |

---

## 3. Core React Native Components Used & Implementation Mapping

All required React Native core components are actively utilized across the codebase:

| Component | Purpose & Implementation Location |
| :--- | :--- |
| **`View`** | Used throughout all screens and components (`app/(tabs)/index.js`, `app/event/[id].js`, `components/EventCard.js`, etc.) as the foundational structural container for layout positioning, spacing, and styling using Flexbox. |
| **`Text`** | Renders typography, headings, body text, badges, and timestamps (`components/EventCard.js`, `app/(tabs)/settings.js`). Configured with distinct hierarchy, font weights, colors, and `numberOfLines` truncation. |
| **`Image`** | Displays high-resolution event cover photographs loaded over network URIs (`components/EventCard.js`, `app/event/[id].js`) with `resizeMode="cover"` and container aspect-ratio handling. |
| **`Pressable`** | Powers interactive elements including event cards, bookmark icons, modal buttons, search clear triggers, and RSVP actions (`components/EventCard.js`, `components/FilterModal.js`, `app/event/[id].js`). Provides responsive feedback using functional `pressed` styles (`pressed && styles.pressed`). |
| **`FlatList`** | Efficiently renders scrollable lists of hard-coded data (`app/(tabs)/index.js`, `app/(tabs)/bookmarks.js`). Leverages `keyExtractor`, `renderItem`, `ListHeaderComponent`, `ListEmptyComponent`, and memory virtualization for smooth scrolling. |
| **`Modal`** | Implemented in two specialized dialogs: <br>1. **`components/FilterModal.js`**: Filters events by category (Technology, Career, Cultural, Sports, Academic).<br>2. **`components/ConfirmModal.js`**: Confirms user actions (RSVP registration, clearing bookmarks) before execution. |

---

## 4. Expo Router File-Based Navigation Structure

The application strictly adheres to the modern **Expo Router** file-based routing paradigm:

```
c:\Users\ASUS\Desktop\mobile_application_assignment/
├── app/
│   ├── _layout.js               # Root Stack layout (Providers, AppState banner, Stack screens)
│   ├── +not-found.js            # Unmatched route fallback screen
│   ├── (tabs)/                  # Tab Navigation Group
│   │   ├── _layout.js           # Bottom tab navigator configuration & icons
│   │   ├── index.js             # Explore Screen (Tab 1)
│   │   ├── bookmarks.js         # Saved Bookmarks Screen (Tab 2)
│   │   └── settings.js          # AppState & Notification Diagnostics Screen (Tab 3)
│   └── event/
│       └── [id].js              # Dynamic nested stack screen for Event Details
├── assets/                      # Application icons & splash assets
├── components/
│   ├── AppStateBanner.js        # Foreground alert banner
│   ├── ConfirmModal.js          # Reusable action confirmation modal
│   ├── EventCard.js             # Event item card component
│   └── FilterModal.js           # Category filtering modal
├── context/
│   └── EventsContext.js         # React Context for global state & AppState tracking
├── data/
│   └── eventsData.js            # Hard-coded realistic university campus events
├── utils/
│   └── notifications.js         # expo-notifications helper functions
├── app.json                     # Expo configuration file
├── babel.config.js              # Babel preset configuration
└── package.json                 # Project dependencies & npm scripts
```

### Navigation Highlights
- **Tab Layout (`app/(tabs)/_layout.js`)**: Configures bottom tab bars with `@expo/vector-icons/Ionicons` and dynamic badge indicators reflecting bookmark counts.
- **Nested Stack (`app/event/[id].js`)**: Pushed from the tab feed upon pressing any `EventCard`. Fully supports native header back-navigation (`router.back()`) and platform gestures.

---

## 5. Global State Management

Global state is managed via React's native **Context API** (`context/EventsContext.js`) using standard `useState` and `useEffect` hooks, wrapped at the root layout (`app/_layout.js`):
- **`bookmarkedIds`**: An array of event IDs saved by the user. Modifying a bookmark from the *Explore* tab or *Event Details* screen instantly updates the *Bookmarks* tab and the tab bar badge.
- **`toggleBookmark(eventId)`**: Dispatches add/remove actions while simultaneously invoking local notification feedback.
- **`selectedCategory` & `searchQuery`**: Synchronizes filter modal selections and search queries across the feed.
- **`appStateStatus` & `appStateHistory`**: Centrally coordinates lifecycle transitions for inspection.

---

## 6. React Native AppState API Implementation

The React Native `AppState` API detects whether the app is running in the **active** (foreground) or **background** (or **inactive** on iOS during app switching):

```javascript
// Excerpt from context/EventsContext.js
useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    const prev = appState.current;
    const timeStr = new Date().toLocaleTimeString();

    if (prev.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App resumed to FOREGROUND (Active)');
      setBannerMessage(`👋 Welcome back! (Foreground at ${timeStr})`);
      setTimeout(() => setBannerMessage(null), 4000);
    }

    setAppStateStatus(nextAppState);
    appState.current = nextAppState;
  });

  return () => subscription.remove();
}, []);
```

### Demonstration in App
- When returning from the device home screen or multitasking drawer into the app, an in-app banner welcomes the user back.
- The **Status & Alerts** screen (`app/(tabs)/settings.js`) renders a live color-coded pill (`ACTIVE` green / `BACKGROUND` red) and displays a chronological log of previous transitions with timestamps.

---

## 7. Research & Implementation of Local Notifications (`expo-notifications`)

### Research Approach
1. **Documentation Review**: Consulted the official Expo documentation for `expo-notifications` (SDK 52), identifying required Android permissions (`NOTIFICATIONS`), notification channels, and presentation handlers.
2. **Foreground Notification Handling**: By default, mobile OSes suppress notifications when an application is already in the foreground. To present alerts while the student is actively using the app, we set:
   ```javascript
   Notifications.setNotificationHandler({
     handleNotification: async () => ({
       shouldShowAlert: true,
       shouldPlaySound: true,
       shouldSetBadge: false,
     }),
   });
   ```
3. **Android 13+ Notification Channels**: Configured high-importance notification channels (`setNotificationChannelAsync`) with vibration patterns and accent colors to ensure compatibility across Android versions.
4. **Trigger Modes Tested**:
   - **Immediate Notification (`trigger: null`)**: Dispatched instantaneously when an event is bookmarked or when requested via the diagnostics panel.
   - **Scheduled Notification (`trigger: { seconds: 5 }`)**: Demonstrates timed scheduling (e.g., reminding a student 5 seconds after reserving an event).

---

## 8. Installation & Setup Guide

### Prerequisites
- **Node.js**: Version 18.x or 20.x (LTS) installed from [nodejs.org](https://nodejs.org/).
- **Package Manager**: `npm` (included with Node.js) or `npx`.
- **Expo Go App**: Install the **Expo Go** application on your physical Android or iOS device from Google Play Store or Apple App Store, or run an Android/iOS emulator.

### Step-by-Step Commands

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/mobile-application-assignment.git
   cd mobile-application-assignment
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo Development Server:**
   ```bash
   npx expo start
   ```

4. **Run on Your Device or Emulator:**
   - Scan the terminal QR code using **Expo Go** (Android) or the default **Camera app** (iOS).
   - Press `a` in the terminal to open in an **Android Emulator**.
   - Press `i` in the terminal to open in an **iOS Simulator**.
   - Press `w` in the terminal to open in a **Web Browser**.

---

## 9. Demonstration Video Checklist

When recording the required video walkthrough, make sure to cover:
- [x] **Values & Theme Explanation**: Show the UniEvents home feed populated with realistic University of Kelaniya campus events.
- [x] **Navigation Demonstration**: Browse the *Explore*, *Saved*, and *Status & Alerts* tabs, tap an event to open the nested *Event Details* stack, and press Back.
- [x] **Modal Demonstration**: Open the *Filter Modal* to filter by category (e.g., Technology), then open the *Confirm Modal* upon reserving an event.
- [x] **State Management**: Bookmark an event on the Explore or Details screen, then switch to the *Saved* tab to prove the event appears immediately in state with an updated badge count.
- [x] **AppState API Transition**: Minimize the app to the home screen, wait a few seconds, return to the app, and observe the foreground transition banner and the transition history log on the Settings tab.
- [x] **Local Notifications**: Trigger the immediate notification and the 5-second timed reminder, showing the push banner popping up on the device.
