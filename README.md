# Doot App - Dating App with Expo & Firebase

A modern, feature-rich dating application built with React Native, Expo, and Firebase. Features include user authentication, profile creation, swiping mechanism, matching system, real-time messaging, and more.

## Features

### 🔐 Authentication
- **Email/Password Authentication**: Secure signup and login
- **Google Sign-In**: One-tap authentication
- **Session Persistence**: Stay logged in across app restarts
- **Protected Routes**: Automatic navigation based on auth state

### 👤 User Profiles
- **Multi-step Onboarding**: 6-step profile creation process
- **Photo Upload**: Multiple profile photos with Firebase Storage
- **Rich Profile Data**: Bio, interests, preferences, location
- **Profile Customization**: Height, education, occupation, and more

### 💕 Dating Features
- **Swipe Interface**: Tinder-style card swiping
- **Smart Matching**: Match with users who also liked you
- **Location-based Discovery**: Find users nearby
- **Interest Tags**: Discover compatible matches
- **Age & Distance Filters**: Customize your preferences

### 💬 Messaging
- **Real-time Chat**: Firebase Firestore-powered messaging
- **Match Conversations**: Chat with your matches
- **Message History**: Persistent conversation history
- **Typing Indicators**: See when someone is typing

### 🎨 UI/UX
- **Modern Design**: Clean, intuitive interface
- **Custom Components**: Reusable UI components
- **Smooth Animations**: React Native Reanimated
- **Responsive Layout**: Works on all screen sizes
- **Tab Navigation**: Easy access to main features

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **UI Library**: React Native Paper
- **State Management**: React Context API
- **Package Manager**: Bun (npm/yarn also supported)

## Get Started

### 1. Prerequisites

- Node.js (v18 or higher)
- Bun, npm, or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Firebase account

### 2. Install Dependencies

```bash
bun install
# or
npm install
```

### 3. Firebase Configuration

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or select existing)
3. Add a web app to your project

#### Enable Authentication

1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Enable **Google** provider (optional)
4. Add support email for Google Sign-In

#### Set Up Firestore

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **test mode** (or production mode with rules)
4. Choose a location close to your users

#### Set Up Storage

1. Go to **Storage**
2. Click **Get started**
3. Choose security rules (start in test mode)

#### Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Note**: Use the `.env.example` file as a template. The `.env.local` file is in `.gitignore`.

### 4. Configure Firestore Rules

Copy the contents of `firestore.rules` to your Firebase Console:

1. Go to **Firestore Database** > **Rules**
2. Replace with the rules from `firestore.rules`
3. Click **Publish**

### 5. Configure Storage Rules

Copy the contents of `storage.rules` to your Firebase Console:

1. Go to **Storage** > **Rules**
2. Replace with the rules from `storage.rules`
3. Click **Publish**

### 6. Start the Development Server

```bash
bun start
# or
npm start
```

Choose how to run the app:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app

## Project Structure

```
doot-app/
├── app/                          # App screens and navigation
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx            # Login screen
│   │   └── signup.tsx           # Signup screen
│   ├── (onboarding)/            # Multi-step onboarding flow
│   │   ├── _layout.tsx          # Onboarding layout with progress
│   │   ├── step-1.tsx           # Basic info (name, DOB, gender)
│   │   ├── step-2.tsx           # Photo upload
│   │   ├── step-3.tsx           # Location selection
│   │   ├── step-4.tsx           # Dating preferences
│   │   ├── step-5.tsx           # Bio and interests
│   │   └── step-6.tsx           # Additional details
│   ├── (tabs)/                  # Main app tabs
│   │   ├── _layout.tsx          # Tab navigation layout
│   │   ├── index.tsx            # Home/Swipe screen
│   │   ├── matches.tsx          # Matches list
│   │   ├── messages.tsx         # Conversations list
│   │   └── profile.tsx          # User profile
│   ├── chat/
│   │   └── [matchId].tsx        # Individual chat screen
│   ├── profile/
│   │   └── [userId].tsx         # Other user's profile
│   ├── settings.tsx             # App settings
│   └── _layout.tsx              # Root layout with providers
│
├── components/                   # Reusable UI components
│   ├── badge.tsx                # Badge component
│   ├── button.tsx               # Custom button
│   ├── card.tsx                 # Card container
│   ├── chat-bubble.tsx          # Message bubble
│   ├── empty-state.tsx          # Empty state placeholder
│   ├── interest-chip.tsx        # Interest selection chip
│   ├── interest-tag.tsx         # Interest display tag
│   ├── match-card.tsx           # Match profile card
│   ├── message-preview.tsx      # Message preview in list
│   ├── photo-carousel.tsx       # Profile photo carousel
│   ├── profile-card.tsx         # Swipeable profile card
│   └── progress-bar.tsx         # Onboarding progress bar
│
├── config/
│   └── firebase.ts              # Firebase initialization
│
├── constants/
│   └── theme.ts                 # App theme and design tokens
│
├── contexts/                     # React Context providers
│   ├── auth-context.tsx         # Authentication state
│   └── onboarding-context.tsx   # Onboarding form state
│
├── models/
│   └── user.ts                  # TypeScript interfaces
│
├── services/                     # Business logic and API
│   ├── firestore.ts             # Firestore utilities
│   ├── matches.ts               # Match management
│   ├── messages.ts              # Messaging service
│   ├── storage.ts               # File upload service
│   ├── swipe.ts                 # Swipe logic
│   └── user.ts                  # User profile service
│
├── assets/                       # Images and static files
├── .env.local                   # Environment variables (not in git)
├── .env.example                 # Environment template
├── firestore.rules              # Firestore security rules
├── storage.rules                # Storage security rules
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript configuration
```

