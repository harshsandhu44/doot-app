# Firebase Cloud Functions

This directory contains Firebase Cloud Functions for push notifications.

## Setup

1. Install dependencies:
```bash
cd functions
npm install
```

2. Build the functions:
```bash
npm run build
```

## Functions

### onMatchCreated
Triggered when a new match is created in Firestore. Sends push notifications to both users.

### onMessageCreated
Triggered when a new message is created in Firestore. Sends a push notification to the message receiver.

## Deployment

Deploy functions to Firebase:
```bash
npm run deploy
```

Or deploy from the root directory:
```bash
firebase deploy --only functions
```

## Development

Run functions locally with emulators:
```bash
npm run serve
```

## Notes

- Functions use Expo Push Notification service
- Make sure users have valid push tokens in their profiles
- Functions run automatically on Firestore document creation
