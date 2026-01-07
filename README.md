# Doot App - Expo with Firebase Authentication

This is an [Expo](https://expo.dev) project with Firebase Authentication, protected routes, and complete auth screens.

## Features

- **Firebase Authentication**: Email/password authentication with session persistence
- **Protected Routes**: Automatic redirects based on auth state
- **Auth Screens**: Login, signup, and onboarding flows with form validation
- **Tab Navigation**: Home and profile screens for authenticated users
- **TypeScript**: Fully typed with strict type checking
- **Modern React**: Functional components with hooks

## Get Started

### 1. Install Dependencies

```bash
npm install
# or
bun install
```

### 2. Configure Firebase

Create a `.env.local` file in the root directory (already created with your credentials):

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

**Note:** A `.env.example` file is included as a template. The `.env.local` file is already in `.gitignore` and won't be committed to version control.

**To get your Firebase config:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings > General
4. Scroll down to "Your apps"
5. Copy the config values and add them to `.env.local`

### 3. Start the App

```bash
npm start
# or
bun start
```

In the output, you'll find options to open the app in:
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Project Structure

```
app/
├── _layout.tsx                 # Root layout with AuthProvider and route protection
├── (tabs)/                     # Protected routes (requires authentication)
│   ├── _layout.tsx            # Tab navigation layout
│   ├── index.tsx              # Home screen
│   └── profile.tsx            # Profile screen with sign out
└── screens/
    └── auth/                  # Authentication screens
        ├── login.tsx          # Email/password login
        ├── signup.tsx         # Email/password signup
        └── onboarding.tsx     # User profile onboarding

config/
└── firebase.ts                # Firebase initialization with AsyncStorage persistence

contexts/
└── auth-context.tsx          # Auth context (signUp, signIn, signOut, user state)

models/
└── user.ts                   # TypeScript User and AuthState interfaces
```

## Authentication Flow

### Sign Up Flow
1. App opens → Redirected to login screen (if not authenticated)
2. User taps "Sign Up" → Navigates to signup screen
3. User enters email and password → Account created with Firebase
4. Redirected to onboarding → User enters name, age, and bio
5. User completes onboarding → Redirected to home screen

### Sign In Flow
1. App opens → Redirected to login screen (if not authenticated)
2. User enters credentials → Signs in with Firebase
3. Redirected to home screen (tabs)

### Sign Out Flow
1. User navigates to Profile tab
2. User taps "Sign Out" button
3. Confirmation dialog appears
4. User confirms → Signed out and redirected to login

## Form Validation

All auth screens include comprehensive form validation:

### Login Screen (`app/screens/auth/login.tsx`)
- Email format validation
- Password required (min 6 characters)
- Error messages displayed inline
- Loading states during authentication

### Signup Screen (`app/screens/auth/signup.tsx`)
- Email format validation
- Password strength (min 6 characters)
- Password confirmation matching
- Error messages displayed inline
- Loading states during account creation

### Onboarding Screen (`app/screens/auth/onboarding.tsx`)
- Name required
- Age validation (1-150)
- Bio minimum length (10 characters)
- Multiline text input for bio
- Numeric keyboard for age input

## Authentication Context

The `AuthContext` (`contexts/auth-context.tsx`) provides:

```typescript
interface AuthContextType {
  user: User | null;           // Current authenticated user
  loading: boolean;            // Auth initialization/operation loading state
  error: string | null;        // Auth error messages
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;      // Clear error messages
}
```

### Usage Example

```typescript
import { useAuth } from '../contexts/auth-context';

function MyComponent() {
  const { user, signIn, loading, error } = useAuth();
  
  const handleLogin = async () => {
    try {
      await signIn(email, password);
      // User is now authenticated, route protection handles redirect
    } catch (error) {
      // Error is set in context and can be displayed
    }
  };
}
```

## Protected Routes

Routes are automatically protected using Expo Router's `useSegments` hook in `app/_layout.tsx`:

- **Unauthenticated users**: Automatically redirected to `/screens/auth/login`
- **Authenticated users**: Automatically redirected to `/(tabs)` if trying to access auth screens
- **Session persistence**: User remains logged in across app restarts using AsyncStorage

## User Model

TypeScript interface for user data (`models/user.ts`):

```typescript
interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt?: string;
  // Onboarding data
  name?: string;
  age?: number;
  bio?: string;
}
```

## UI Components

All screens use React Native core components:
- `View`, `Text`, `TextInput`, `TouchableOpacity`
- `KeyboardAvoidingView` for proper keyboard handling
- `ScrollView` for scrollable content
- `ActivityIndicator` for loading states
- `StyleSheet` for styling
- Platform-specific behavior (iOS/Android)

## Next Steps

### Optional Enhancements

1. **Firestore Integration**: Store user profile data from onboarding
   ```bash
   npm install firebase/firestore
   ```

2. **Password Reset**: Add forgot password functionality
   ```typescript
   import { sendPasswordResetEmail } from 'firebase/auth';
   ```

3. **Email Verification**: Send verification emails after signup
   ```typescript
   import { sendEmailVerification } from 'firebase/auth';
   ```

4. **Social Auth**: Add Google, Apple, or Facebook login
   ```bash
   npm install @react-native-google-signin/google-signin
   ```

5. **Profile Updates**: Allow users to update their profile information

6. **Avatar Upload**: Add profile picture functionality with Firebase Storage

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)
- [Firebase Auth documentation](https://firebase.google.com/docs/auth)
- [React Native documentation](https://reactnative.dev/)

## Troubleshooting

### Firebase Config Not Found
Make sure you've created a `.env.local` file in the root directory with all `EXPO_PUBLIC_FIREBASE_*` variables set. See `.env.example` for the required variables.

### Environment Variables Not Loading
- Restart your development server (`npm start` or `bun start`)
- Make sure you're using the `EXPO_PUBLIC_` prefix for all environment variables
- Verify the `.env.local` file is in the root directory (same level as `package.json`)

### TypeScript Errors
Run `npx expo start --clear` to clear the Metro bundler cache.

### Authentication Not Persisting
Firebase Auth handles persistence automatically in Expo. If issues persist:
- Check that your Firebase config is correct in `.env.local`
- Verify Firebase Authentication is enabled in your Firebase Console
- Try clearing app data and restarting

### Route Protection Not Working
The root layout uses `useSegments()` to detect the current route. Make sure you're using Expo Router v6+ and that the layout structure matches the documented structure.

## License

This project is open source and available under the MIT License.