## Key Features Explained

### Authentication Flow

1. **Sign Up**: Email/password or Google → Account created
2. **Onboarding**: New users complete 6-step profile creation
3. **Sign In**: Returning users go directly to home
4. **Session Persistence**: Auth state saved with AsyncStorage

### Onboarding Steps

1. **Basic Info**: Name, date of birth, gender
2. **Photos**: Upload 2-6 profile photos
3. **Location**: Set city and enable location services
4. **Preferences**: Who you're looking for, age range, distance
5. **Bio & Interests**: Write bio, select interests
6. **Details**: Height, education, occupation (optional)

### Swipe Mechanism

- **Right Swipe (Like)**: Express interest in a profile
- **Left Swipe (Pass)**: Skip to the next profile
- **Automatic Matching**: When both users like each other, it's a match!
- **Match Notification**: See your new matches instantly

### Matching Algorithm

The app uses a sophisticated matching system:
- **Location-based**: Find users within your distance preference
- **Age filtering**: Only show users in your preferred age range
- **Gender preferences**: Filter by who you're looking for
- **Mutual likes**: Matches only when both users swipe right
- **Prevents duplicates**: Never see the same profile twice

### Real-time Messaging

- **Firestore-powered**: Messages sync instantly
- **Conversation threads**: Organized by match
- **Message history**: All conversations preserved
- **Timestamp display**: See when messages were sent
- **Sender/receiver styling**: Clear visual distinction

## Data Models

### User Profile

```typescript
interface UserProfile {
  uid: string;
  email: string;
  profile: {
    name: string;
    dateOfBirth: Timestamp;
    age: number;
    gender: "male" | "female" | "other";
    bio: string;
    photos: string[];
    location: {
      city: string;
      coordinates: { latitude: number; longitude: number };
    };
    interests: string[];
    height?: number;
    education?: string;
    occupation?: string;
  };
  preferences: {
    lookingFor: "male" | "female" | "everyone";
    ageRange: { min: number; max: number };
    distanceRadius: number;
  };
  metadata: {
    createdAt: Timestamp;
    lastActive: Timestamp;
    profileComplete: boolean;
    onboardingCompleted: boolean;
  };
}
```

### Match

```typescript
interface Match {
  id: string;
  users: string[];
  createdAt: Timestamp;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };
}
```

### Message

```typescript
interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
  read: boolean;
}
```

## Services API

### User Service (`services/user.ts`)

```typescript
// Create or update user profile
createUserProfile(uid: string, profileData: Partial<UserProfile>): Promise<void>

// Get user profile
getUserProfile(uid: string): Promise<UserProfile | null>

// Update profile fields
updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void>

// Get potential matches
getPotentialMatches(uid: string): Promise<UserProfile[]>
```

### Match Service (`services/matches.ts`)

```typescript
// Create a match between two users
createMatch(userId1: string, userId2: string): Promise<string>

// Get all matches for a user
getUserMatches(uid: string): Promise<Match[]>

// Check if users have matched
checkMatch(userId1: string, userId2: string): Promise<boolean>
```

### Message Service (`services/messages.ts`)

```typescript
// Send a message
sendMessage(matchId: string, senderId: string, text: string): Promise<void>

// Listen to messages (real-time)
subscribeToMessages(matchId: string, callback: (messages: Message[]) => void): Unsubscribe

// Mark messages as read
markMessagesAsRead(matchId: string, userId: string): Promise<void>
```

### Swipe Service (`services/swipe.ts`)

```typescript
// Record a like
recordLike(userId: string, likedUserId: string): Promise<boolean>

// Record a pass
recordPass(userId: string, passedUserId: string): Promise<void>

// Get users already swiped on
getSwipedUserIds(userId: string): Promise<string[]>
```

### Storage Service (`services/storage.ts`)

```typescript
// Upload profile photo
uploadProfilePhoto(userId: string, uri: string, index: number): Promise<string>

// Delete photo
deleteProfilePhoto(url: string): Promise<void>

// Upload multiple photos
uploadMultiplePhotos(userId: string, uris: string[]): Promise<string[]>
```

## Context APIs

### Auth Context

