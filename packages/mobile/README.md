# PsychCombo Mobile

React Native app built with [Expo](https://expo.dev) (SDK 55) and [Expo Router](https://expo.github.io/router/docs).

## Prerequisites

- **Node.js** ≥ 20 and npm ≥ 10
- **EAS CLI** — `npm install -g eas-cli`
- **Expo account** — sign up at [expo.dev](https://expo.dev) and log in with `eas login`
- **Android Studio** (for emulator or SDK tools) — [download](https://developer.android.com/studio)
  - Make sure `adb` is on your `PATH` (it ships with Android Studio's platform-tools)

---

## Installing dependencies

From the **repo root** (uses npm workspaces):

```bash
npm install
```

Or from this package directory:

```bash
cd packages/mobile
npm install
```

---

## Running in development (Expo Go / local server)

```bash
# from repo root
npm run start --workspace mobile

# or from packages/mobile
npx expo start
```

Press `a` to open in an Android emulator, or scan the QR code with the **Expo Go** app on your phone.

> **Note:** Some features (native modules, custom fonts loaded via expo-font, etc.) require a proper development build rather than Expo Go.

---

## Running directly on a local Android device

### 1 — Enable USB Debugging on your phone

1. Open **Settings → About phone**.
2. Tap **Build number** 7 times to unlock Developer Options.
3. Go to **Settings → Developer options** and enable **USB debugging**.
4. Connect the phone via USB and accept the RSA key prompt on the device.
5. Verify the device is visible:
   ```bash
   adb devices
   # Should show something like: emulator-5554  device
   ```

### 2 — Build and run with `expo run:android`

This compiles the native Android project locally (requires Android Studio / SDK) and pushes it directly to the connected device:

```bash
# from packages/mobile
npx expo run:android --device
```

Or via the npm script:

```bash
npm run android --workspace mobile
```

The `--device` flag lets you pick a connected device or emulator interactively. The app is built in debug mode and launched automatically.

---

## EAS Build

[EAS Build](https://docs.expo.dev/build/introduction/) compiles the app in the cloud (or locally with `--local`).

### First-time setup

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Verify the project is linked (run from packages/mobile)
cd packages/mobile
eas project:info
```

### Build profiles

| Profile | Purpose | Android output |
|---------|---------|----------------|
| `development` | Dev client build for local device testing | APK (sideloadable) |
| `preview` | Internal QA distribution | APK (sideloadable) |
| `production` | Store release | AAB (Google Play) |

### Build in the cloud

```bash
# from packages/mobile

# Development build (installs expo-dev-client, enables live reloading)
eas build --profile development --platform android

# Preview build (production JS, easy to share internally)
eas build --profile preview --platform android

# Production build (for Google Play submission)
eas build --profile production --platform android
```

After the build finishes, EAS prints a download link. Download the `.apk` and install it:

```bash
adb install path/to/downloaded.apk
```

### Build locally (no EAS servers)

Use `--local` to run the build on your own machine. Requires Android Studio and the Android SDK.

```bash
# from packages/mobile
eas build --profile development --platform android --local
```

The APK is output to `./build-*.apk` in the current directory. Install it:

```bash
adb install ./build-*.apk
```

### Install an APK directly via ADB

```bash
# Install (and replace existing version)
adb install -r path/to/app.apk

# If multiple devices are connected, target one explicitly
adb -s <device-serial> install -r path/to/app.apk
```

---

## OTA updates (EAS Update)

After installing a development or production build, you can push JS-only updates without rebuilding:

```bash
# from packages/mobile

# Push an update to the development channel
eas update --branch development --message "Fix typo"

# Push to preview / production
eas update --branch preview --message "New feature"
eas update --branch production --message "Release 1.2.0"
```

---

## Other useful commands

```bash
# Check for Expo / dependency health issues
npm run doctor --workspace mobile

# Type-check TypeScript
npm run typecheck --workspace mobile

# Lint
npm run lint --workspace mobile
```

---

## Submitting to Google Play

```bash
# from packages/mobile (after a successful production build)
eas submit --platform android --latest
```

This uses the `submit.production.android` config in `eas.json` and submits to the **internal** track automatically.

---

## Project structure

```
packages/mobile/
├── app/              # Expo Router file-based routes
├── assets/           # Icons, images, fonts
├── components/       # Shared UI components
├── constants/        # Theme colours, etc.
├── hooks/            # Custom React hooks
├── lib/              # Utilities
├── app.json          # Expo config (bundle ID, EAS project ID, …)
└── eas.json          # EAS build profiles
```
