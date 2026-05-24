# Epirus Shield

**Real-time bank-scam protection — a native iOS demo built with Expo + CallKit.**

> ### ⚠️ Unaffiliated demo
>
> This is an **independent educational / hackathon project**. It is **not** affiliated with, endorsed by, sponsored by, or operated on behalf of any real bank — including **Τράπεζα Ηπείρου / Epirus Bank**. The "EpirusBank" branding, copy, and mock financial data are used purely as a realistic context for the anti-fraud feature being demonstrated. Do not ship this as a real banking product.

---

## What it is

A native iOS app that warns users about phone scams impersonating their bank. It combines two complementary mechanisms from Apple's **CallKit**:

- **Call Directory extension** — labels known scam / verified bank numbers on the system call screen, even when the app is closed.
- **`CXCallObserver`** — when the app is opened during a call, shows a full-screen warning ("Η Epirus Bank ΔΕΝ σας καλεί ποτέ") with an audio alert.

Wrapped in a realistic Greek-language bank dashboard so the protection is shown in its natural context.

📊 **Pitch deck:** <https://artemisln.github.io/epirus-shield-pitch/>

---

## Features

- Realistic Epirus Bank dashboard (balance, account cards, transactions, navigation).
- Full-screen scam-warning screen with a Greek voice alert (`Προσοχή! Η Epirus Bank δεν σας καλεί ποτέ…`).
- On-device scam-report log.
- **Call Directory extension** labelling verified + scam numbers on the iOS call screen, fed by an App Group container.
- **Foreground call detection** that fires the warning the moment the user opens the app during a call (Revolut-style).
- Demo controls in the Settings screen for simulating a scam call without a real one.
- Fully local — no backend, verified numbers and scam reports live in the app.

---

## Tech stack

- **Expo SDK 56** · React Native 0.85 · TypeScript · React 19
- **expo-router** (file-based routing) · **NativeWind** (Tailwind for RN) · Manrope via `@expo-google-fonts/manrope`
- **Swift + CallKit** — local Expo native module (`modules/call-detector/`) + Call Directory app-extension target (`targets/call-directory/`, wired through `@bacons/apple-targets`)
- **App Groups** for sharing the number list between the main app and the extension
- **`expo-audio`** for the Greek scam-warning playback · **`expo-notifications`** for the local alert
- EAS Build + TestFlight for distribution

---

## Architecture — Layer A + Layer B

| Layer | Mechanism | Works when the app is… | What it does |
|---|---|---|---|
| **A. Always-on labelling** | `CXCallDirectoryProvider` extension | **always** (system-level) | Labels verified Epirus Bank numbers `✓ Epirus Bank` and known scam numbers `⚠️ Πιθανή απάτη` on the iOS call screen. iOS does the matching against a list the main app pushes via the App Group. |
| **B. Foreground warning** | `CXCallObserver` (local Expo module) + `expo-audio` + `expo-notifications` | only while open / foregrounded | When the user opens the app during *any* call, shows the full red warning screen and plays the audio alert. |

> iOS does **not** wake a suspended app for an incoming cellular call, so Layer B alone cannot fire from a cold start — Layer A covers that case for *known* numbers. This is exactly the same constraint Truecaller and similar apps work within.

---

## Repo layout

```
.
├── app/                       # Expo Router screens (_layout, index, transfer, warning, settings)
├── components/                # ShieldBanner, WarningOverlay, EpirusLogo, HeaderWaves, ui/*
├── providers/                 # CallDetectionProvider (React context for call state)
├── lib/                       # colors, format, notifications, numberSync, polyfills, reports
├── domain/
│   ├── verification/          # CallState, VerifiedNumber, VerifiedDomain, ScamReport
│   └── data/                  # bundled verified / scam number seed data
├── modules/call-detector/     # Local Expo module — CXCallObserver + Call Directory sync
├── targets/call-directory/    # iOS Call Directory app extension (via @bacons/apple-targets)
├── assets/                    # icon, logos, scam-warning.mp3, splash, android icons
├── app.json · eas.json · babel.config.js · metro.config.js · tailwind.config.js · tsconfig.json
└── package.json
```

