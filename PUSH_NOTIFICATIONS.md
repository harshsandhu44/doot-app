# Push Notifications Setup

## Overview

Push notifications are automatically sent when:
- Users get a new match
- Users receive a new message

## Quick Setup

### 1. Get Expo Project ID

```bash
# Login to Expo
expo login

# Initialize EAS if not already done
eas init
```

Copy your project ID from the output or from https://expo.dev

### 2. Add to Environment Variables

Add to `.env.local`:
```
EXPO_PUBLIC_EXPO_PROJECT_ID=your_expo_project_id_here
```

### 3. Test on Physical Device

Push notifications require a physical device (iOS/Android). They don't work on simulators.

```bash
# For iOS
npm run ios

# For Android
npm run android
```

## How It Works

1. **On Login**: App requests permissions and registers push token to user profile
2. **On Match**: Both users receive "It's a Match!" notification
3. **On Message**: Receiver gets notification with sender name and message preview
4. **On Logout**: Push token is removed from user profile

## Files

- `services/notifications.ts` - Token registration and notification setup
- `services/push-notifications.ts` - Send notifications via Expo Push API
- `contexts/auth-context.tsx` - Manages token registration on auth state change
- `services/swipe.ts` - Sends match notifications
- `services/messages.ts` - Sends message notifications
- `models/user.ts` - UserProfile includes `metadata.pushToken`

## Testing

1. Create two accounts on different devices
2. Like each other to trigger match notification
3. Send a message to trigger message notification

Or use Expo's push notification tool: https://expo.dev/notifications

## Troubleshooting

**No notifications received?**
- Check permissions are granted
- Verify push token is saved in Firestore user document
- Ensure testing on physical device
- Check console for errors

**Push token not generated?**
- Verify `EXPO_PUBLIC_EXPO_PROJECT_ID` is set
- Check you're logged into Expo CLI
- Ensure internet connection