```typescript
const {
  user,              // Current user object
  loading,           // Auth loading state
  error,             // Auth error message
  signUp,            // Sign up with email/password
  signIn,            // Sign in with email/password
  signInWithGoogle,  // Sign in with Google
  signOut,           // Sign out
  clearError         // Clear error state
} = useAuth();
```

### Onboarding Context

```typescript
const {
  data,              // Onboarding form data
  updateData,        // Update form fields
  resetData,         // Reset form
  currentStep,       // Current step (1-6)
  setCurrentStep     // Navigate to step
} = useOnboarding();
```

## Styling & Theming

The app uses a centralized theme system (`constants/theme.ts`):

```typescript
// Colors
COLORS.primary        // Main brand color
COLORS.secondary      // Accent color
COLORS.background     // Page background
COLORS.text           // Primary text
COLORS.gray[100-900]  // Gray scale

// Spacing
SPACING.xs            // 4px
SPACING.sm            // 8px
SPACING.md            // 16px
SPACING.lg            // 24px
SPACING.xl            // 32px

// Typography
TYPOGRAPHY.h1         // 32px bold
TYPOGRAPHY.h2         // 24px bold
TYPOGRAPHY.body       // 16px regular
TYPOGRAPHY.caption    // 14px regular

// Border Radius
BORDER_RADIUS.sm      // 4px
BORDER_RADIUS.md      // 8px
BORDER_RADIUS.lg      // 12px
BORDER_RADIUS.xl      // 16px
```

## Firebase Security Rules

### Firestore Rules

The app implements secure Firestore rules (see `firestore.rules`):

- **Users**: Can read all, write only their own
- **Matches**: Can read/write only if they're part of the match
- **Messages**: Can read/write only in their matches
- **Swipes**: Can only write their own swipes

### Storage Rules

Storage is secured (see `storage.rules`):

- Users can only upload to their own folder
- Maximum file size: 5MB
- Allowed types: Images only (jpg, png, webp)

## Available Scripts

```bash
# Start development server
bun start

# Run on iOS simulator
bun run ios

# Run on Android emulator
bun run android

# Run on web
bun run web

# Lint code
bun run lint

# Clear cache and restart
npx expo start --clear
```

## Development Tips

### Hot Reloading

Expo provides fast refresh. Changes to your code will instantly reflect in the app without losing state.

### Debugging

- **React DevTools**: Built into Expo Dev Tools
- **Console Logs**: Visible in terminal and Expo Dev Tools
- **Network**: Monitor Firebase calls in React Native Debugger
- **Flipper**: Use Flipper for advanced debugging

### Testing Firebase Locally

Use Firebase Emulator Suite for local development:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start emulators
firebase emulators:start
```

Update `config/firebase.ts` to connect to emulators in development.

## Common Issues & Solutions

### Firebase Config Not Loading

**Problem**: Environment variables not found  
**Solution**: 
- Ensure `.env.local` exists in root directory
- Use `EXPO_PUBLIC_` prefix for all variables
- Restart dev server after adding env variables

### Photos Not Uploading

**Problem**: Storage permission denied  
**Solution**:
- Check `storage.rules` are deployed
- Verify user is authenticated
- Ensure file size is under 5MB

### Messages Not Syncing

**Problem**: Real-time updates not working  
**Solution**:
- Check Firestore rules allow read/write
- Verify user is part of the match
- Check network connection

### Navigation Not Working

**Problem**: Routes not redirecting properly  
**Solution**:
- Ensure `app/_layout.tsx` has auth protection logic
- Check route names match folder structure
- Use Expo Router v6+

### TypeScript Errors

**Problem**: Type errors in components  
**Solution**:
- Run `npx expo start --clear` to clear cache
- Check `tsconfig.json` is properly configured
- Ensure all imports have correct types

## Performance Optimization

### Image Optimization

- Use `expo-image` for optimized image rendering
- Implement lazy loading for profile photos
- Cache images locally

### Firestore Optimization

- Use pagination for large lists (matches, messages)
- Implement query limits
- Index frequently queried fields (see `firestore.indexes.json`)

### Bundle Size

- Use dynamic imports for large screens
- Remove unused dependencies
- Enable Hermes for faster startup

## Security Best Practices

1. **Never commit** `.env.local` or `serviceAccountKey.json`
2. **Use Firebase Rules** to restrict data access
3. **Validate user input** on both client and server
4. **Implement rate limiting** for API calls
5. **Sanitize data** before storing in Firestore
6. **Use HTTPS** for all network requests
7. **Enable App Check** for production (Firebase)

## Roadmap

### Planned Features

- [ ] Video chat integration
- [ ] Story/status updates
- [ ] Advanced filters (education, height, etc.)
- [ ] Profile verification badges
- [ ] Read receipts in messages
- [ ] Push notifications
- [ ] In-app reporting and blocking
- [ ] Super likes and boosts
- [ ] Dark mode support
- [ ] Multi-language support

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review Firebase Console for errors

## License

This project is open source and available under the MIT License.

---

Built with ❤️ using Expo, React Native, and Firebase