---

## Setup (fork & run on your own Apple account)

This is a development build — `expo-dev-client` is required and Expo Go cannot load the native modules. You need a Mac with Xcode and an Apple Developer account.

```bash
npm install
```

Then edit `app.json` and `eas.json` to replace the project-specific identifiers (see the table below), and:

```bash
# Generate the native ios/ project with your identifiers baked in
npx expo prebuild -p ios --clean

# Start the dev server
npx expo start
```

Then open `ios/EpirusBank.xcworkspace` in Xcode, pick your iPhone as the run destination, and press **▶ Run**. The first build takes a few minutes; subsequent runs are incremental.

For TestFlight distribution, use EAS Build:

```bash
npx eas login
npx eas build --platform ios --profile production
npx eas submit --platform ios --latest
```

### Identifiers you must replace before building

| Where | Current value | What it is |
|---|---|---|
| `app.json` → `expo.ios.appleTeamId` | `JDHGY38643` | Your Apple Developer Team ID |
| `app.json` → `expo.ios.bundleIdentifier` | `com.epirusbank.shield` | iOS bundle identifier for the main app |
| `app.json` → `expo.ios.entitlements["com.apple.security.application-groups"]` | `group.com.epirusbank.shield` | App Group identifier shared with the Call Directory extension |
| `app.json` → `expo.extra.eas.build.experimental.ios.appExtensions[].bundleIdentifier` | `com.epirusbank.shield.CallDirectory` | Bundle ID for the Call Directory extension target |
| `app.json` → `expo.extra.eas.projectId` | `70cccc03-…` | Your EAS project ID (run `npx eas init` after replacing) |
| `targets/call-directory/expo-target.config.js` | matches above | Mirror of the extension bundle ID and App Group |
| `modules/call-detector/ios/CallDetectorModule.swift` | `appGroupId` constant | Mirror of the App Group identifier |
| `targets/call-directory/CallDirectoryHandler.swift` | `appGroupId` constant | Same |

---

## Verifying the demo

1. **Foreground call detection** — in the app, open **Settings → "Ύποπτη κλήση"**. The red warning screen opens, the Greek audio alert plays, and the app navigates to `/warning`.
2. **Real foreground detection** — with the app open, have someone call your iPhone. The same warning screen fires.
3. **Call Directory labelling** — on the iPhone, go to **Settings → Phone → Call Blocking & Identification** and enable **EpirusBank**. In the app, **Settings → "Συγχρονισμός αριθμών"**. Calls from numbers in `domain/data/verified-numbers.json` show **"✓ Epirus Bank — …"**; numbers in `domain/data/scam-numbers.json` show **"⚠️ Πιθανή απάτη — Epirus Shield"** on the system call screen, even with the app closed.

---

## Limitations

- **`CXCallObserver` requires the app to be alive.** iOS does not wake a suspended or terminated app for an incoming cellular call, so Layer B is only a foreground/just-opened experience. This is a platform constraint, not a missing feature.
- **Call Directory works off a finite list** the app pushes to iOS. It cannot label a call from a number that isn't on that list — production use would need a server-curated scam-number database (e.g. crowdsourced reports + a feed from Hiya / Truecaller / carriers).
- **No real backend.** Verified Epirus numbers are bundled as JSON and scam reports are stored on-device. There is no shared scam-report database between users.
- A third-party app **cannot read the caller's phone number** from inside its own process. The Call Directory match happens inside iOS; only the system call screen ever sees the labelled number. Same constraint as Truecaller, Hiya, Revolut, Monzo.

---

## Team

- **Aikaterini Artemis Leonardou** — Full-Stack Engineer
- **Eleni Zafiri** — Business Operations
- **Angeliki Diamantopoulou** — Research & CyberSecurity

---

## License

[MIT](./LICENSE) — © 2026 Aikaterini Artemis Leonardou and contributors.
